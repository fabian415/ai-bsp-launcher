## ADDED Requirements

### Requirement: Activity Entry Creation
The system SHALL create activity entries after successful completion of build or flash operations.

#### Scenario: Create activity after successful build
- **GIVEN** a build operation completes successfully
- **WHEN** the script exits with code 0
- **THEN** the system creates a new activity entry with:
  - Unique ID (UUID)
  - Timestamp (ISO 8601 format)
  - Platform ID (e.g., "nvidia")
  - Platform name (e.g., "NVIDIA Jetson Orin")
  - Operation type ("build")
  - Status ("success")
  - Duration in seconds
  - Boot option (e.g., "sd")
- **AND** the activity is saved to persistent storage

#### Scenario: Create activity after successful flash
- **GIVEN** a flash operation completes successfully
- **WHEN** the script exits with code 0
- **THEN** the system creates a new activity entry with:
  - Unique ID (UUID)
  - Timestamp (ISO 8601 format)
  - Platform ID (e.g., "rockchip")
  - Platform name (e.g., "Rockchip RK3588")
  - Operation type ("flash")
  - Status ("success")
  - Duration in seconds
  - Boot option (e.g., "emmc")
- **AND** the activity is saved to persistent storage

#### Scenario: Create activity after failed operation
- **GIVEN** a build or flash operation fails
- **WHEN** the script exits with non-zero code
- **THEN** the system creates a new activity entry with:
  - Status ("failed")
  - Error message from script output
  - All other fields populated as normal
- **AND** the activity is saved to persistent storage

#### Scenario: No activity for cancelled operations
- **GIVEN** a build or flash operation is cancelled by user
- **WHEN** the process is terminated
- **THEN** no activity entry is created
- **AND** no data is saved to persistent storage

### Requirement: Activity History Retrieval
The system SHALL provide methods to retrieve recent activity history.

#### Scenario: Get recent activities on Dashboard
- **GIVEN** the user navigates to the Dashboard page
- **WHEN** the page loads
- **THEN** the system retrieves the last 10 activities
- **AND** activities are sorted by timestamp (newest first)
- **AND** each activity shows:
  - Platform name
  - Operation type (Build/Flash)
  - Status (success/failed)
  - Timestamp (relative time, e.g., "2 hours ago")
  - Duration (e.g., "2m 15s")

#### Scenario: Empty activity history
- **GIVEN** no build or flash operations have been completed
- **WHEN** the user views the Dashboard
- **THEN** the activities section shows "No recent activities"
- **AND** no error is displayed

#### Scenario: Activity list with mixed statuses
- **GIVEN** there are 5 successful and 3 failed activities
- **WHEN** the user views the Dashboard
- **THEN** all 8 activities are displayed
- **AND** successful activities show green checkmark icon
- **AND** failed activities show red error icon
- **AND** activities are sorted by timestamp

### Requirement: Activity Persistence
The system SHALL persist activity history to a JSON file for durability across app restarts.

#### Scenario: Save activity to file
- **GIVEN** a new activity entry is created
- **WHEN** the activity is saved
- **THEN** the system writes to `~/.bsp-launcher-activities.json`
- **AND** the file contains a JSON array of activities
- **AND** the file is UTF-8 encoded
- **AND** the write operation is atomic (temp file + rename)

#### Scenario: Load activities on app startup
- **GIVEN** the activities file exists
- **WHEN** the application starts
- **THEN** the system loads activities from the file
- **AND** activities are available for display
- **AND** invalid entries are skipped with warning

#### Scenario: Handle missing activities file
- **GIVEN** the activities file does not exist
- **WHEN** the application starts
- **THEN** the system initializes with empty activity list
- **AND** no error is shown to the user
- **AND** the file is created on first activity save

#### Scenario: Handle corrupted activities file
- **GIVEN** the activities file contains invalid JSON
- **WHEN** the application starts
- **THEN** the system logs a warning
- **AND** initializes with empty activity list
- **AND** the corrupted file is backed up (renamed with .bak extension)
- **AND** a new empty file is created

### Requirement: Activity History Limits
The system SHALL limit activity history to prevent unbounded growth.

#### Scenario: Auto-prune old activities
- **GIVEN** there are 150 activities in history
- **WHEN** a new activity is added
- **THEN** the system keeps only the most recent 100 activities
- **AND** older activities are removed from storage
- **AND** the pruning happens automatically

#### Scenario: Activity count within limit
- **GIVEN** there are 50 activities in history
- **WHEN** a new activity is added
- **THEN** all 51 activities are retained
- **AND** no pruning occurs

### Requirement: Activity Display on Dashboard
The system SHALL display recent activities in a dedicated section on the Dashboard page.

#### Scenario: Activity card shows all details
- **GIVEN** an activity entry exists
- **WHEN** the activity is displayed on Dashboard
- **THEN** the card shows:
  - Platform icon (colored chip)
  - Platform name
  - Operation type badge ("Build" or "Flash")
  - Status indicator (green checkmark or red X)
  - Relative timestamp (e.g., "5 minutes ago")
  - Duration (e.g., "1m 23s")

#### Scenario: Click activity to view details
- **GIVEN** an activity card is displayed
- **WHEN** the user clicks the activity card
- **THEN** the system navigates to the Platform Workspace page
- **AND** selects the corresponding platform
- **AND** shows the historical logs (if available)

#### Scenario: Activity list scrollable
- **GIVEN** there are more than 10 activities
- **WHEN** the user views the Dashboard
- **THEN** the activities section is scrollable
- **AND** shows a "View All" link to see full history

### Requirement: Activity Duration Calculation
The system SHALL calculate and store the duration of build and flash operations.

#### Scenario: Calculate build duration
- **GIVEN** a build starts at 13:26:00
- **WHEN** the build completes at 13:28:15
- **THEN** the activity entry stores duration as 135 seconds
- **AND** the UI displays "2m 15s"

#### Scenario: Calculate flash duration
- **GIVEN** a flash starts at 14:00:00
- **WHEN** the flash completes at 14:01:05
- **THEN** the activity entry stores duration as 65 seconds
- **AND** the UI displays "1m 5s"

#### Scenario: Duration for failed operations
- **GIVEN** a build starts at 10:00:00
- **WHEN** the build fails at 10:00:45
- **THEN** the activity entry stores duration as 45 seconds
- **AND** the UI displays "45s"
- **AND** the status is "failed"

