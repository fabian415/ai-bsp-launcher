package main

import (
	"context"
	"fmt"

	"github.com/shirou/gopsutil/v3/cpu"
	"github.com/shirou/gopsutil/v3/disk"
	"github.com/shirou/gopsutil/v3/mem"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}

// SystemMetrics contains all system resource metrics
type SystemMetrics struct {
	CPU    CPUMetrics    `json:"cpu"`
	Memory MemoryMetrics `json:"memory"`
	Disk   DiskMetrics   `json:"disk"`
}

// CPUMetrics contains CPU usage information
type CPUMetrics struct {
	UsagePercent float64 `json:"usagePercent"` // 0-100
}

// MemoryMetrics contains memory usage information
type MemoryMetrics struct {
	UsedGB      float64 `json:"usedGB"`
	TotalGB     float64 `json:"totalGB"`
	UsedPercent float64 `json:"usedPercent"` // 0-100
}

// DiskMetrics contains disk usage information
type DiskMetrics struct {
	UsedGB      float64 `json:"usedGB"`
	TotalGB     float64 `json:"totalGB"`
	UsedPercent float64 `json:"usedPercent"` // 0-100
	Path        string  `json:"path"`        // "/" or "C:\"
}

// GetSystemMetrics returns all system metrics (CPU, memory, disk)
func (a *App) GetSystemMetrics() SystemMetrics {
	return SystemMetrics{
		CPU:    a.GetCPUUsage(),
		Memory: a.GetMemoryUsage(),
		Disk:   a.GetDiskUsage(),
	}
}

// GetCPUUsage returns CPU usage percentage
func (a *App) GetCPUUsage() CPUMetrics {
	// Get CPU usage with 1 second interval for accurate measurement
	percentages, err := cpu.Percent(0, false)
	if err != nil || len(percentages) == 0 {
		fmt.Printf("Error getting CPU usage: %v\n", err)
		return CPUMetrics{UsagePercent: 0}
	}

	return CPUMetrics{
		UsagePercent: percentages[0],
	}
}

// GetMemoryUsage returns memory usage in GB
func (a *App) GetMemoryUsage() MemoryMetrics {
	v, err := mem.VirtualMemory()
	if err != nil {
		fmt.Printf("Error getting memory usage: %v\n", err)
		return MemoryMetrics{UsedGB: 0, TotalGB: 0, UsedPercent: 0}
	}

	return MemoryMetrics{
		UsedGB:      float64(v.Used) / 1024 / 1024 / 1024,  // Convert bytes to GB
		TotalGB:     float64(v.Total) / 1024 / 1024 / 1024, // Convert bytes to GB
		UsedPercent: v.UsedPercent,
	}
}

// GetDiskUsage returns disk usage for the primary system disk
func (a *App) GetDiskUsage() DiskMetrics {
	// Use root path for cross-platform compatibility
	// Windows: gopsutil will automatically use C:\
	// Linux/macOS: uses /
	path := "/"
	usage, err := disk.Usage(path)
	if err != nil {
		fmt.Printf("Error getting disk usage: %v\n", err)
		return DiskMetrics{UsedGB: 0, TotalGB: 0, UsedPercent: 0, Path: path}
	}

	return DiskMetrics{
		UsedGB:      float64(usage.Used) / 1024 / 1024 / 1024,  // Convert bytes to GB
		TotalGB:     float64(usage.Total) / 1024 / 1024 / 1024, // Convert bytes to GB
		UsedPercent: usage.UsedPercent,
		Path:        usage.Path,
	}
}
