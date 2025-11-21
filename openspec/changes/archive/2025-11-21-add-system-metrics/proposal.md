# Change: Add Real-time System Metrics to Dashboard

## Why

The Dashboard currently displays hardcoded placeholder values for CPU usage (12%), RAM usage (8.4 GB), and disk usage (450 GB). Users need to see actual real-time system metrics to monitor resource consumption during BSP build operations, which are CPU and memory intensive.

## What Changes

- Add Go backend functions to retrieve real-time system metrics (CPU, memory, disk usage)
- Integrate `gopsutil` library for cross-platform system information gathering
- Expose system metrics via Wails bindings to frontend
- Update Dashboard component to fetch and display live system data
- Add periodic polling mechanism to refresh metrics every 2 seconds
- Format metrics with proper units (%, GB, percentage bars)

## Impact

- **Affected specs**: `system-monitoring` (new capability)
- **Affected code**:
  - Backend: `app.go` (add system metrics methods)
  - Backend: `go.mod` (add gopsutil dependency)
  - Frontend: `frontend/src/pages/Dashboard.jsx` (connect to backend APIs)
  - Frontend: `frontend/src/hooks/useWails.js` (add system metrics hooks)
  - Frontend: `frontend/wailsjs/go/main/App.js` (auto-generated bindings)
- **Dependencies**: New Go package `github.com/shirou/gopsutil/v3`
- **Performance**: Minimal overhead (polling every 2s, lightweight system calls)
- **Cross-platform**: Works on Windows, macOS, Linux (gopsutil handles platform differences)

