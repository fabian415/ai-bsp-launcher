# Change: Implement Platform Build and Flash Functionality

## Why
The BSP LaunchPad application currently has a UI for platform selection and workspace, but lacks the core functionality to actually build and flash BSP images. Users need to be able to execute build and flash operations for different hardware platforms (Qualcomm, NVIDIA, Rockchip, NXP) with real-time log streaming and activity tracking.

## What Changes
- Create Python simulation scripts for 4 platforms (Qualcomm QSC-8250, NVIDIA AGX-Orin-32G, Rockchip RK3588, NXP IMX8M-PLUS) that:
  - Print platform information and version numbers
  - Display Boot options (SD Card, eMMC, etc.)
  - Simulate build/flash steps with progress output
- Implement Go backend functionality to:
  - Execute Python scripts with platform-specific parameters
  - Stream stdout/stderr in real-time to frontend via Wails runtime events
  - Handle process lifecycle (start, monitor, cancel)
  - Capture exit codes and error handling
- Integrate real-time log streaming to frontend:
  - Replace mock log generation in `useBuildProcess` hook
  - Connect to Wails runtime events for log streaming
  - Display build/flash progress based on script output
- Add activity tracking:
  - Create new activity entries after successful build/flash completion
  - Store activity history (timestamp, platform, operation type, status)
  - Display recent activities on Dashboard

## Impact
- Affected specs:
  - `platform-build-flash` (NEW): Core build/flash execution and log streaming
  - `activity-tracking` (NEW): Activity history management
  - `notifications` (MODIFIED): Add build/flash completion notifications
- Affected code:
  - Backend: `app.go` (new methods for script execution)
  - Scripts: `scripts/platforms/*.py` (new Python scripts)
  - Frontend: `frontend/src/hooks/useBuildProcess.js` (replace mock with real API calls)
  - Frontend: `frontend/src/pages/Dashboard.jsx` (add activity display)
  - Frontend: `frontend/src/store/appStore.js` (add activity state management)

