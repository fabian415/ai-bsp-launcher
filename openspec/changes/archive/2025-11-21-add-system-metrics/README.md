# System Metrics Integration - Change Proposal

## Overview

This change proposal adds real-time system monitoring capabilities to the BSP Launcher Dashboard, replacing hardcoded placeholder values with actual CPU, memory, and disk usage data from the host system.

## Quick Reference

- **Change ID**: `add-system-metrics`
- **Status**: Awaiting Approval ⏳
- **Affected Capability**: `system-monitoring` (new)
- **Tasks**: 0/24 completed

## Files Created

```
openspec/changes/add-system-metrics/
├── proposal.md          # High-level overview (Why, What, Impact)
├── tasks.md             # 24 implementation tasks (4 phases)
├── design.md            # Technical decisions and architecture
└── specs/
    └── system-monitoring/
        └── spec.md      # 6 requirements with 18 scenarios
```

## Key Technical Decisions

1. **Library**: Use `gopsutil` for cross-platform system metrics
2. **Polling**: 2-second interval for real-time updates
3. **API Design**: Single `GetSystemMetrics()` call + individual methods
4. **Error Handling**: Graceful fallback to "N/A" or last known values
5. **Disk Selection**: Primary system disk (C:\ or /)

## Implementation Phases

### Phase 1: Backend (Tasks 1.1-1.6)
- Add gopsutil dependency
- Implement Go methods for CPU, memory, disk metrics
- Handle errors gracefully

### Phase 2: Frontend (Tasks 2.1-2.8)
- Update useWails hook
- Connect Dashboard component to backend
- Implement polling and formatting

### Phase 3: Testing (Tasks 3.1-3.6)
- Regenerate Wails bindings
- Test on Windows
- Verify real-time updates and no memory leaks

### Phase 4: Documentation (Tasks 4.1-4.4)
- Add code comments
- Verify no errors
- Commit changes

## Requirements Summary

1. **Real-time CPU Usage Display** (3 scenarios)
   - Show CPU percentage
   - Update every 2 seconds
   - Handle failures gracefully

2. **Real-time Memory Usage Display** (3 scenarios)
   - Show used/total memory in GB
   - Display percentage bar
   - Format to 1 decimal place

3. **Real-time Disk Usage Display** (3 scenarios)
   - Show used/total disk space in GB
   - Display percentage bar
   - Use primary system disk

4. **Cross-platform System Metrics** (3 scenarios)
   - Works on Windows, macOS, Linux
   - Values match native tools (Task Manager, top, Activity Monitor)
   - Within 5% accuracy margin

5. **Efficient Metrics Polling** (3 scenarios)
   - 2-second polling interval
   - No memory leaks
   - < 50ms response time, < 1% CPU overhead

6. **Graceful Error Handling** (3 scenarios)
   - Show last known values on transient failures
   - Show "N/A" on persistent failures
   - No user-facing error alerts

## Next Steps

### Before Implementation
1. **Review this proposal** with the team
2. **Approve the change** if acceptable
3. **Clarify any open questions** (see design.md)

### After Approval
1. Start with Phase 1 (Backend Implementation)
2. Follow tasks.md sequentially
3. Mark tasks as complete in tasks.md
4. Run `openspec validate add-system-metrics --strict` after changes
5. Archive the change after deployment

## Validation

```bash
# Validate the proposal
openspec validate add-system-metrics --strict

# View proposal details
openspec show add-system-metrics

# Check task progress
openspec list
```

## Related Documentation

- **OpenSpec Guide**: `openspec/AGENTS.md`
- **Project Context**: `openspec/project.md`
- **Wails Docs**: https://wails.io/docs/
- **gopsutil Docs**: https://github.com/shirou/gopsutil

## Questions?

See `design.md` section "Open Questions" for technical clarifications, or contact the development team.

