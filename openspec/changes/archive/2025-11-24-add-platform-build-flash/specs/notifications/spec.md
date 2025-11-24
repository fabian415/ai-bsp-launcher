## ADDED Requirements

### Requirement: Desktop Notifications for Build Completion
The system SHALL trigger OS-level desktop notifications when build operations complete successfully or fail.

#### Scenario: Notification on build completion
- **GIVEN** a build operation is in progress
- **WHEN** the build completes successfully
- **THEN** a desktop notification appears with:
  - Title: "Build Complete"
  - Message: "[Platform Name] build completed successfully"
  - Icon: Application icon or checkmark
- **AND** the notification is visible for at least 5 seconds
- **AND** clicking the notification brings the application window to focus

#### Scenario: Notification shows platform name
- **GIVEN** a build for "NVIDIA Jetson Orin" completes successfully
- **WHEN** the completion notification is triggered
- **THEN** the notification message is "NVIDIA Jetson Orin build completed successfully"

#### Scenario: Notification on build failure
- **GIVEN** a build operation is in progress
- **WHEN** the build fails with an error
- **THEN** a desktop notification appears with:
  - Title: "Build Failed"
  - Message: "[Platform Name] build failed: [Error message]"
  - Icon: Application icon or error symbol
- **AND** clicking the notification brings the application to the Platform Workspace page

#### Scenario: Build notification when app is minimized
- **GIVEN** the application is minimized to the system tray
- **WHEN** a build completes
- **THEN** the desktop notification appears even though the app is not visible
- **AND** clicking the notification restores and focuses the application window

### Requirement: Desktop Notifications for Flash Completion
The system SHALL trigger OS-level desktop notifications when flash operations complete successfully or fail.

#### Scenario: Notification on flash completion
- **GIVEN** a flash operation is in progress
- **WHEN** the flash completes successfully
- **THEN** a desktop notification appears with:
  - Title: "Flash Complete"
  - Message: "[Platform Name] flash completed successfully"
  - Icon: Application icon or checkmark
- **AND** the notification is visible for at least 5 seconds
- **AND** clicking the notification brings the application window to focus

#### Scenario: Notification shows platform and boot option
- **GIVEN** a flash for "Rockchip RK3588" with "eMMC Boot" completes successfully
- **WHEN** the completion notification is triggered
- **THEN** the notification message is "Rockchip RK3588 flash completed successfully (eMMC)"

#### Scenario: Notification on flash failure
- **GIVEN** a flash operation is in progress
- **WHEN** the flash fails with an error
- **THEN** a desktop notification appears with:
  - Title: "Flash Failed"
  - Message: "[Platform Name] flash failed: [Error message]"
  - Icon: Application icon or error symbol
- **AND** clicking the notification brings the application to the Platform Workspace page

#### Scenario: Flash notification when app is in background
- **GIVEN** the application is running but not the active window
- **WHEN** a flash completes
- **THEN** the desktop notification appears
- **AND** the user can see the notification without switching to the app

### Requirement: Build/Flash Notification Respects Settings
The system SHALL respect the notification settings when triggering build and flash notifications.

#### Scenario: Notifications enabled in Settings
- **GIVEN** the user has enabled notifications in Settings
- **WHEN** a build or flash operation completes
- **THEN** desktop notifications are triggered as expected

#### Scenario: Notifications disabled in Settings
- **GIVEN** the user has disabled notifications in Settings
- **WHEN** a build or flash operation completes
- **THEN** no desktop notification is shown
- **AND** an in-app toast notification may still appear (optional)

#### Scenario: Fallback toast for build completion
- **GIVEN** desktop notifications are not supported or permission is denied
- **WHEN** a build completes successfully
- **THEN** an in-app toast notification appears at the top-right of the window with:
  - Title: "Build Complete"
  - Message: "[Platform Name]"
  - Auto-dismisses after 5 seconds
- **AND** the toast has a success icon and green color scheme

#### Scenario: Fallback toast for flash failure
- **GIVEN** desktop notifications are unavailable
- **WHEN** a flash fails
- **THEN** an in-app toast appears with:
  - Title: "Flash Failed"
  - Message: "[Platform Name]: [Error]"
  - Auto-dismisses after 8 seconds
- **AND** the toast has an error icon and red color scheme

