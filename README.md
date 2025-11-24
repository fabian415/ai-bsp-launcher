# BSP LaunchPad

A modern desktop application for building and flashing Board Support Packages (BSP) for embedded hardware platforms.

## Features

- **Multi-Platform Support**: Build and flash BSP images for Qualcomm, NVIDIA, Rockchip, and NXP platforms
- **Real-Time Logging**: Stream build and flash logs in real-time with live progress tracking
- **Activity History**: Track all build and flash operations with timestamps and duration
- **Download Management**: Concurrent downloads with pause/resume support and progress monitoring
- **System Monitoring**: Real-time CPU, memory, and disk usage metrics
- **Desktop Notifications**: OS-level notifications for build/flash completion
- **Modern UI**: Dark theme with responsive design and intuitive navigation

## Prerequisites

### Required

- **Go**: 1.21 or higher
- **Node.js**: 18.x or higher
- **Wails CLI**: v2.x
- **Python**: 3.8 or higher (for build/flash operations)

### Platform-Specific

**Windows:**
- Visual Studio 2019 or later with C++ build tools
- WebView2 runtime (usually pre-installed on Windows 10/11)

**macOS:**
- Xcode Command Line Tools

**Linux:**
- gcc
- gtk3
- webkit2gtk

## Installation

### Install Dependencies

```bash
# Install Wails CLI
go install github.com/wailsapp/wails/v2/cmd/wails@latest

# Install Python (if not already installed)
# Windows: Download from python.org
# macOS: brew install python3
# Linux: sudo apt install python3

# Install frontend dependencies
cd frontend
npm install
```

### Verify Python Installation

```bash
python3 --version
# Should output: Python 3.8.x or higher
```

## Development

### Live Development Mode

Run the application in development mode with hot reload:

```bash
wails dev
```

This starts:
- Vite development server for frontend (with hot reload)
- Go backend with auto-reload
- Dev server at http://localhost:34115 for browser debugging

### Project Structure

```
.
├── app.go                      # Go backend (API methods)
├── main.go                     # Application entry point
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── hooks/              # Custom React hooks
│   │   ├── pages/              # Page components
│   │   ├── store/              # Zustand state management
│   │   └── utils/              # Helper functions
│   └── wailsjs/                # Auto-generated Wails bindings
├── scripts/platforms/          # Platform build/flash scripts
│   ├── qualcomm_qsc8250.py
│   ├── nvidia_agx_orin.py
│   ├── rockchip_rk3588.py
│   └── nxp_imx8m.py
└── openspec/                   # OpenSpec documentation
```

## Building

### Development Build

```bash
wails build
```

### Production Build with Optimization

```bash
wails build -clean -ldflags "-w -s"
```

Build outputs are in the `build/bin/` directory.

### Platform-Specific Builds

```bash
# Windows (from any OS with cross-compilation)
wails build -platform windows/amd64

# macOS
wails build -platform darwin/amd64
wails build -platform darwin/arm64

# Linux
wails build -platform linux/amd64
```

## Configuration

### Workspace Path

Configure the workspace directory for downloaded files and build artifacts:

1. Open Settings
2. Click "Select Directory" next to Workspace Path
3. Choose your desired directory
4. Click "Save Settings"

### Settings File Location

Settings are persisted to:
- **Windows**: `%USERPROFILE%\.bsp-launcher-settings.json`
- **macOS/Linux**: `~/.bsp-launcher-settings.json`

Activity history is stored in:
- **Windows**: `%USERPROFILE%\.bsp-launcher-activities.json`
- **macOS/Linux**: `~/.bsp-launcher-activities.json`

## Usage

### Building a Platform

1. Navigate to the **Platforms** page
2. Select a platform card (e.g., Qualcomm QSC-8250)
3. Choose boot option (SD Card or eMMC) in Quick Config
4. Click the **Build** button
5. Monitor real-time logs in the terminal

### Flashing a Platform

1. Navigate to the **Platforms** page
2. Select a platform card
3. Choose boot option in Quick Config
4. Click the **Flash** button
5. Monitor real-time logs in the terminal

### Viewing Activity History

1. Navigate to the **Dashboard** page
2. Scroll to the "Recent Activity" section
3. View past build/flash operations with:
   - Platform name
   - Operation type (Build/Flash)
   - Status (Success/Failed)
   - Duration
   - Boot option

### Downloading Files

1. Navigate to the **Downloads** page
2. Enter file URL and filename
3. Click "Start Download"
4. Monitor progress with real-time speed and ETA
5. Use Pause/Resume/Cancel controls

## Python Script Interface

Build and flash scripts are located in `scripts/platforms/` and follow this interface:

```bash
python3 <script>.py --operation <build|flash> --boot-option <sd|emmc>
```

Example:
```bash
python3 qualcomm_qsc8250.py --operation build --boot-option sd
```

See `scripts/platforms/README.md` for detailed documentation.

## Troubleshooting

### Python Not Found

**Error**: "Python is required but not found"

**Solution**:
1. Install Python 3.8 or higher
2. Ensure `python3` (or `python` on Windows) is in your PATH
3. Verify: `python3 --version`

### Build/Flash Cancellation

To cancel a running operation:
1. Click the **Cancel** button in Platform Workspace
2. Or close the application (process will be terminated)

### Settings Not Persisting

1. Check file permissions for your home directory
2. Verify the settings file exists and is writable
3. Check application logs for errors

### Download Failed

1. Check internet connection
2. Verify the URL is accessible
3. Ensure sufficient disk space
4. Check proxy settings if behind a firewall

## Development with OpenSpec

This project uses OpenSpec for spec-driven development. See `openspec/AGENTS.md` for guidelines on:
- Creating change proposals
- Writing specifications
- Implementing features
- Archiving completed work

## Technology Stack

- **Backend**: Go 1.21+ with Wails v2
- **Frontend**: React 18 with Vite
- **State Management**: Zustand
- **Styling**: SCSS with modular architecture
- **Icons**: Lucide React
- **Build/Flash Scripts**: Python 3.8+
- **System Metrics**: gopsutil

## Contributing

1. Read `openspec/AGENTS.md` for development guidelines
2. Create a change proposal for new features
3. Follow the OpenSpec workflow
4. Submit pull requests with clear descriptions

## License

[Your License Here]

## Support

For issues and questions:
- GitHub Issues: [Your Repo URL]
- Documentation: `openspec/` directory
- Script Documentation: `scripts/platforms/README.md`
