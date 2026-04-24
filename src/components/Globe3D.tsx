'use client';

import { useRef, useMemo, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { MissileEvent, MissileEventType } from '@/types';

const EARTH_RADIUS = 2;
const ATMOSPHERE_RADIUS = 2.08;

const MISSILE_COLORS: Record<string, number> = {
  ICBM: 0xff2020,
  MRBM: 0xff2020,
  SRBM: 0xff2020,
  CRUISE: 0xff6600,
  DRONE: 0xffaa00,
  AIRSTRIKE: 0xff4444,
  ARTILLERY: 0xffaa00,
  INTERCEPTION: 0x00ff88,
};

const ARC_HEIGHT_FACTOR: Record<string, number> = {
  ICBM: 0.9,
  MRBM: 0.7,
  SRBM: 0.5,
  CRUISE: 0.35,
  DRONE: 0.2,
  AIRSTRIKE: 0.4,
  ARTILLERY: 0.3,
  INTERCEPTION: 0.5,
};

const TYPE_OPACITY: Record<string, number> = {
  ICBM: 0.85,
  MRBM: 0.85,
  SRBM: 0.85,
  CRUISE: 0.7,
  DRONE: 0.7,
  AIRSTRIKE: 0.65,
  ARTILLERY: 0.7,
  INTERCEPTION: 0.9,
};

// ─── Lat/lon to 3D ───
export function latLonToVec3(lat: number, lon: number, r: number): THREE.Vector3 {
  const phi = (90 - lat) * Math.PI / 180;
  const theta = (lon + 180) * Math.PI / 180;
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta)
  );
}

// ─── Atmosphere Shader ───
const atmosphereVertexShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const atmosphereFragmentShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  void main() {
    vec3 viewDirection = normalize(-vPosition);
    float fresnel = pow(1.0 - dot(viewDirection, vNormal), 3.0);
    float intensity = fresnel * 1.2;
    vec3 atmosphereColor = vec3(0.3, 0.6, 1.0);
    gl_FragColor = vec4(atmosphereColor, intensity * 0.6);
  }
