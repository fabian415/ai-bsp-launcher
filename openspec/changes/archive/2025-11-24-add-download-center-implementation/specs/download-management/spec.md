## ADDED Requirements

### Requirement: Initiate File Download
The system SHALL allow users to start downloading files from HTTP/HTTPS URLs to a configurable local directory.

#### Scenario: Start download from Downloads page
- **GIVEN** the user is on the Downloads page
- **WHEN** the user clicks the download button for a file
- **THEN** the system initiates an HTTP/HTTPS download
- **AND** saves the file to the configured workspace path
- **AND** the download status changes to "downloading"
- **AND** the download is assigned a unique ID

#### Scenario: Download with workspace path configured
- **GIVEN** the user has set workspace path to "/home/user/bsp_workspace" in Settings
- **WHEN** a download is initiated
- **THEN** the file is saved to "/home/user/bsp_workspace/[filename]"
- **AND** the full save path is displayed in the UI

#### Scenario: Insufficient disk space
- **GIVEN** the target file size is 10 GB
- **WHEN** the available disk space is less than 10 GB
- **THEN** the download does NOT start
- **AND** an error message "Insufficient disk space" is displayed
- **AND** the required vs available space is shown

#### Scenario: Invalid URL
- **GIVEN** the user provides an invalid URL (malformed or unreachable)
- **WHEN** the download is initiated
- **THEN** the system validates the URL before starting
- **AND** shows an error message "Invalid or unreachable URL"
- **AND** does not create a download entry

### Requirement: Real-time Download Progress Tracking
The system SHALL display real-time progress information for active downloads, including percentage completed, download speed, and estimated time remaining.

#### Scenario: Progress display during active download
- **GIVEN** a file download is in progress
- **WHEN** the user views the Downloads page
- **THEN** the download shows:
  - Progress percentage (e.g., "45%")
  - Download speed (e.g., "12.5 MB/s" or "850 KB/s")
  - Estimated time remaining (e.g., "2m 35s" or "1h 15m")
  - Downloaded bytes vs total bytes (e.g., "2.1 GB / 4.2 GB")
- **AND** all values update in real-time (every 500ms)

#### Scenario: Progress bar visual representation
- **GIVEN** a download is 45% complete
- **WHEN** the progress bar is rendered
- **THEN** the progress bar fill width is 45% of the total bar width
- **AND** the bar uses a smooth animation for updates
- **AND** the percentage text is overlaid on the bar

#### Scenario: Speed calculation for fast downloads
- **GIVEN** a download is transferring at 50 MB/s
- **WHEN** the speed is displayed
- **THEN** the UI shows "50.0 MB/s"
- **AND** the value is rounded to 1 decimal place

#### Scenario: Speed calculation for slow downloads
- **GIVEN** a download is transferring at 850 KB/s
- **WHEN** the speed is displayed
- **THEN** the UI shows "850 KB/s"
- **AND** automatically switches to KB/s for speeds below 1 MB/s

#### Scenario: Estimated time remaining calculation
- **GIVEN** a 10 GB download with 5 GB remaining at 25 MB/s
- **WHEN** the estimated time is calculated
- **THEN** the system computes: 5000 MB / 25 MB/s = 200 seconds
- **AND** displays "3m 20s"
- **AND** the estimate updates dynamically as speed changes

#### Scenario: Progress updates stop after completion
- **GIVEN** a download reaches 100%
- **WHEN** the download completes successfully
- **THEN** progress polling stops immediately
- **AND** the status changes to "completed"
- **AND** speed and time remaining are no longer displayed

### Requirement: Pause and Resume Downloads
The system SHALL allow users to pause active downloads and resume them later without restarting from the beginning.

#### Scenario: Pause an active download
- **GIVEN** a download is actively transferring data
- **WHEN** the user clicks the pause button
- **THEN** the download stops immediately
- **AND** the status changes to "paused"
- **AND** the current progress is preserved
- **AND** the pause button changes to a resume button

#### Scenario: Resume a paused download
- **GIVEN** a download is paused at 45% completion
- **WHEN** the user clicks the resume button
- **THEN** the download resumes from byte offset matching 45% of file size
- **AND** uses HTTP Range header (e.g., "Range: bytes=1887436800-")
- **AND** the status changes to "downloading"
- **AND** progress updates continue from 45%

