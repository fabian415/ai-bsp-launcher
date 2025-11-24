# Design: Download Center Implementation

## Context
BSP LaunchPad users need to download large files (2-15GB BSP packages) from various sources. The current UI is a mockup with no actual functionality. We need a production-ready download system with real-time progress tracking, desktop notifications, and integration with the existing workspace path settings.

### Constraints
- Large files require streaming to disk (cannot hold entire file in memory)
- Users may be on slow networks (need pause/resume capability)
- Cross-platform support (Windows, macOS, Linux) required
- Downloads may be from internal servers (corporate proxies must be supported)
- Multiple concurrent downloads needed (but limited to avoid resource exhaustion)

### Stakeholders
- **End Users**: Embedded system developers who need reliable large file downloads
- **System Admins**: May configure proxy settings and download directories

## Goals / Non-Goals

### Goals
- Download files from HTTP/HTTPS URLs with real-time progress tracking
- Display download speed, percentage, and estimated time remaining
- Save files to user-configured workspace path (from Settings)
- Show desktop notifications on download completion or failure
- Support pause/resume/cancel for active downloads
- Handle network interruptions gracefully (auto-retry with backoff)
- Support concurrent downloads (max 3 simultaneous)

### Non-Goals
- FTP, SFTP, or torrent protocol support (HTTP/HTTPS only)
- Checksum verification (may add in future spec)
- Differential/delta downloads
- Bandwidth throttling controls
- Download scheduling or automation
- Browser-based downloads (all downloads managed by Go backend)

## Decisions

### Decision 1: Go Backend with HTTP Streaming
**What**: Implement downloads in Go backend using `http.Client` with streaming to disk.

**Why**: 
- Go provides excellent HTTP client libraries with streaming support
- Avoids memory issues with large files (stream directly to disk)
- Better control over concurrent downloads and resource management
- Cross-platform file I/O handled by Go runtime

**Alternatives considered**:
- **Frontend-based downloads (Fetch API)**: ❌ Limited control, memory issues with large files, CORS complications
- **External tools (wget, curl)**: ❌ Platform-specific, requires external dependencies, harder to get progress feedback
- **Go with third-party download libraries**: ❌ Adds dependencies, built-in `net/http` is sufficient

### Decision 2: Progress Updates via Polling
**What**: Frontend polls backend for download progress every 500ms using a dedicated API call.

**Why**:
- Simple implementation (no WebSocket overhead)
- Wails doesn't have built-in event streaming (would need custom implementation)
- 500ms interval provides smooth UI updates without excessive API calls
- Polling stops when download completes or component unmounts

**Alternatives considered**:
- **WebSocket streaming**: ❌ Overkill for this use case, adds complexity
- **Wails events**: ⚠️ Possible but requires custom event emitter, polling is simpler
- **Faster polling (100ms)**: ❌ Unnecessary overhead, 500ms is perceptually smooth

### Decision 3: Wails Runtime Notifications for Desktop Alerts
**What**: Use Wails' built-in notification APIs to trigger OS-level notifications.

**Why**:
- Native OS integration (Windows Action Center, macOS Notification Center, Linux notify-send)
- Consistent with desktop app UX patterns
- Wails abstracts cross-platform differences

**Alternatives considered**:
- **In-app toast notifications only**: ❌ User may miss notification if app is minimized
- **Custom notification system**: ❌ Reinventing the wheel, Wails provides this

### Decision 4: Download State in Zustand Store
**What**: Store active downloads, progress, and history in Zustand global state.

**Why**:
- Consistent with existing app architecture (already using Zustand)
- Allows multiple components to read download state (Downloads page, header badge, etc.)
- Persists state during navigation (user can leave Downloads page, download continues)

**Alternatives considered**:
- **Local component state**: ❌ Lost on navigation, harder to share state
- **Backend as source of truth only**: ❌ Requires constant polling, no optimistic UI

### Decision 5: Sample Download Catalog with Real URLs
**What**: Replace `MOCK_DOWNLOADS` with a configurable list of real downloadable files (use public CDN URLs as samples).

**Why**:
- Enables actual testing without requiring users to provide their own BSP files
- Examples: Ubuntu ISOs, Raspberry Pi images, sample large files from CDNs
- Users can configure their own URLs via settings in future enhancement

**Sample URLs**:
- Ubuntu 22.04.3 LTS (5GB): `https://releases.ubuntu.com/22.04.3/ubuntu-22.04.3-desktop-amd64.iso`
- Raspberry Pi OS (2GB): `https://downloads.raspberrypi.org/raspios_full_arm64/images/raspios_full_arm64-2023-10-10/2023-10-10-raspios-bookworm-arm64-full.img.xz`
- Sample 100MB file: `http://speedtest.ftp.otenet.gr/files/test100Mb.db`
- Sample 1GB file: `http://speedtest.ftp.otenet.gr/files/test1Gb.db`

## Architecture

### Component Flow
```
[Downloads.jsx]
      |
      v
[useDownload Hook] <---> [Zustand Store (downloadStore)]
      |                          ^
      v                          |
[Wails API Calls] ---------------|
      |
      v
[app.go Methods]
      |
      +-- StartDownload(url, savePath) -> downloadID
      +-- GetDownloadProgress(downloadID) -> ProgressInfo
      +-- PauseDownload(downloadID)
      +-- ResumeDownload(downloadID)
      +-- CancelDownload(downloadID)
      +-- TriggerNotification(title, message)
```

