# Change: Implement Download Center with Real-time Progress Tracking

## Why
The Downloads page currently displays mock data with no actual download functionality. Users need to download BSP packages (Board Support Package files) from various sources with real-time progress tracking, download speed monitoring, and completion notifications to effectively manage large file downloads (often exceeding 10GB).

## What Changes
- Implement actual file download functionality with HTTP/HTTPS support
- Add real-time progress tracking displaying:
  - Download percentage (0-100%)
  - Current download speed (MB/s or KB/s)
  - Estimated time remaining (calculated based on speed and file size)
  - Downloaded bytes vs. total bytes
- Integrate download save location with Settings workspace path configuration
- Implement desktop notification system for download events
- Add popup notification when downloads complete successfully or fail
- Replace mock download data with configurable download item catalog using sample URLs
- Implement download pause/resume/cancel functionality
- Add concurrent download support with queue management

## Impact
- Affected specs: 
  - **NEW**: `download-management` - Core download functionality with progress tracking
  - **NEW**: `notifications` - Desktop notification system for user alerts
- Affected code:
  - `frontend/src/pages/Downloads.jsx` - Add real download UI with progress indicators
  - `frontend/src/pages/Downloads.scss` - Update styles for download progress UI
  - `frontend/src/pages/Settings.jsx` - Already has workspace path configuration
  - `frontend/src/hooks/useDownload.js` - NEW: Custom hook for download management
  - `frontend/src/hooks/useNotifications.js` - NEW: Custom hook for notification management
  - `frontend/src/store/appStore.js` - Add download state management
  - `frontend/src/utils/constants.js` - Update MOCK_DOWNLOADS with real downloadable URLs
  - `app.go` - NEW: Go backend methods for file download, progress tracking, and notifications
  - `main.go` - Wire up new App methods to Wails runtime

## Technical Notes
- Large file downloads (>10GB) require streaming to avoid memory issues
- Progress updates should throttle to ~500ms intervals to avoid UI performance degradation
- Desktop notifications require Wails runtime integration with OS notification APIs
- Download resumption requires HTTP Range request support (check server capabilities)
- Concurrent downloads should be limited to 3 simultaneous downloads to avoid bandwidth saturation