`;

// ─── Earth ───
function Earth({ wireframe = false }: { wireframe?: boolean }) {
  const earthTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#0a1628';
    ctx.fillRect(0, 0, 1024, 512);
    ctx.fillStyle = '#1a2f1a';
    const continents = [
      [180, 160, 80, 60, -0.3],
      [240, 320, 40, 80, 0.2],
      [500, 140, 50, 35, 0],
      [520, 260, 55, 90, 0],
      [700, 150, 120, 70, 0],
      [820, 360, 50, 30, 0],
    ];
    continents.forEach(([x, y, rx, ry, rot]) => {
      ctx.beginPath();
      ctx.ellipse(x as number, y as number, rx as number, ry as number, rot as number, 0, Math.PI * 2);
      ctx.fill();
    });
    for (let i = 0; i < 5000; i++) {
      ctx.fillStyle = `rgba(100, 140, 180, ${Math.random() * 0.08})`;
      ctx.fillRect(Math.random() * 1024, Math.random() * 512, 2, 2);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, []);

  const nightTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, 1024, 512);
    const cities = [
      [39.9, 116.4], [35.7, 139.7], [28.6, 77.2], [19.1, 72.9], [1.4, 103.8],
      [55.8, 37.6], [51.5, -0.1], [48.9, 2.3], [52.5, 13.4], [40.7, -74.0],
      [34.1, -118.2], [41.9, -87.6], [25.8, -80.2], [-23.5, -46.6], [-34.6, -58.4],
      [30.0, 31.2], [33.3, 44.4], [24.7, 46.7], [32.1, 34.8], [37.6, 127.0],
    ];
    cities.forEach(([lat, lon]) => {
      const x = ((lon + 180) / 360) * 1024;
      const y = ((90 - lat) / 180) * 512;
      const grad = ctx.createRadialGradient(x, y, 0, x, y, 8);
      grad.addColorStop(0, 'rgba(255, 220, 120, 0.8)');
      grad.addColorStop(1, 'rgba(255, 180, 60, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(x - 8, y - 8, 16, 16);
    });
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, []);

  return (
    <mesh>
      <sphereGeometry args={[EARTH_RADIUS, 64, 64]} />
      {wireframe ? (
        <meshBasicMaterial color="#0f1830" wireframe />
      ) : (
        <meshStandardMaterial
          map={earthTexture}
          emissiveMap={nightTexture}
          emissive={new THREE.Color('#ffcc66')}
          emissiveIntensity={0.4}
          roughness={0.8}
          metalness={0.1}
        />
      )}
    </mesh>
  );
}

// ─── Atmosphere ───
function Atmosphere() {
  return (
    <mesh>
      <sphereGeometry args={[ATMOSPHERE_RADIUS, 64, 64]} />
      <shaderMaterial
        vertexShader={atmosphereVertexShader}
        fragmentShader={atmosphereFragmentShader}
        transparent
        side={THREE.BackSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

// ─── Grid Lines ───
function GridLines({ visible = true }: { visible?: boolean }) {
  const lines = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let lat = -80; lat <= 80; lat += 20) {
      for (let lon = -180; lon < 180; lon += 5) {
        pts.push(latLonToVec3(lat, lon, EARTH_RADIUS * 1.002));
        pts.push(latLonToVec3(lat, lon + 5, EARTH_RADIUS * 1.002));
      }
    }
    for (let lon = -180; lon < 180; lon += 30) {
      for (let lat = -90; lat < 90; lat += 5) {
        pts.push(latLonToVec3(lat, lon, EARTH_RADIUS * 1.002));
        pts.push(latLonToVec3(lat + 5, lon, EARTH_RADIUS * 1.002));
      }
    }
    return pts;
  }, []);

  if (!visible) return null;

  return (
    <lineSegments>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[new Float32Array(lines.flatMap((v) => [v.x, v.y, v.z])), 3]}
        />
      </bufferGeometry>
      <lineBasicMaterial color="#1a3a5c" transparent opacity={0.15} />
    </lineSegments>
  );
}

// ─── Launch Origin Pulse Ring ───
function LaunchPulseRing({ lat, lon, color }: { lat: number; lon: number; color: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const pos = useMemo(() => latLonToVec3(lat, lon, EARTH_RADIUS * 1.005), [lat, lon]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    const scale = 1 + Math.sin(t * 2.5) * 0.5;
    const opacity = 0.6 - (scale - 1) * 0.4;
    meshRef.current.scale.set(scale, scale, 1);
    (meshRef.current.material as THREE.MeshBasicMaterial).opacity = Math.max(0, opacity);
    meshRef.current.lookAt(0, 0, 0);
  });

  return (
    <mesh ref={meshRef} position={pos}>
      <ringGeometry args={[0.02, 0.03, 32]} />
      <meshBasicMaterial color={color} transparent opacity={0.6} side={THREE.DoubleSide} />
    </mesh>
  );
}

// ─── Missile Arc ───
function MissileArc({
  event,
  onComplete,
}: {
  event: MissileEvent;
  onComplete?: (id: string, status: string) => void;
}) {
  const headRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [showEffect, setShowEffect] = useState<'burst' | 'flash' | null>(null);
  const completedRef = useRef(false);

  const color = MISSILE_COLORS[event.type] || 0xffaa00;
  const opacity = TYPE_OPACITY[event.type] || 0.7;
  const arcHeight = ARC_HEIGHT_FACTOR[event.type] || 0.5;

  const { points, origin, target } = useMemo(() => {
    const o = latLonToVec3(event.origin[0], event.origin[1], EARTH_RADIUS * 1.015);
    const t = latLonToVec3(event.target[0], event.target[1], EARTH_RADIUS * 1.015);
    const startN = o.clone().normalize();
    const endN = t.clone().normalize();
    const angle = startN.angleTo(endN);
    const height = Math.min(angle * arcHeight, 1.2);
    const mid = startN.clone().add(endN).normalize().multiplyScalar(EARTH_RADIUS + height);
    const curve = new THREE.QuadraticBezierCurve3(o, mid, t);
    return { points: curve.getPoints(80), origin: o, target: t };
  }, [event.origin, event.target, arcHeight]);

  const linePrimitive = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    const mat = new THREE.LineBasicMaterial({
      color,
      transparent: true,
      opacity: event.status === 'intercepted' ? opacity * 0.4 : opacity,
    });
    return new THREE.Line(geo, mat);
  }, [points, color, opacity, event.status]);

  const completionEffect = useMemo(() => {
    return event.status === 'intercepted' ? 'burst' as const : 'flash' as const;
  }, [event.status]);

  useFrame(({ clock }) => {
    if (event.status !== 'active' || !headRef.current) return;
    const t = (clock.getElapsedTime() * 0.12) % 1;
    const idx = Math.floor(t * (points.length - 1));
    const pt = points[Math.min(idx, points.length - 1)];
    headRef.current.position.copy(pt);
    const pulse = 1 + 0.35 * Math.sin(clock.getElapsedTime() * 0.12);
    headRef.current.scale.setScalar(pulse);

    if (t > 0.98 && !completedRef.current) {
      completedRef.current = true;
      setShowEffect(completionEffect);
      onComplete?.(event.id, event.status);
      setTimeout(() => setShowEffect(null), 1500);
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={linePrimitive} />
      {event.status === 'active' && (
        <mesh ref={headRef} position={origin}>
          <sphereGeometry args={[0.012, 8, 8]} />
          <meshBasicMaterial color={0xffffff} />
        </mesh>
      )}
      {showEffect === 'burst' && <BurstEffect position={target} color={0x00ff88} />}
      {showEffect === 'flash' && <ImpactFlash position={target} color={color} />}
    </group>
  );
}

// ─── Burst Effect (intercepted) ───
function BurstEffect({ position, color }: { position: THREE.Vector3; color: number }) {
  const particlesRef = useRef<THREE.Group>(null);
  const startTime = useRef(Date.now());

  useFrame(() => {
    if (!particlesRef.current) return;
    const elapsed = (Date.now() - startTime.current) / 1000;
    const progress = Math.min(elapsed / 1.5, 1);
    particlesRef.current.children.forEach((child, i) => {
      const mesh = child as THREE.Mesh;
      const angle = (i / 6) * Math.PI * 2;
      const dist = progress * 0.15;
      mesh.position.set(
        position.x + Math.cos(angle) * dist,
        position.y + Math.sin(angle) * dist,
        position.z + Math.sin(angle + i) * dist * 0.5
      );
      (mesh.material as THREE.MeshBasicMaterial).opacity = 1 - progress;
    });
  });

  return (
    <group ref={particlesRef}>
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh key={i} position={position}>
          <sphereGeometry args={[0.008, 6, 6]} />
          <meshBasicMaterial color={color} transparent opacity={1} />
        </mesh>
      ))}
    </group>
  );
}

// ─── Impact Flash ───
function ImpactFlash({ position, color }: { position: THREE.Vector3; color: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const startTime = useRef(Date.now());

  useFrame(() => {
    if (!meshRef.current) return;
    const elapsed = (Date.now() - startTime.current) / 1000;
    const progress = Math.min(elapsed / 0.8, 1);
    const scale = 1 + progress * 3;
    meshRef.current.scale.setScalar(scale);
    (meshRef.current.material as THREE.MeshBasicMaterial).opacity = 1 - progress;
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.02, 12, 12]} />
      <meshBasicMaterial color={color} transparent opacity={1} blending={THREE.AdditiveBlending} />
    </mesh>
  );
}

// ─── Camera Controller ───
const CameraController = forwardRef(function CameraController(
  { view }: { view: string },
  ref
) {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);

  useImperativeHandle(ref, () => ({
    zoomIn: () => {
      const dir = new THREE.Vector3();
      camera.getWorldDirection(dir);
      camera.position.add(dir.multiplyScalar(-0.3));
      const dist = camera.position.length();
      if (dist < 2.5) camera.position.setLength(2.5);
    },
    zoomOut: () => {
      const dir = new THREE.Vector3();
      camera.getWorldDirection(dir);
      camera.position.add(dir.multiplyScalar(0.3));
      const dist = camera.position.length();
      if (dist > 8) camera.position.setLength(8);
    },
    getCamera: () => camera,
    getControls: () => controlsRef.current,
  }));

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={false}
      enableZoom={true}
      minDistance={2.5}
      maxDistance={8}
      autoRotate
      autoRotateSpeed={0.3}
      enableDamping
      dampingFactor={0.05}
    />
  );
});

// ─── Scene ───
function Scene({
  missiles,
  view,
  gridVisible,
  wireframe,
  cameraRef,
}: {
  missiles: MissileEvent[];
  view: string;
  gridVisible: boolean;
  wireframe: boolean;
  cameraRef: React.RefObject<any>;
}) {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 3, 5]} intensity={0.5} />
      <pointLight position={[-5, -3, -5]} intensity={0.2} color="#4488ff" />

      <Earth wireframe={wireframe} />
      <Atmosphere />
      <GridLines visible={gridVisible} />
      <Stars radius={50} depth={50} count={3000} factor={3} saturation={0} fade speed={0.5} />

      {/* Missile arcs */}
      {missiles.map((m) => (
        <group key={m.id}>
          <LaunchPulseRing lat={m.origin[0]} lon={m.origin[1]} color={MISSILE_COLORS[m.type] || 0xffaa00} />
          <MissileArc event={m} />
        </group>
      ))}

      {/* Static conflict markers */}
      <mesh position={latLonToVec3(50.45, 30.52, EARTH_RADIUS * 1.01)}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshBasicMaterial color={0xff2244} />
      </mesh>
      <mesh position={latLonToVec3(31.5, 34.8, EARTH_RADIUS * 1.01)}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshBasicMaterial color={0xff2244} />
      </mesh>
      <mesh position={latLonToVec3(33.3, 44.4, EARTH_RADIUS * 1.01)}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshBasicMaterial color={0xff6600} />
      </mesh>
      <mesh position={latLonToVec3(15.4, 44.2, EARTH_RADIUS * 1.01)}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshBasicMaterial color={0xff6600} />
      </mesh>

      <CameraController ref={cameraRef} view={view} />
    </>
  );
}

// ─── Main Export ───
export interface Globe3DRef {
  zoomIn: () => void;
  zoomOut: () => void;
  getCamera: () => THREE.Camera;
}

interface Globe3DProps {
  view?: string;
  gridVisible?: boolean;
  wireframe?: boolean;
  cameraRef?: React.RefObject<Globe3DRef>;
}

export default function Globe3D({ view = 'global', gridVisible = true, wireframe = false, cameraRef }: Globe3DProps) {
  const [mounted, setMounted] = useState(false);
  const [missiles, setMissiles] = useState<MissileEvent[]>([]);
  const internalCameraRef = useRef<any>(null);
  const activeRef = cameraRef || internalCameraRef;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch missile events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('/api/missile-events');
        if (!res.ok) return;
        const data = await res.json();
        if (data.events) {
          setMissiles((prev) => {
            const newMap = new Map(prev.map((m) => [m.id, m]));
            const now = Date.now();
            data.events.forEach((ev: MissileEvent) => {
              const ts = new Date(ev.timestamp).getTime();
              if (now - ts > 30 * 60 * 1000) return; // skip >30min old
              newMap.set(ev.id, ev);
            });
            return Array.from(newMap.values());
          });
        }
      } catch (e) {
        // silent fail
      }
    };

    fetchEvents();
    const interval = setInterval(fetchEvents, 60000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full bg-bg-void flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl animate-pulse mb-2">🌍</div>
          <div className="text-[10px] text-text-muted font-mono">Loading globe...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-bg-void">
      <Canvas camera={{ position: [0, 3, 6], fov: 45 }}>
        <Scene
          missiles={missiles}
          view={view}
          gridVisible={gridVisible}
          wireframe={wireframe}
          cameraRef={activeRef}
        />
      </Canvas>
    </div>
  );
}
