# system-monitoring Specification

## Purpose
TBD - created by archiving change add-system-metrics. Update Purpose after archive.
## Requirements
### Requirement: Real-time CPU Usage Display
The Dashboard SHALL display the current CPU usage percentage of the host system, updated every 2 seconds.

#### Scenario: CPU usage shown on Dashboard
- **GIVEN** the user is on the Dashboard page
- **WHEN** the page loads
- **THEN** the CPU usage card displays the current CPU percentage (0-100%)
- **AND** the percentage updates every 2 seconds
- **AND** the progress bar width reflects the percentage value

#### Scenario: CPU usage during build operation
- **GIVEN** a BSP build is running
- **WHEN** the user views the Dashboard
- **THEN** the CPU usage reflects the increased load (e.g., 80-100%)
- **AND** the value updates in real-time as build progresses

#### Scenario: CPU metrics unavailable
- **GIVEN** the system metrics API fails
- **WHEN** the Dashboard attempts to fetch CPU data
- **THEN** the CPU card displays "N/A" or the last known value
- **AND** an error is logged to the console
- **AND** the UI does not crash or show error alerts

### Requirement: Real-time Memory Usage Display
The Dashboard SHALL display the current memory (RAM) usage in gigabytes and percentage, updated every 2 seconds.

#### Scenario: Memory usage shown on Dashboard
- **GIVEN** the user is on the Dashboard page
- **WHEN** the page loads
- **THEN** the memory card displays used memory in GB (e.g., "8.4 GB")
- **AND** the progress bar shows the percentage of total memory used
- **AND** the values update every 2 seconds

#### Scenario: Memory usage formatting
- **GIVEN** the system has 16 GB total RAM
- **WHEN** 8.4 GB is in use
- **THEN** the card displays "8.4 GB"
- **AND** the progress bar shows 52% width
- **AND** values are rounded to 1 decimal place

#### Scenario: Memory metrics unavailable
- **GIVEN** the system metrics API fails
- **WHEN** the Dashboard attempts to fetch memory data
- **THEN** the memory card displays "N/A" or the last known value
- **AND** the UI remains functional

### Requirement: Real-time Disk Usage Display
The Dashboard SHALL display the current disk usage in gigabytes and percentage, updated every 2 seconds.

#### Scenario: Disk usage shown on Dashboard
- **GIVEN** the user is on the Dashboard page
- **WHEN** the page loads
- **THEN** the disk card displays used disk space in GB (e.g., "450 GB")
- **AND** the progress bar shows the percentage of total disk used
- **AND** the values update every 2 seconds

#### Scenario: Disk usage for primary system disk
- **GIVEN** the system has multiple disk drives
- **WHEN** the Dashboard fetches disk metrics
- **THEN** it displays usage for the primary system disk (C:\ on Windows, / on Linux/macOS)
- **AND** the disk path is determined automatically

#### Scenario: Disk metrics unavailable
- **GIVEN** the system metrics API fails
- **WHEN** the Dashboard attempts to fetch disk data
- **THEN** the disk card displays "N/A" or the last known value
- **AND** the UI remains functional

### Requirement: Cross-platform System Metrics
The system metrics feature SHALL work on Windows, macOS, and Linux without platform-specific code in the frontend.

#### Scenario: Metrics on Windows
- **GIVEN** the application runs on Windows 10/11
- **WHEN** the Dashboard fetches system metrics
- **THEN** CPU, memory, and disk (C:\) usage are displayed correctly
- **AND** values match Windows Task Manager within 5% margin

#### Scenario: Metrics on Linux
- **GIVEN** the application runs on Linux
- **WHEN** the Dashboard fetches system metrics
- **THEN** CPU, memory, and disk (/) usage are displayed correctly
- **AND** values match `top` and `df` commands within 5% margin

#### Scenario: Metrics on macOS
- **GIVEN** the application runs on macOS
- **WHEN** the Dashboard fetches system metrics
- **THEN** CPU, memory, and disk (/) usage are displayed correctly
- **AND** values match Activity Monitor within 5% margin

### Requirement: Efficient Metrics Polling
The Dashboard SHALL fetch system metrics every 2 seconds without causing performance degradation or memory leaks.

#### Scenario: Polling interval
- **GIVEN** the Dashboard is mounted
- **WHEN** the component initializes
- **THEN** system metrics are fetched immediately
- **AND** subsequent fetches occur every 2 seconds
- **AND** the interval is cleared when the component unmounts

#### Scenario: No memory leaks
- **GIVEN** the Dashboard has been open for 10 minutes
- **WHEN** metrics have been polled 300 times (10 min * 30 fetches/min)
- **THEN** memory usage does not increase significantly (< 10 MB growth)
- **AND** no interval timers remain after unmounting

#### Scenario: Minimal backend overhead
- **GIVEN** the backend fetches system metrics
- **WHEN** a metrics request is made
- **THEN** the response time is under 50ms
- **AND** CPU overhead is negligible (< 1% additional load)

### Requirement: Graceful Error Handling
The system SHALL handle metrics API failures without disrupting the user experience.

#### Scenario: Transient API failure
- **GIVEN** the Dashboard is polling metrics
- **WHEN** a single API call fails (network/timeout)
- **THEN** the UI displays the last known values
- **AND** polling continues on the next interval
- **AND** no error modal or alert is shown to the user

#### Scenario: Persistent API failure
- **GIVEN** the metrics API fails 3 consecutive times
- **WHEN** the Dashboard attempts to fetch metrics
- **THEN** the UI displays "N/A" for all metrics
- **AND** errors are logged to the browser console
- **AND** the Dashboard remains interactive (other features work)

#### Scenario: Backend method not available
- **GIVEN** the Wails bindings are not generated
- **WHEN** the Dashboard attempts to call `GetSystemMetrics()`
- **THEN** the frontend catches the error
- **AND** displays fallback values or "N/A"
- **AND** logs a warning to the console