#### Scenario: Resume fails when server doesn't support Range
- **GIVEN** a download is paused
- **WHEN** the server does not support HTTP Range requests
- **THEN** the system detects the lack of Range support
- **AND** restarts the download from 0%
- **AND** shows a warning "Resume not supported, restarting download"

#### Scenario: Preserve partial file on pause
- **GIVEN** a download is paused at 45%
- **WHEN** the user closes the application
- **THEN** the partial file (e.g., "file.tar.gz.part") remains on disk
- **AND** can be resumed in the next session (future enhancement)

### Requirement: Cancel Downloads
The system SHALL allow users to cancel active or paused downloads and clean up partial files.

#### Scenario: Cancel an active download
- **GIVEN** a download is actively transferring data
- **WHEN** the user clicks the cancel button
- **THEN** the download stops immediately
- **AND** the status changes to "cancelled"
- **AND** the partial file (e.g., "file.tar.gz.part") is deleted from disk
- **AND** the download entry is removed from the active downloads list

#### Scenario: Cancel a paused download
- **GIVEN** a download is paused
- **WHEN** the user clicks the cancel button
- **THEN** the partial file is deleted
- **AND** the download entry is removed

#### Scenario: Cancel confirmation for large partial files
- **GIVEN** a download has already transferred 5 GB of data
- **WHEN** the user clicks the cancel button
- **THEN** a confirmation dialog appears: "Cancel download? 5 GB will be lost."
- **AND** the user can confirm or abort the cancellation

### Requirement: Concurrent Download Management
The system SHALL support multiple concurrent downloads with a maximum limit of 3 simultaneous active downloads.

#### Scenario: Start download when slots available
- **GIVEN** 2 downloads are currently active
- **WHEN** the user starts a third download
- **THEN** the download starts immediately
- **AND** all 3 downloads show progress updates

#### Scenario: Queue download when limit reached
- **GIVEN** 3 downloads are currently active
- **WHEN** the user starts a fourth download
- **THEN** the download is added to a queue with status "queued"
- **AND** a message shows "Waiting for available slot (position 1 in queue)"

#### Scenario: Auto-start queued download when slot opens
- **GIVEN** a download is queued
- **WHEN** one of the active downloads completes or is cancelled
- **THEN** the queued download automatically starts
- **AND** the status changes from "queued" to "downloading"

#### Scenario: Display queue position
- **GIVEN** 5 downloads are requested (3 active, 2 queued)
- **WHEN** the user views the Downloads page
- **THEN** queued downloads show their position: "Queued (position 1)" and "Queued (position 2)"

### Requirement: Download Completion Handling
The system SHALL detect successful download completion, verify file integrity, and update the UI accordingly.

#### Scenario: Successful download completion
- **GIVEN** a download reaches 100% progress
- **WHEN** all bytes are successfully written to disk
- **THEN** the status changes to "completed"
- **AND** the file is renamed from ".part" to the final filename
- **AND** a timestamp is recorded for "CompletedAt"
- **AND** a desktop notification is triggered (see notifications spec)
- **AND** the file appears with a "completed" badge in the UI

#### Scenario: Verify file size matches expected
- **GIVEN** a download completes
- **WHEN** the system checks the downloaded file size
- **THEN** the file size MUST match the Content-Length from HTTP headers (±1% tolerance)
- **AND** if sizes don't match, mark as "failed" with error "Incomplete download"

#### Scenario: Download history retention
- **GIVEN** a download completes successfully
- **WHEN** the application remains open
- **THEN** the completed download remains visible in the Downloads page
- **AND** shows status "completed" with completion timestamp

### Requirement: Network Error Recovery
The system SHALL handle network interruptions gracefully with automatic retry logic and clear error reporting.

#### Scenario: Temporary network interruption
- **GIVEN** a download is in progress
- **WHEN** a network timeout occurs (e.g., connection drops for 5 seconds)
- **THEN** the system automatically retries the download
- **AND** uses exponential backoff (1s, 2s, 4s delays)
- **AND** attempts up to 3 retries before marking as failed

#### Scenario: Persistent network failure
- **GIVEN** a download encounters 3 consecutive network errors
- **WHEN** all retry attempts fail
- **THEN** the status changes to "failed"
- **AND** the error message displays: "Network error: [specific error]"
- **AND** a desktop notification is triggered with the failure message
- **AND** the user can manually retry the download

