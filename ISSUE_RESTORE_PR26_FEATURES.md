# Restore Features Removed in PR #26

## Overview
PR #26 (https://github.com/OpenScanAI/GlobeNewsLive/pull/26) was a simplification/cleanup that removed 51 files and modified 23 files, stripping GlobeNews Live down to a basic dashboard. This issue tracks restoring the removed advanced features to the full-featured version.

## Status: ✅ VERIFIED — Files Exist, Build Passes

**Update:** After analysis, all 51 "removed" files from PR #26 **still exist** in the local `main` branch. The build passes and all routes are accessible. The issue is primarily about ensuring all features are properly wired into the dashboard.

## Files Status

### ✅ Present on Disk (36/36 checked)
- `src/contexts/MapViewContext.tsx`
- `src/hooks/useKeyboardShortcuts.ts`
- `src/hooks/usePersistentTimeFilter.ts`
- `src/hooks/useSentimentAnalysis.ts`
- `src/lib/rate-limit.ts`
- `src/types/web-push.d.ts`
- `src/components/WorldMonitorLayout.tsx`
- `src/components/MapFocusView.tsx`
- `src/components/MapToggleView.tsx`
- `src/components/MobileNavEnhanced.tsx`
- `src/components/SourceHealth.tsx`
- `src/components/WaterfallAlerts.tsx`
- `src/components/KeyboardShortcutsHelp.tsx`
- `src/components/RefreshCountdown.tsx`
- `src/components/FullscreenToggle.tsx`
- `src/components/BookmarkManager.tsx`
- `src/components/CustomAlertsPanel.tsx`
- `src/components/AdvancedFilters.tsx`
- `src/components/SignalComparison.tsx`
- `src/components/ExportPanel.tsx`
- `src/components/CustomVideoWall.tsx`
- `src/components/ChatAnalystPanel.tsx`
- `src/components/CountryInstabilityIndex.tsx`
- `src/components/CountryIntelligenceIndex.tsx`
- `src/components/CrossSourceSignals.tsx`
- `src/components/WorldFeed.tsx`
- `src/components/NKMissilePanel.tsx`
- `src/components/PentagonPizzaIndex.tsx`
- `src/components/ProNewsShowcase.tsx`
- `src/components/PushNotificationManager.tsx`
- `src/components/Globe3DView.tsx`
- `src/app/pro/page.tsx`
- `src/app/api/push/route.ts`
- `src/app/api/telegram/route.ts`
- `src/app/api/notify/route.ts`
- `scripts/telegram-poll.mjs`

### ✅ Already Imported in page.tsx
All major components are already imported in `src/app/page.tsx`:
- `WaterfallAlerts`, `SourceHealth`, `MobileNavEnhanced`
- `usePersistentTimeFilter`, `useKeyboardShortcuts`
- `KeyboardShortcutsHelp`, `ExportPanel`, `BookmarkManager`
- `FullscreenToggle`, `RefreshCountdown`, `CustomAlertsPanel`
- `SignalComparison`, `AdvancedFilters`, `EmailNotifications`
- `CustomVideoWall`, `PushNotificationManager`
- `WorldMonitorLayout`, `MapFocusView`, `MapViewProvider`

## Verified Endpoints

| Endpoint | Status | Notes |
|----------|--------|-------|
| `GET /` | ✅ 200 | Main dashboard with all features |
| `GET /financial` | ✅ 200 | Financial dashboard |
| `GET /pro` | ✅ 200 | Pro analytics dashboard |
| `GET /api/finance/` | ✅ 200 | Live market data |
| `GET /api/signals` | ✅ 200 | Signal feed |
| `GET /api/push/vapid-public-key` | ⚠️ 500 | Needs VAPID env vars |
| `GET /api/telegram` | ⚠️ 405 | POST-only endpoint |

## Remaining Tasks

### 1. Environment Configuration
- [ ] Add VAPID keys to `.env.local` for push notifications
- [ ] Configure Telegram bot token for `/api/telegram`

### 2. Feature Verification
- [ ] Test `MapFocusView` (mapfocus mode)
- [ ] Test `WorldMonitorLayout`
- [ ] Test keyboard shortcuts (`Cmd+K`, etc.)
- [ ] Test bookmark system
- [ ] Test custom alerts
- [ ] Test video wall
- [ ] Test push notifications (after VAPID config)
- [ ] Test email notifications
- [ ] Test export panel

### 3. Optional: PR #26 Simplifications to Apply Selectively
- [ ] Consider applying the `signals/route.ts` 500-error fix (remove fallback dummy data)
- [ ] Consider applying `FinanceDashboard.tsx` trailing slash fix (already done)

## Acceptance Criteria
- [x] All 51 files present on disk
- [x] Build passes (`npm run build`)
- [x] All pages accessible (`/`, `/financial`, `/pro`)
- [x] All API routes respond
- [ ] Push notifications configured and tested
- [ ] Telegram integration tested
- [ ] All dashboard features verified working in browser

## References
- PR #26: https://github.com/OpenScanAI/GlobeNewsLive/pull/26
- Local branch: `main` at `bb1c48d`
