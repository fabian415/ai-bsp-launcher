# Design: System Metrics Integration

## Context

BSP build operations are resource-intensive (CPU, memory, disk I/O). Users need visibility into system resource consumption to:
- Monitor if their machine can handle builds
- Detect resource bottlenecks during builds
- Plan hardware upgrades if needed

The Dashboard UI already has placeholder cards for CPU, RAM, and Disk usage, but they display hardcoded values.

## Goals / Non-Goals

### Goals
- Display real-time CPU usage percentage
- Display real-time memory usage (used/total in GB)
- Display real-time disk usage (used/total in GB)
- Update metrics every 2 seconds
- Work cross-platform (Windows, macOS, Linux)
- Minimal performance overhead

### Non-Goals
- Historical metrics tracking (no charts/graphs)
- Per-process CPU/memory breakdown
- Network usage monitoring
- Temperature/fan speed monitoring
- Configurable polling interval (fixed at 2s)

## Decisions

### Decision 1: Use `gopsutil` Library
**Rationale**: 
- Cross-platform (Windows/macOS/Linux)
- Well-maintained (>10k GitHub stars)
- Used by many production tools (Docker, Kubernetes monitoring)
- Simple API for CPU, memory, disk metrics

**Alternatives Considered**:
- Native Go `syscall` package → Too low-level, platform-specific code
- `gosigar` → Less maintained, fewer features
- External CLI tools (top, wmic) → Fragile, parsing overhead

### Decision 2: Polling Interval = 2 Seconds
**Rationale**:
- Balance between responsiveness and performance
- CPU usage calculation requires time delta (gopsutil needs ~1s minimum)
- 2s feels responsive without excessive API calls

**Alternatives Considered**:
- 1 second → Too frequent, CPU overhead
- 5 seconds → Feels sluggish for real-time monitoring

### Decision 3: Single `GetSystemMetrics()` vs Separate Methods
**Decision**: Provide both
- `GetSystemMetrics()` returns all metrics in one call (efficient)
- Individual methods (`GetCPUUsage()`, etc.) for flexibility

**Rationale**: Frontend can fetch all at once, but other components might need only CPU or memory.

### Decision 4: Error Handling Strategy
**Decision**: Return default/last-known values on error, log to console
**Rationale**:
- Don't break UI if metrics fail temporarily
- Show "N/A" or last value instead of crashing
- Log errors for debugging but don't alert user

## Data Structures

### Go Backend Response

```go
type SystemMetrics struct {
    CPU     CPUMetrics     `json:"cpu"`
    Memory  MemoryMetrics  `json:"memory"`
    Disk    DiskMetrics    `json:"disk"`
}

type CPUMetrics struct {
    UsagePercent float64 `json:"usagePercent"` // 0-100
}

type MemoryMetrics struct {
    UsedGB      float64 `json:"usedGB"`
    TotalGB     float64 `json:"totalGB"`
    UsedPercent float64 `json:"usedPercent"` // 0-100
}

type DiskMetrics struct {
    UsedGB      float64 `json:"usedGB"`
    TotalGB     float64 `json:"totalGB"`
    UsedPercent float64 `json:"usedPercent"` // 0-100
    Path        string  `json:"path"`        // "/" or "C:\"
}
```

### Frontend State

```javascript
const [metrics, setMetrics] = useState({
  cpu: { usagePercent: 0 },
  memory: { usedGB: 0, totalGB: 0, usedPercent: 0 },
  disk: { usedGB: 0, totalGB: 0, usedPercent: 0, path: '' }
});
```

## Implementation Flow

```
1. Dashboard.jsx mounts
   ↓
2. useEffect() starts 2s interval
   ↓
3. Call useWails().getSystemMetrics()
   ↓
4. Wails bindings call Go App.GetSystemMetrics()
   ↓
5. gopsutil fetches CPU/Memory/Disk data
   ↓
6. Return JSON to frontend
   ↓
7. Update React state → UI re-renders
   ↓
8. Repeat every 2s until component unmounts
   ↓
9. useEffect cleanup clears interval
```

## Risks / Trade-offs

### Risk 1: gopsutil Compatibility Issues
**Mitigation**: 
- gopsutil is mature and widely used
- Test on all target platforms (Windows 10/11, macOS, Linux)
- Fallback to default values if library fails

### Risk 2: Polling Performance Overhead
**Impact**: Minimal (gopsutil is efficient, ~1ms per call)
**Mitigation**: 
- Only poll when Dashboard is visible (future optimization)
- Use single `GetSystemMetrics()` call instead of 3 separate calls

### Risk 3: Disk Path Selection
**Issue**: Systems may have multiple disks (C:, D:, /home, /mnt)
**Decision**: Use primary system disk (where app is installed)
**Future**: Add disk selector dropdown if users request it

### Risk 4: Memory Leaks from Interval
**Mitigation**: 
- Properly clear interval in useEffect cleanup
- Test component mount/unmount cycles
- Verify with React DevTools Profiler

## Migration Plan

### Phase 1: Backend Implementation
1. Add gopsutil dependency
2. Implement Go methods
3. Test in isolation (Go unit tests optional)

### Phase 2: Frontend Integration
1. Update useWails hook
2. Regenerate Wails bindings (`wails dev`)
3. Update Dashboard component
4. Test in dev mode

### Phase 3: Validation
1. Test on Windows (primary platform)
2. Verify metrics accuracy (compare with Task Manager)
3. Test during CPU-intensive builds
4. Check for memory leaks (long-running session)

### Rollback Plan
If metrics fail:
- Frontend gracefully shows "N/A" or last values
- No impact on other app functionality
- Can disable polling by commenting out useEffect

## Open Questions

1. **Q**: Should we monitor specific disk (C:\ vs D:\) or allow user selection?
   **A**: Start with primary system disk, add selector if requested

2. **Q**: Should polling pause when Dashboard is not visible?
   **A**: Not in MVP, but good future optimization (use Page Visibility API)

3. **Q**: Should we show per-core CPU usage?
   **A**: No, aggregate percentage is sufficient for MVP

4. **Q**: Should metrics be stored in Zustand global state?
   **A**: No, local component state is fine (only Dashboard uses it)

