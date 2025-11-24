## ADDED Requirements

### Requirement: Platform Build Execution
The system SHALL execute platform-specific build operations using Python scripts that simulate BSP compilation processes.

#### Scenario: Initiate build for Qualcomm platform
- **GIVEN** the user has selected the Qualcomm QSC-8250 platform
- **WHEN** the user clicks the "Build" button
- **THEN** the system executes `scripts/platforms/qualcomm_qsc8250.py --operation build --boot-option sd`
- **AND** the build status changes to "building"
- **AND** logs are streamed in real-time to the terminal component

#### Scenario: Build script prints platform information
- **GIVEN** a build operation is initiated for any platform
- **WHEN** the Python script starts execution
- **THEN** the script outputs platform name (e.g., "Qualcomm Snapdragon QSC-8250")
- **AND** outputs BSP version (e.g., "REL_35.4.1")
- **AND** outputs selected boot option (e.g., "Boot Option: SD Card")
- **AND** all output is captured and displayed in the UI

#### Scenario: Build completes successfully
- **GIVEN** a build operation is in progress
- **WHEN** the Python script completes all build steps
- **THEN** the script exits with code 0
- **AND** the build status changes to "completed"
- **AND** the final log shows "Build Successful"
- **AND** a desktop notification is shown
- **AND** a new activity entry is created

#### Scenario: Build fails with error
- **GIVEN** a build operation is in progress
- **WHEN** the Python script encounters an error
- **THEN** the script exits with non-zero code
- **AND** the build status changes to "failed"
- **AND** the error message is displayed in logs
- **AND** a desktop notification shows the failure
- **AND** the activity entry is marked as "failed"

#### Scenario: Build with eMMC boot option
- **GIVEN** the user selects "eMMC Boot" in Quick Config
- **WHEN** the user clicks the "Build" button
- **THEN** the system executes the script with `--boot-option emmc`
- **AND** the script output shows "Boot Option: eMMC"

### Requirement: Platform Flash Execution
The system SHALL execute platform-specific flash operations using Python scripts that simulate BSP image flashing to hardware.

#### Scenario: Initiate flash for NVIDIA platform
- **GIVEN** the user has selected the NVIDIA AGX-Orin-32G platform
- **WHEN** the user clicks the "Flash" button
- **THEN** the system executes `scripts/platforms/nvidia_agx_orin.py --operation flash --boot-option sd`
- **AND** the flash status changes to "flashing"
- **AND** logs are streamed in real-time to the terminal component

#### Scenario: Flash script prints device detection
- **GIVEN** a flash operation is initiated
- **WHEN** the Python script starts execution
- **THEN** the script outputs "Detecting device..." as first step
- **AND** outputs platform name and version
- **AND** outputs selected boot option
- **AND** all output is captured and displayed in the UI

#### Scenario: Flash completes successfully
- **GIVEN** a flash operation is in progress
- **WHEN** the Python script completes all flash steps
- **THEN** the script exits with code 0
- **AND** the flash status changes to "completed"
- **AND** the final log shows "Flash Complete"
- **AND** a desktop notification is shown
- **AND** a new activity entry is created

#### Scenario: Flash fails with error
- **GIVEN** a flash operation is in progress
- **WHEN** the Python script encounters an error
- **THEN** the script exits with non-zero code
- **AND** the flash status changes to "failed"
- **AND** the error message is displayed in logs
- **AND** a desktop notification shows the failure
- **AND** the activity entry is marked as "failed"

### Requirement: Real-time Log Streaming
The system SHALL stream stdout and stderr from Python scripts in real-time to the frontend UI using Wails runtime events.

#### Scenario: Logs appear in real-time during build
- **GIVEN** a build operation is in progress
- **WHEN** the Python script outputs a log line
- **THEN** the log appears in the terminal component within 500ms
- **AND** the log includes timestamp (e.g., "[13:26:45]")
- **AND** logs are displayed in chronological order

#### Scenario: Progress updates during build
- **GIVEN** a build operation is in progress
- **WHEN** the Python script outputs progress information
- **THEN** the progress bar updates to reflect current step
- **AND** the percentage is calculated based on completed steps
- **AND** the UI shows current step description

#### Scenario: Error logs are highlighted
- **GIVEN** a build or flash operation is in progress
- **WHEN** the Python script outputs an error message (stderr)
- **THEN** the error log is displayed in red color
- **AND** the error is distinguishable from normal logs

#### Scenario: Log streaming stops after completion
- **GIVEN** a build or flash operation has completed
- **WHEN** the script exits
- **THEN** no more logs are emitted
- **AND** the terminal shows "Process completed" message
- **AND** the event listener is cleaned up

### Requirement: Process Cancellation
The system SHALL allow users to cancel running build or flash operations.

