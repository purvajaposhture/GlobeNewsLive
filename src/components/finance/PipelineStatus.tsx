'use client';

import pipelines from '@/data/pipelines.json';

export interface Pipeline {
  name: string;
  operator: string;
  from: string;
  to: string;
  capacity: number;
  unit: string;
  status: 'OFFLINE' | 'REDUCED' | 'ONLINE';
}

const STATUS_STYLES: Record<string, string> = {
  ONLINE: 'bg-green-900/40 text-green-400 border-green-800/40',
  OFFLINE: 'bg-red-900/40 text-red-400 border-red-800/40',
  REDUCED: 'bg-amber-900/40 text-amber-400 border-amber-800/40',
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase tracking-wide ${STATUS_STYLES[status] ?? STATUS_STYLES.OFFLINE}`}>
      {status}
    </span>
  );
}

export default function PipelineStatus() {
  const data = pipelines as Pipeline[];

  return (
    <div className="shrink-0 flex flex-col border border-white/[0.08] bg-[#0f0f14]" style={{ maxHeight: '340px' }}>
      <div className="px-3 py-2 border-b border-white/[0.08] flex items-center gap-2 shrink-0">
        <div className="w-1 h-3 bg-red-500 rounded-full" />
        <span className="text-[10px] font-mono font-bold text-white/80 tracking-wider">OIL & GAS PIPELINE STATUS</span>
      </div>

      {/* Scrollable table body */}
      <div className="overflow-y-auto flex-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
        <table className="w-full text-[11px] font-mono">
          <thead className="sticky top-0 bg-gray-950 z-10">
            <tr className="text-[9px] text-gray-600 uppercase tracking-wider border-b border-white/5">
              <th className="text-left px-2 py-1.5">Asset</th>
              <th className="text-center px-1 py-1.5">From-To</th>
              <th className="text-right px-1 py-1.5">Cap.</th>
              <th className="text-right px-2 py-1.5">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((p, i) => (
              <tr key={i} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                <td className="px-2 py-1.5 text-gray-300 max-w-[120px]">
                  <span className="truncate block" title={p.name}>{p.name}</span>
                  <span className="text-[9px] text-gray-600 block">{p.operator}</span>
                </td>
                <td className="px-1 py-1.5 text-center text-gray-500">{p.from}-{p.to}</td>
                <td className="px-1 py-1.5 text-right text-gray-400">
                  {p.capacity}
                  <span className="text-[9px] text-gray-600 block">{p.unit}</span>
                </td>
                <td className="px-2 py-1.5 text-right">
                  <StatusBadge status={p.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
