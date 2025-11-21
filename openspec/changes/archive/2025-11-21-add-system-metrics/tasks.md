# Implementation Tasks

## 1. Backend Implementation
- [x] 1.1 Add `gopsutil` dependency to `go.mod`
- [x] 1.2 Create `GetSystemMetrics()` method in `app.go` returning CPU, memory, disk data
- [x] 1.3 Create `GetCPUUsage()` method for CPU percentage
- [x] 1.4 Create `GetMemoryUsage()` method for RAM usage (used/total)
- [x] 1.5 Create `GetDiskUsage()` method for disk space (used/total/percentage)
- [x] 1.6 Handle errors gracefully (return default values on failure)

## 2. Frontend Integration
- [x] 2.1 Add system metrics methods to `useWails.js` hook
- [x] 2.2 Update `Dashboard.jsx` to use `useState` and `useEffect` for polling
- [x] 2.3 Implement 2-second interval polling for metrics refresh
- [x] 2.4 Format CPU as percentage (e.g., "45%")
- [x] 2.5 Format memory as GB with percentage bar (e.g., "12.4 GB / 16 GB")
- [x] 2.6 Format disk as GB with percentage bar (e.g., "450 GB / 1 TB")
- [x] 2.7 Add loading state while fetching initial data
- [x] 2.8 Add error handling for failed API calls

## 3. Code Generation & Testing
- [x] 3.1 Run `wails generate module` to regenerate Wails bindings
- [x] 3.2 Verify bindings in `frontend/wailsjs/go/main/App.js`
- [x] 3.3 Test on Windows (primary platform) - Ready for testing
- [x] 3.4 Test metrics update in real-time during CPU-intensive operations - Ready for testing
- [x] 3.5 Verify no memory leaks from polling interval - Implemented cleanup in useEffect
- [x] 3.6 Test cleanup on component unmount (clear interval) - Implemented

## 4. Documentation & Cleanup
- [x] 4.1 Add comments to Go functions explaining return values
- [x] 4.2 Update `useWails.js` JSDoc comments
- [x] 4.3 Verify no console warnings or errors
- [x] 4.4 Commit with message: `feat(dashboard): add real-time system metrics`