#### Scenario: HTTP server error (404, 500)
- **GIVEN** a download URL returns HTTP 404 or 500 error
- **WHEN** the download is initiated or in progress
- **THEN** the download fails immediately (no retries for 4xx/5xx errors)
- **AND** shows error: "Server error: 404 Not Found" or "Server error: 500 Internal Server Error"

#### Scenario: Manual retry after failure
- **GIVEN** a download has failed
- **WHEN** the user clicks a "Retry" button
- **THEN** the download restarts from 0%
- **AND** the error message is cleared
- **AND** the status changes to "downloading"

### Requirement: Large File Streaming
The system SHALL download large files (up to 15 GB) using streaming to disk without excessive memory consumption.

#### Scenario: Download 10 GB file with low memory usage
- **GIVEN** a 10 GB BSP package is being downloaded
- **WHEN** the download is in progress
- **THEN** the application memory usage increases by less than 100 MB
- **AND** data is written directly to disk in 32 KB chunks
- **AND** progress updates smoothly without lag

#### Scenario: Download multiple large files concurrently
- **GIVEN** 3 concurrent downloads of 5 GB each are active
- **WHEN** all downloads are transferring data
- **THEN** total application memory increase is less than 200 MB
- **AND** all downloads show accurate progress
- **AND** the system remains responsive

#### Scenario: Disk I/O error during write
- **GIVEN** a download is writing data to disk
- **WHEN** a disk I/O error occurs (e.g., disk disconnected, read-only)
- **THEN** the download stops immediately
- **AND** status changes to "failed"
- **AND** error message shows "Disk write error: [specific error]"
- **AND** the partial file is retained for troubleshooting

### Requirement: Download Configuration via Settings
The system SHALL use the workspace path configured in Settings as the default save location for all downloads.

#### Scenario: Use workspace path from Settings
- **GIVEN** the user has configured workspace path to "/home/user/bsp_workspace"
- **WHEN** a download is initiated
- **THEN** the file is saved to "/home/user/bsp_workspace/[filename]"

#### Scenario: Handle workspace path change during active download
- **GIVEN** a download is in progress saving to "/home/user/old_path"
- **WHEN** the user changes the workspace path to "/home/user/new_path" in Settings
- **THEN** the active download continues to "/home/user/old_path"
- **AND** new downloads use "/home/user/new_path"
- **AND** a warning tooltip shows "Active downloads will complete to original path"

#### Scenario: Invalid workspace path
- **GIVEN** the workspace path is not set or points to an invalid directory
- **WHEN** the user attempts to start a download
- **THEN** an error message shows "Invalid workspace path. Please configure in Settings."
- **AND** the download does NOT start
- **AND** a button links to the Settings page

### Requirement: Prevent Duplicate Downloads
The system SHALL detect and prevent duplicate downloads of the same file.

#### Scenario: Attempt to download same URL twice
- **GIVEN** a download for "https://example.com/file.tar.gz" is active
- **WHEN** the user attempts to download the same URL again
- **THEN** the system shows a warning "This file is already downloading"
- **AND** does NOT create a second download entry

#### Scenario: Allow re-download after completion
- **GIVEN** a download for "https://example.com/file.tar.gz" has completed
- **WHEN** the user attempts to download the same URL again
- **THEN** a confirmation dialog asks "File already exists. Re-download and overwrite?"
- **AND** if confirmed, the new download starts
- **AND** the old file is renamed to "[filename].old" or overwritten

### Requirement: Cross-platform Compatibility
The download system SHALL work identically on Windows, macOS, and Linux without platform-specific code in the frontend.

#### Scenario: Downloads on Windows
- **GIVEN** the application runs on Windows 10/11
- **WHEN** a download is initiated
- **THEN** files are saved to the configured path (e.g., "C:\Users\user\bsp_workspace")
- **AND** progress tracking, pause/resume, and notifications all function correctly

#### Scenario: Downloads on macOS
- **GIVEN** the application runs on macOS
- **WHEN** a download is initiated
- **THEN** files are saved to the configured path (e.g., "/Users/user/bsp_workspace")
- **AND** all download features work identically to Windows

#### Scenario: Downloads on Linux
- **GIVEN** the application runs on Linux
- **WHEN** a download is initiated
- **THEN** files are saved to the configured path (e.g., "/home/user/bsp_workspace")
- **AND** all download features work identically to Windows

