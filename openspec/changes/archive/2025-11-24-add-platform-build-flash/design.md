# Design: Platform Build and Flash Implementation

## Context
The BSP LaunchPad needs to execute platform-specific build and flash operations for embedded systems. These operations are typically long-running processes (minutes to hours) that require real-time feedback to users. The application must support multiple hardware platforms with different toolchains and build systems.

### Constraints
- Users may not have actual BSP source code or hardware available (MVP phase)
- Build processes are platform-specific and complex (Yocto, Android Build System, etc.)
- Real-time log streaming is critical for user experience
- Operations must be cancellable
- Cross-platform compatibility (Windows, macOS, Linux)

### Stakeholders
- Embedded system developers who need to build and flash BSP images
- QA engineers testing hardware platforms
- DevOps teams managing BSP releases

## Goals / Non-Goals

### Goals
- Provide executable build and flash operations for 4 platforms
- Stream logs in real-time to frontend (< 500ms latency)
- Support cancellation of running operations
- Track activity history for audit and debugging
- Graceful error handling with user-friendly messages

### Non-Goals
- Real BSP compilation (use simulated scripts for MVP)
- Parallel build/flash operations (one at a time)
- Build configuration customization (use default configs)
- Hardware detection and validation (assume hardware is ready)
- Build artifact management (focus on process execution only)

## Decisions

### Decision 1: Use Python Scripts for Platform Simulation
**Rationale:**
- Python is cross-platform and widely available on developer machines
- Easy to simulate multi-step processes with time delays
- Simple stdout/stderr output for log streaming
- Can be replaced with real build scripts later without changing Go backend

**Alternatives Considered:**
- Shell scripts (bash/PowerShell): Platform-specific, harder to maintain
- Go native implementation: Too tightly coupled, harder to extend
- Docker containers: Overkill for MVP, adds complexity

### Decision 2: Use Wails Runtime Events for Log Streaming
**Rationale:**
- Wails provides `runtime.EventsEmit` for backend-to-frontend communication
- Event-driven architecture fits real-time streaming use case
- No need for polling or WebSocket setup
- Built-in support in Wails framework

**Implementation:**
```go
// Backend emits events
runtime.EventsEmit(ctx, "build:log", logLine)
runtime.EventsEmit(ctx, "build:progress", progress)
runtime.EventsEmit(ctx, "build:complete", result)

// Frontend listens
runtime.EventsOn(ctx, "build:log", (data) => addLog(data))
```

**Alternatives Considered:**
- Polling with `GetBuildStatus()`: High latency, inefficient
- WebSocket: Overkill, Wails already provides event system
- File watching: Complex, platform-dependent

### Decision 3: Single Active Process at a Time
**Rationale:**
- Simplifies state management (no concurrent process tracking)
- Prevents resource contention (CPU, disk I/O)
- Typical user workflow is sequential (build → flash)
- Easier to implement cancellation

**Alternatives Considered:**
- Concurrent builds: Complex, not needed for MVP
- Queue system: Over-engineered for single-user desktop app

### Decision 4: Activity Tracking in JSON File
**Rationale:**
- Simple persistence without database dependency
- Human-readable for debugging
- Easy to backup and transfer
- Sufficient for MVP (< 1000 activities expected)

**Schema:**
```json
{
  "activities": [
    {
      "id": "uuid",
      "timestamp": "2025-11-24T13:26:00Z",
      "platformID": "nvidia",
      "platformName": "NVIDIA Jetson Orin",
      "operation": "build",
      "status": "success",
      "duration": 125,
      "bootOption": "sd"
    }
  ]
}
```

**Alternatives Considered:**
- SQLite database: Overkill for simple list
- In-memory only: Loses history on app restart
- System logs: Not user-friendly for UI display

### Decision 5: Platform Script Naming Convention
**Pattern:** `{vendor}_{model}.py`
- `qualcomm_qsc8250.py`
- `nvidia_agx_orin.py`
- `rockchip_rk3588.py`
- `nxp_imx8m.py`

**Rationale:**
- Clear mapping from platform ID to script file
- Vendor name helps identify toolchain requirements
- Model name ensures uniqueness

## Risks / Trade-offs

### Risk 1: Python Not Installed on User Machine
**Mitigation:**
- Check Python availability on app startup
- Show clear error message with installation instructions
- Document Python as a prerequisite in README
- Future: Bundle Python interpreter with app (PyInstaller, py2exe)

### Risk 2: Long-Running Process Blocking UI
**Mitigation:**
- Run Python scripts in separate goroutines
- Use context.Context for cancellation
- Emit progress events regularly (every 1-2 seconds)
- Show cancel button in UI

### Risk 3: Script Output Encoding Issues (Windows)
**Mitigation:**
- Use UTF-8 encoding for Python scripts
- Handle different line endings (CRLF vs LF)
- Test on Windows, macOS, Linux

### Risk 4: Activity History File Corruption
**Mitigation:**
- Write to temporary file first, then rename (atomic operation)
- Validate JSON structure before writing
- Limit activity history to last 100 entries (auto-prune)
- Add error recovery (fallback to empty history)

## Migration Plan

### Phase 1: MVP Implementation (Current)
1. Create Python simulation scripts
2. Implement Go backend with log streaming
3. Integrate frontend with real API calls
4. Add basic activity tracking

### Phase 2: Real BSP Integration (Future)
1. Replace Python scripts with actual build commands
2. Add build configuration UI
3. Implement artifact management
4. Add hardware detection

### Phase 3: Advanced Features (Future)
1. Parallel build support
2. Build caching and incremental builds
3. Remote build server support
4. Build analytics and optimization

### Rollback Strategy
- Python scripts are isolated in `scripts/platforms/`
- Go methods are additive (no breaking changes to existing APIs)
- Frontend changes are backward compatible (graceful degradation)
- Can revert to mock implementation by removing backend calls

## Open Questions

1. **Should we validate Python version (3.8+)?**
   - Recommendation: Yes, check version and warn if < 3.8

2. **Should we support custom script paths for advanced users?**
   - Recommendation: Not for MVP, add in Phase 2

3. **Should we limit log history to prevent memory issues?**
   - Recommendation: Yes, limit to last 1000 lines in UI, full logs in file

4. **Should we add build/flash duration estimates?**
   - Recommendation: Not for MVP (scripts are simulated), add in Phase 2 with real data

5. **Should we support multiple boot options per platform?**
   - Recommendation: Yes, pass as command-line argument to scripts