### Data Structures

#### Go Backend (app.go)
```go
type DownloadItem struct {
    ID               string  `json:"id"`
    URL              string  `json:"url"`
    FileName         string  `json:"fileName"`
    SavePath         string  `json:"savePath"`
    Status           string  `json:"status"` // "pending", "downloading", "paused", "completed", "failed", "cancelled"
    TotalBytes       int64   `json:"totalBytes"`
    DownloadedBytes  int64   `json:"downloadedBytes"`
    Progress         float64 `json:"progress"` // 0-100
    Speed            float64 `json:"speed"` // bytes/sec
    RemainingTime    int     `json:"remainingTime"` // seconds
    Error            string  `json:"error,omitempty"`
    StartedAt        time.Time `json:"startedAt"`
    CompletedAt      *time.Time `json:"completedAt,omitempty"`
}

type DownloadManager struct {
    downloads map[string]*DownloadItem
    mu        sync.RWMutex
}
```

#### Frontend (Zustand Store)
```javascript
const useDownloadStore = create((set, get) => ({
  downloads: [],
  activeDownloads: 0,
  
  addDownload: (download) => { /* ... */ },
  updateProgress: (id, progress) => { /* ... */ },
  completeDownload: (id) => { /* ... */ },
  failDownload: (id, error) => { /* ... */ },
}));
```

### Backend Methods (app.go)

```go
// StartDownload initiates a new file download
func (a *App) StartDownload(url string, fileName string) (string, error)

// GetDownloadProgress returns current progress for a download
func (a *App) GetDownloadProgress(downloadID string) (DownloadItem, error)

// PauseDownload pauses an active download
func (a *App) PauseDownload(downloadID string) error

// ResumeDownload resumes a paused download
func (a *App) ResumeDownload(downloadID string) error

// CancelDownload cancels and removes a download
func (a *App) CancelDownload(downloadID string) error

// GetAllDownloads returns list of all downloads (active and completed)
func (a *App) GetAllDownloads() []DownloadItem

// GetWorkspacePath returns the configured workspace path from settings
func (a *App) GetWorkspacePath() (string, error)

// ShowNotification triggers an OS-level desktop notification
func (a *App) ShowNotification(title string, message string) error
```

## Risks / Trade-offs

### Risk 1: Large File Memory Usage
**Risk**: Downloading 15GB files could cause memory issues if not properly streamed.

**Mitigation**: 
- Use `io.Copy` with buffered reader/writer (32KB chunks)
- Write directly to disk, never hold entire file in memory
- Monitor goroutine count to prevent resource leaks

### Risk 2: Network Interruptions
**Risk**: Unstable networks may cause downloads to fail frequently.

**Mitigation**:
- Implement automatic retry with exponential backoff (3 attempts)
- Support HTTP Range requests for resume capability
- Gracefully handle partial downloads (keep .part files)

### Risk 3: Concurrent Download Limits
**Risk**: Too many concurrent downloads may saturate bandwidth or overwhelm system resources.

**Mitigation**:
- Limit to 3 simultaneous active downloads
- Queue additional downloads (FIFO)
- Allow users to pause/cancel to free slots

### Risk 4: Cross-platform Notification Compatibility
**Risk**: Desktop notifications may not work consistently across OS platforms.

**Mitigation**:
- Test on all supported platforms (Windows 10/11, macOS, Ubuntu)
- Fallback to in-app toast notification if OS notification fails
- Log errors but don't block download completion

## Migration Plan

### Phase 1: Backend Implementation (Days 1-2)
1. Add `DownloadManager` struct to `app.go`
2. Implement core download methods (`StartDownload`, `GetDownloadProgress`)
3. Add file streaming with progress tracking
4. Test with sample URLs (100MB, 1GB files)

### Phase 2: Frontend Integration (Days 3-4)
1. Create `useDownload.js` hook with polling logic
2. Update `Downloads.jsx` with progress UI components
3. Connect to Zustand store for state management
4. Add real-time speed and ETA calculations

### Phase 3: Notifications (Day 5)
1. Implement `ShowNotification` method in Go backend
2. Create `useNotifications.js` hook for frontend
3. Wire up completion/failure notifications
4. Test across platforms

### Phase 4: Polish & Edge Cases (Day 6)
1. Add pause/resume/cancel functionality
2. Implement concurrent download queue
3. Handle edge cases (network errors, disk full, permission issues)
4. Update settings integration

### Rollback Plan
- If issues arise, revert to mock data by commenting out Wails API calls
- Add feature flag: `ENABLE_REAL_DOWNLOADS=false` to disable functionality
- Frontend gracefully handles API failures (shows mock data as fallback)

## Open Questions
1. **Q**: Should we support authentication for downloads (HTTP Basic Auth, OAuth)?
   - **A**: Defer to future enhancement. Start with public URLs only.

2. **Q**: What happens if user changes workspace path while downloads are active?
   - **A**: Existing downloads continue to original path. New downloads use updated path. Show warning dialog.

3. **Q**: Should download history be persisted to disk?
   - **A**: Not in this phase. Zustand state is sufficient. Consider local storage in future.

4. **Q**: Proxy settings integration?
   - **A**: Use Go's `http.Client` with proxy configuration from Settings (if configured). Test with corporate proxies.

5. **Q**: Should we validate disk space before starting download?
   - **A**: Yes. Check available disk space before starting. Show error if insufficient.

