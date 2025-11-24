# Platform Build & Flash Scripts

This directory contains Python simulation scripts for building and flashing BSP (Board Support Package) images for various embedded hardware platforms.

## Overview

Each script simulates the build and flash process for a specific hardware platform. These are MVP simulations that demonstrate the workflow without requiring actual hardware or BSP source code.

## Supported Platforms

| Platform | Script | Vendor | Build System |
|----------|--------|--------|--------------|
| Qualcomm Snapdragon QSC-8250 | `qualcomm_qsc8250.py` | Qualcomm | Android Build System |
| NVIDIA Jetson Orin AGX-Orin-32G | `nvidia_agx_orin.py` | NVIDIA | NVIDIA SDK Manager |
| Rockchip RK3588 | `rockchip_rk3588.py` | Rockchip | Rockchip SDK Build |
| NXP i.MX 8M Plus IMX8M-PLUS | `nxp_imx8m.py` | NXP | Yocto Project |

## Script Interface

All scripts follow a standardized command-line interface:

### Command-Line Arguments

```bash
python3 <script_name>.py --operation <build|flash> --boot-option <sd|emmc>
```

**Required Arguments:**
- `--operation`: Type of operation to perform
  - `build`: Simulate BSP compilation
  - `flash`: Simulate flashing to hardware
- `--boot-option`: Boot storage type
  - `sd`: SD Card boot
  - `emmc`: eMMC (internal storage) boot

### Exit Codes

- `0`: Success - Operation completed without errors
- `1`: Failure - Operation failed with errors

### Output Format

Scripts output structured logs to stdout with the following format:

```
============================================================
Platform: <Platform Name>
BSP Version: <Version>
Boot Option: <SD Card|eMMC>
Build System: <Build System Name>
============================================================

[Step 1/N] <Step description>
[Step 2/N] <Step description>
...
[Step N/N] <Step description>

============================================================
✓ Build Successful / Flash Complete
<Additional completion message>
============================================================
```

Errors are output to stderr:
```
❌ Error: <error message>
```

## Examples

### Build Qualcomm QSC-8250 with SD Card Boot
```bash
python3 qualcomm_qsc8250.py --operation build --boot-option sd
```

### Flash NVIDIA Jetson Orin with eMMC Boot
```bash
python3 nvidia_agx_orin.py --operation flash --boot-option emmc
```

### Build Rockchip RK3588 with SD Card Boot
```bash
python3 rockchip_rk3588.py --operation build --boot-option sd
```

### Flash NXP IMX8M-PLUS with eMMC Boot
```bash
python3 nxp_imx8m.py --operation flash --boot-option emmc
```

## Script Structure

Each script follows this internal structure:

```python
#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import sys
import time
import argparse

def print_step(step, total, message):
    """Print formatted step message with delay"""
    print(f"[Step {step}/{total}] {message}", flush=True)
    time.sleep(0.8)  # Simulate work being done

def build_platform(boot_option):
    """Simulate build process"""
    # Print platform info
    # Simulate 8-10 build steps
    # Print success message

def flash_platform(boot_option):
    """Simulate flash process"""
    # Print platform info
    # Simulate 10-12 flash steps
    # Print success message

def main():
    # Parse arguments
    # Call build_platform() or flash_platform()
    # Return exit code

if __name__ == "__main__":
    sys.exit(main())
```

## Requirements

- **Python**: 3.8 or higher
- **Standard Library Only**: No external dependencies required

## Integration with Go Backend

The Go backend (`app.go`) executes these scripts via `exec.Command` and:

1. **Streams Output**: Captures stdout/stderr in real-time
2. **Event Emission**: Forwards logs to frontend via Wails runtime events
3. **Process Management**: Supports cancellation via context.Context
4. **Error Handling**: Captures exit codes and error messages
5. **Activity Tracking**: Creates activity records on completion

## Development Guidelines

When adding or modifying scripts:

1. **UTF-8 Encoding**: Always use `# -*- coding: utf-8 -*-` header
2. **Flush Output**: Use `flush=True` in print statements for real-time streaming
3. **Consistent Format**: Follow the standardized output format
4. **Error Handling**: Exit with code 1 on errors, write errors to stderr
5. **Simulation Delay**: Use 0.8s delay between steps for realistic UX
6. **Platform-Specific Steps**: Simulate 8-12 steps per operation
7. **Informative Messages**: Include version numbers, toolchain names, file paths

## Future Enhancements

For production use, these simulation scripts can be replaced with:

1. **Real Build Scripts**: Invoke actual BSP build commands (e.g., `bitbake`, `make`)
2. **Hardware Detection**: Verify device presence before flashing
3. **Progress Parsing**: Parse real build output for progress percentage
4. **Error Recovery**: Implement retry logic and error recovery
5. **Artifact Management**: Handle build output files and checksums

## Troubleshooting

### Python Not Found
Ensure Python 3.8+ is installed and in PATH:
```bash
python3 --version
```

### Permission Denied
Make scripts executable:
```bash
chmod +x scripts/platforms/*.py
```

### Script Not Found
Verify script path relative to the application executable or working directory.

## License

These scripts are part of the BSP LaunchPad project.