#### Scenario: Cancel build in progress
- **GIVEN** a build operation is in progress
- **WHEN** the user clicks the "Cancel" button
- **THEN** the system sends termination signal to the Python process
- **AND** the build status changes to "cancelled"
- **AND** the terminal shows "Build cancelled by user"
- **AND** no activity entry is created

#### Scenario: Cancel flash in progress
- **GIVEN** a flash operation is in progress
- **WHEN** the user clicks the "Cancel" button
- **THEN** the system sends termination signal to the Python process
- **AND** the flash status changes to "cancelled"
- **AND** the terminal shows "Flash cancelled by user"
- **AND** no activity entry is created

#### Scenario: Cancel button disabled when idle
- **GIVEN** no build or flash operation is running
- **WHEN** the user views the Platform Workspace
- **THEN** the "Cancel" button is disabled or hidden
- **AND** the "Build" and "Flash" buttons are enabled

### Requirement: Multi-Platform Support
The system SHALL support build and flash operations for four hardware platforms using dedicated Python scripts.

#### Scenario: Qualcomm QSC-8250 build
- **GIVEN** the user selects Qualcomm QSC-8250 platform
- **WHEN** a build is initiated
- **THEN** the system executes `qualcomm_qsc8250.py`
- **AND** the script outputs "Platform: Qualcomm Snapdragon QSC-8250"
- **AND** the script simulates Android Build System steps

#### Scenario: NVIDIA AGX-Orin-32G build
- **GIVEN** the user selects NVIDIA AGX-Orin-32G platform
- **WHEN** a build is initiated
- **THEN** the system executes `nvidia_agx_orin.py`
- **AND** the script outputs "Platform: NVIDIA Jetson Orin AGX-Orin-32G"
- **AND** the script simulates NVIDIA SDK Manager steps

#### Scenario: Rockchip RK3588 build
- **GIVEN** the user selects Rockchip RK3588 platform
- **WHEN** a build is initiated
- **THEN** the system executes `rockchip_rk3588.py`
- **AND** the script outputs "Platform: Rockchip RK3588"
- **AND** the script simulates Rockchip SDK build steps

#### Scenario: NXP IMX8M-PLUS build
- **GIVEN** the user selects NXP IMX8M-PLUS platform
- **WHEN** a build is initiated
- **THEN** the system executes `nxp_imx8m.py`
- **AND** the script outputs "Platform: NXP i.MX 8M Plus IMX8M-PLUS"
- **AND** the script simulates Yocto build steps

### Requirement: Error Handling for Script Execution
The system SHALL handle errors related to Python script execution gracefully.

#### Scenario: Python not installed
- **GIVEN** Python is not installed or not in PATH
- **WHEN** the user initiates a build or flash operation
- **THEN** the system shows error message "Python is required but not found"
- **AND** provides instructions to install Python 3.8+
- **AND** the operation does not start

#### Scenario: Script file not found
- **GIVEN** the platform script file is missing
- **WHEN** the user initiates a build or flash operation
- **THEN** the system shows error message "Platform script not found: {script_path}"
- **AND** the operation does not start
- **AND** logs the error to console

#### Scenario: Script execution timeout (optional)
- **GIVEN** a build operation has been running for > 2 hours
- **WHEN** the timeout threshold is reached
- **THEN** the system terminates the process
- **AND** shows warning message "Build timeout exceeded"
- **AND** marks the activity as "timeout"

#### Scenario: Concurrent operation prevention
- **GIVEN** a build operation is currently running
- **WHEN** the user attempts to start another build or flash
- **THEN** the system prevents the new operation
- **AND** shows message "Another operation is in progress"
- **AND** the buttons remain disabled

### Requirement: Python Script Interface
The system SHALL execute Python scripts with standardized command-line arguments and output format.

#### Scenario: Script receives operation argument
- **GIVEN** a build operation is initiated
- **WHEN** the Python script is executed
- **THEN** the script receives `--operation build` argument
- **AND** the script executes build-specific steps

#### Scenario: Script receives boot option argument
- **GIVEN** the user selects "eMMC Boot" option
- **WHEN** a build or flash is initiated
- **THEN** the script receives `--boot-option emmc` argument
- **AND** the script outputs the selected boot option

#### Scenario: Script outputs structured logs
- **GIVEN** a script is executing
- **WHEN** the script outputs log lines
- **THEN** each log line starts with step description
- **AND** logs use consistent format (e.g., "[Step 1/5] Compiling kernel...")
- **AND** logs are UTF-8 encoded

#### Scenario: Script exits with proper code
- **GIVEN** a script completes execution
- **WHEN** all steps succeed
- **THEN** the script exits with code 0
- **WHEN** any step fails
- **THEN** the script exits with code 1

