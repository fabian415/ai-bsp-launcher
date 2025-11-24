package main

import (
	"bufio"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net"
	"net/http"
	"net/url"
	"os"
	"os/exec"
	"path/filepath"
	"sync"
	"time"

	"github.com/google/uuid"
	"github.com/shirou/gopsutil/v3/cpu"
	"github.com/shirou/gopsutil/v3/disk"
	"github.com/shirou/gopsutil/v3/mem"
	wailsRuntime "github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx                context.Context
	downloadManager    *DownloadManager
	settings           *AppSettings
	settingsFile       string
	buildProcess       *BuildProcess
	activitiesFile     string
	activities         []ActivityItem
	activitiesMu       sync.RWMutex
}

// BuildProcess represents an active build or flash operation
type BuildProcess struct {
	isRunning     bool
	operation     string // "build" or "flash"
	platformID    string
	platformName  string
	bootOption    string
	startTime     time.Time
	cancelFunc    context.CancelFunc
	mu            sync.RWMutex
}

// ActivityItem represents a completed build or flash operation
type ActivityItem struct {
	ID           string    `json:"id"`
	Timestamp    time.Time `json:"timestamp"`
	PlatformID   string    `json:"platformID"`
	PlatformName string    `json:"platformName"`
	Operation    string    `json:"operation"` // "build" or "flash"
	Status       string    `json:"status"`    // "success" or "failed"
	Duration     int       `json:"duration"`  // seconds
	BootOption   string    `json:"bootOption"`
	Error        string    `json:"error,omitempty"`
}

// AppSettings stores application configuration
type AppSettings struct {
	WorkspacePath         string `json:"workspacePath"`
	ProxyURL              string `json:"proxyURL"`
	NotificationsEnabled  bool   `json:"notificationsEnabled"`
	mu                    sync.RWMutex
}

// DownloadItem represents a single download
type DownloadItem struct {
	ID              string     `json:"id"`
	URL             string     `json:"url"`
	FileName        string     `json:"fileName"`
	SavePath        string     `json:"savePath"`
	Status          string     `json:"status"` // "pending", "downloading", "paused", "completed", "failed", "cancelled", "queued"
	TotalBytes      int64      `json:"totalBytes"`
	DownloadedBytes int64      `json:"downloadedBytes"`
	Progress        float64    `json:"progress"` // 0-100
	Speed           float64    `json:"speed"`    // bytes/sec
	RemainingTime   int        `json:"remainingTime"` // seconds
	Error           string     `json:"error,omitempty"`
	StartedAt       time.Time  `json:"startedAt"`
	CompletedAt     *time.Time `json:"completedAt,omitempty"`
	cancelFunc      context.CancelFunc
	pauseChan       chan bool
	mu              sync.RWMutex
}

// DownloadManager manages all downloads
type DownloadManager struct {
	downloads       map[string]*DownloadItem
	queue           []string
	activeCount     int
	maxConcurrent   int
	mu              sync.RWMutex
	app             *App
}

// NewDownloadManager creates a new download manager
func NewDownloadManager(app *App) *DownloadManager {
	return &DownloadManager{
		downloads:     make(map[string]*DownloadItem),
		queue:         make([]string, 0),
		maxConcurrent: 3,
		app:           app,
	}
}

// NewApp creates a new App application struct
func NewApp() *App {
	settings := &AppSettings{
		WorkspacePath:        "",
		NotificationsEnabled: true,
	}
	
	// Get settings file path (user's home directory)
	homeDir, err := os.UserHomeDir()
	if err != nil {
		fmt.Printf("Error getting home directory: %v\n", err)
		homeDir = "."
	}
	settingsFile := filepath.Join(homeDir, ".bsp-launcher-settings.json")
	activitiesFile := filepath.Join(homeDir, ".bsp-launcher-activities.json")
	
	app := &App{
		settings:       settings,
		settingsFile:   settingsFile,
		activitiesFile: activitiesFile,
		activities:     make([]ActivityItem, 0),
		buildProcess: &BuildProcess{
			isRunning: false,
		},
	}
	
	app.downloadManager = NewDownloadManager(app)
	return app
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
	// Load settings from file
	if err := a.loadSettingsFromFile(); err != nil {
		wailsRuntime.LogWarning(a.ctx, fmt.Sprintf("Could not load settings: %v", err))
	} else {
		wailsRuntime.LogInfo(a.ctx, "Settings loaded successfully on startup")
	}
	
	// Load activities from file
	if err := a.loadActivitiesFromFile(); err != nil {
		wailsRuntime.LogWarning(a.ctx, fmt.Sprintf("Could not load activities: %v", err))
	} else {
		wailsRuntime.LogInfo(a.ctx, "Activities loaded successfully on startup")
	}
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

// getHTTPClient returns a configured HTTP client with proxy support
func (a *App) getHTTPClient() *http.Client {
	// Create transport with longer timeouts for large downloads
	transport := &http.Transport{
		DialContext: (&net.Dialer{
			Timeout:   30 * time.Second,
			KeepAlive: 30 * time.Second,
		}).DialContext,
		TLSHandshakeTimeout:   10 * time.Second,
		ResponseHeaderTimeout: 30 * time.Second,
		ExpectContinueTimeout: 1 * time.Second,
		IdleConnTimeout:       90 * time.Second,
	}
	
	// Configure proxy if set
	a.settings.mu.RLock()
	proxyURL := a.settings.ProxyURL
	a.settings.mu.RUnlock()
	
	if proxyURL != "" {
		if proxyURLParsed, err := url.Parse(proxyURL); err == nil {
			transport.Proxy = http.ProxyURL(proxyURLParsed)
		}
	}
	
	// No overall timeout - let the download run as long as needed
	// The context will handle cancellation if needed
	client := &http.Client{
		Transport: transport,
	}
	
	return client
}

// createHTTPRequest creates an HTTP request with appropriate headers
func (a *App) createHTTPRequest(method, url string) (*http.Request, error) {
	req, err := http.NewRequest(method, url, nil)
	if err != nil {
		return nil, err
	}
	
	// Add common headers to avoid 403 errors from some servers
	req.Header.Set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
	req.Header.Set("Accept", "*/*")
	req.Header.Set("Accept-Language", "en-US,en;q=0.9")
	req.Header.Set("Accept-Encoding", "gzip, deflate, br")
	req.Header.Set("Connection", "keep-alive")
	
	return req, nil
}

// StartDownload initiates a new file download
func (a *App) StartDownload(url string, fileName string) (string, error) {
	wailsRuntime.LogInfo(a.ctx, fmt.Sprintf("StartDownload called - URL: %s, FileName: %s", url, fileName))
	
	// Validate workspace path
	workspacePath := a.GetWorkspacePath()
	wailsRuntime.LogInfo(a.ctx, fmt.Sprintf("Retrieved workspace path: '%s'", workspacePath))
	
	if workspacePath == "" {
		wailsRuntime.LogError(a.ctx, "Workspace path is empty! Please configure it in Settings.")
		return "", fmt.Errorf("workspace path not configured")
	}

	// Validate URL with proper headers
	client := a.getHTTPClient()
	req, err := a.createHTTPRequest("HEAD", url)
	if err != nil {
		return "", fmt.Errorf("failed to create request: %v", err)
	}
	
	resp, err := client.Do(req)
	if err != nil {
		// If HEAD fails, try GET with Range header to get just headers
		wailsRuntime.LogWarning(a.ctx, fmt.Sprintf("HEAD request failed, trying GET: %v", err))
		req, err = a.createHTTPRequest("GET", url)
		if err != nil {
			return "", fmt.Errorf("failed to create request: %v", err)
		}
		req.Header.Set("Range", "bytes=0-0")
		
		resp, err = client.Do(req)
		if err != nil {
			return "", fmt.Errorf("invalid or unreachable URL: %v", err)
		}
	}
	defer resp.Body.Close()

	// Accept both 200 OK and 206 Partial Content as valid responses
	if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusPartialContent {
		return "", fmt.Errorf("server error: %d %s", resp.StatusCode, resp.Status)
	}

	totalBytes := resp.ContentLength
	
	// Check disk space
	savePath := filepath.Join(workspacePath, fileName)
	dirPath := filepath.Dir(savePath)
	usage, err := disk.Usage(dirPath)
	if err == nil && totalBytes > 0 {
		availableBytes := int64(usage.Free)
		if totalBytes > availableBytes {
			return "", fmt.Errorf("insufficient disk space: need %d GB, available %d GB", 
				totalBytes/(1024*1024*1024), availableBytes/(1024*1024*1024))
		}
	}

	// Check for duplicate downloads
	a.downloadManager.mu.RLock()
	for _, dl := range a.downloadManager.downloads {
		if dl.URL == url && (dl.Status == "downloading" || dl.Status == "pending" || dl.Status == "queued") {
			a.downloadManager.mu.RUnlock()
			return "", fmt.Errorf("this file is already downloading")
		}
	}
	a.downloadManager.mu.RUnlock()

	// Create download item
	downloadID := uuid.New().String()
	ctx, cancel := context.WithCancel(context.Background())
	
	download := &DownloadItem{
		ID:              downloadID,
		URL:             url,
		FileName:        fileName,
		SavePath:        savePath,
		Status:          "pending",
		TotalBytes:      totalBytes,
		DownloadedBytes: 0,
		Progress:        0,
		Speed:           0,
		RemainingTime:   0,
		StartedAt:       time.Now(),
		cancelFunc:      cancel,
		pauseChan:       make(chan bool, 1),
	}

	// Add to manager
	a.downloadManager.mu.Lock()
	a.downloadManager.downloads[downloadID] = download
	
	// Check if we can start immediately or need to queue
	if a.downloadManager.activeCount < a.downloadManager.maxConcurrent {
		a.downloadManager.activeCount++
		a.downloadManager.mu.Unlock()
		go a.performDownload(ctx, download)
	} else {
		download.Status = "queued"
		a.downloadManager.queue = append(a.downloadManager.queue, downloadID)
		a.downloadManager.mu.Unlock()
	}

	return downloadID, nil
}

// performDownload executes the actual download with progress tracking
func (a *App) performDownload(ctx context.Context, download *DownloadItem) {
	download.mu.Lock()
	download.Status = "downloading"
	download.mu.Unlock()

	// Create temporary file
	tempPath := download.SavePath + ".part"
	
	// Support resume if file exists
	var resumeOffset int64 = 0
	if fi, err := os.Stat(tempPath); err == nil {
		resumeOffset = fi.Size()
		
		// Validate resume offset
		if download.TotalBytes > 0 && resumeOffset >= download.TotalBytes {
			// Temp file is already complete or corrupted, delete and restart
			wailsRuntime.LogWarning(a.ctx, fmt.Sprintf("Temp file size (%d) >= total size (%d), restarting download", resumeOffset, download.TotalBytes))
			os.Remove(tempPath)
			resumeOffset = 0
		} else {
			download.mu.Lock()
			download.DownloadedBytes = resumeOffset
			download.mu.Unlock()
			wailsRuntime.LogInfo(a.ctx, fmt.Sprintf("Resuming download from offset: %d bytes", resumeOffset))
		}
	}

	// Execute request with retry logic
	client := a.getHTTPClient()
	var resp *http.Response
	maxRetries := 3
	
	for i := 0; i < maxRetries; i++ {
		// Create HTTP request with proper headers and Range for resume
		req, err := a.createHTTPRequest("GET", download.URL)
		if err != nil {
			a.handleDownloadError(download, fmt.Errorf("failed to create request: %v", err))
			return
		}
		
		// Update context
		req = req.WithContext(ctx)

		if resumeOffset > 0 {
			req.Header.Set("Range", fmt.Sprintf("bytes=%d-", resumeOffset))
			wailsRuntime.LogDebug(a.ctx, fmt.Sprintf("Requesting range: bytes=%d-", resumeOffset))
		}

		resp, err = client.Do(req)
		
		// Handle 416 Range Not Satisfiable - restart download
		if resp != nil && resp.StatusCode == http.StatusRequestedRangeNotSatisfiable {
			resp.Body.Close()
			wailsRuntime.LogWarning(a.ctx, "Got 416 error, deleting temp file and restarting from beginning")
			os.Remove(tempPath)
			resumeOffset = 0
			download.mu.Lock()
			download.DownloadedBytes = 0
			download.mu.Unlock()
			
			// Retry without Range header
			if i < maxRetries-1 {
				time.Sleep(time.Duration(1<<uint(i)) * time.Second)
				continue
			}
		}
		
		if err == nil && (resp.StatusCode == http.StatusOK || resp.StatusCode == http.StatusPartialContent) {
			break
		}
		
		if resp != nil {
			resp.Body.Close()
		}
		
		if i < maxRetries-1 {
			time.Sleep(time.Duration(1<<uint(i)) * time.Second) // Exponential backoff: 1s, 2s, 4s
		}
	}

	// if err != nil {
	// 	a.handleDownloadError(download, fmt.Errorf("network error: %v", err))
	// 	return
	// }

	if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusPartialContent {
		resp.Body.Close()
		a.handleDownloadError(download, fmt.Errorf("server error: %d %s", resp.StatusCode, resp.Status))
		return
	}

	defer resp.Body.Close()

	// Open file for writing
	file, err := os.OpenFile(tempPath, os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0644)
	if err != nil {
		a.handleDownloadError(download, fmt.Errorf("disk write error: %v", err))
		return
	}

	// Download with progress tracking
	buffer := make([]byte, 32*1024) // 32KB chunks
	lastUpdate := time.Now()
	lastBytes := download.DownloadedBytes
	downloadComplete := false

	for {
		select {
		case <-ctx.Done():
			file.Close()
			return
		case <-download.pauseChan:
			file.Close()
			download.mu.Lock()
			download.Status = "paused"
			download.mu.Unlock()
			return
		default:
			n, err := resp.Body.Read(buffer)
			if n > 0 {
				_, writeErr := file.Write(buffer[:n])
				if writeErr != nil {
					file.Close()
					a.handleDownloadError(download, fmt.Errorf("disk write error: %v", writeErr))
					return
				}

				download.mu.Lock()
				download.DownloadedBytes += int64(n)
				
				// Update progress every 500ms
				now := time.Now()
				elapsed := now.Sub(lastUpdate).Seconds()
				if elapsed >= 0.5 {
					bytesInPeriod := download.DownloadedBytes - lastBytes
					download.Speed = float64(bytesInPeriod) / elapsed
					
					if download.TotalBytes > 0 {
						download.Progress = (float64(download.DownloadedBytes) / float64(download.TotalBytes)) * 100
						if download.Speed > 0 {
							remaining := download.TotalBytes - download.DownloadedBytes
							download.RemainingTime = int(float64(remaining) / download.Speed)
						}
					}
					
					// Log progress for debugging
					wailsRuntime.LogDebug(a.ctx, fmt.Sprintf("Download progress: %s - %.1f%% (%.1f MB/s)", 
						download.FileName, download.Progress, download.Speed/(1024*1024)))
					
					lastUpdate = now
					lastBytes = download.DownloadedBytes
				}
				download.mu.Unlock()
			}

			if err != nil {
				if err == io.EOF {
					// Download complete - mark flag and break
					downloadComplete = true
					break
				}
				file.Close()
				a.handleDownloadError(download, fmt.Errorf("network error: %v", err))
				return
			}
		}
		
		if downloadComplete {
			break
		}
	}
	
	// Close file before renaming - critical!
	if err := file.Close(); err != nil {
		wailsRuntime.LogWarning(a.ctx, fmt.Sprintf("Error closing file: %v", err))
	}
	
	// Sync to ensure all data is written to disk
	wailsRuntime.LogInfo(a.ctx, "Download complete, finalizing file...")
	
	// Now safe to rename
	a.completeDownload(download, tempPath)
}

// completeDownload handles successful download completion
func (a *App) completeDownload(download *DownloadItem, tempPath string) {
	// Rename from .part to final filename
	if err := os.Rename(tempPath, download.SavePath); err != nil {
		a.handleDownloadError(download, fmt.Errorf("failed to finalize file: %v", err))
		return
	}

	// Verify file size
	if fi, err := os.Stat(download.SavePath); err == nil {
		actualSize := fi.Size()
		expectedSize := download.TotalBytes
		if expectedSize > 0 {
			tolerance := float64(expectedSize) * 0.01 // 1% tolerance
			if float64(actualSize-expectedSize) > tolerance {
				download.mu.Lock()
				download.Status = "failed"
				download.Error = "Incomplete download: file size mismatch"
				download.mu.Unlock()
				a.ShowNotification("Download Failed", fmt.Sprintf("%s: file size mismatch", download.FileName))
				return
			}
		}
	}

	now := time.Now()
	download.mu.Lock()
	download.Status = "completed"
	download.Progress = 100
	download.CompletedAt = &now
	download.mu.Unlock()

	// Trigger notification
	a.ShowNotification("Download Complete", fmt.Sprintf("%s has been downloaded successfully", download.FileName))

	// Start next queued download
	a.startNextQueuedDownload()
}

// handleDownloadError handles download failures
func (a *App) handleDownloadError(download *DownloadItem, err error) {
	download.mu.Lock()
	download.Status = "failed"
	download.Error = err.Error()
	download.mu.Unlock()

	a.ShowNotification("Download Failed", fmt.Sprintf("%s failed: %s", download.FileName, err.Error()))

	// Start next queued download
	a.startNextQueuedDownload()
}

// startNextQueuedDownload starts the next download in queue if available
func (a *App) startNextQueuedDownload() {
	a.downloadManager.mu.Lock()
	defer a.downloadManager.mu.Unlock()

	a.downloadManager.activeCount--

	if len(a.downloadManager.queue) > 0 {
		nextID := a.downloadManager.queue[0]
		a.downloadManager.queue = a.downloadManager.queue[1:]
		
		if download, exists := a.downloadManager.downloads[nextID]; exists {
			a.downloadManager.activeCount++
			ctx, cancel := context.WithCancel(context.Background())
			download.cancelFunc = cancel
			go a.performDownload(ctx, download)
		}
	}
}

// GetDownloadProgress returns current progress for a download
func (a *App) GetDownloadProgress(downloadID string) (*DownloadItem, error) {
	a.downloadManager.mu.RLock()
	download, exists := a.downloadManager.downloads[downloadID]
	a.downloadManager.mu.RUnlock()

	if !exists {
		return nil, fmt.Errorf("download not found")
	}

	download.mu.RLock()
	defer download.mu.RUnlock()

	// Return a copy to avoid race conditions
	result := &DownloadItem{
		ID:              download.ID,
		URL:             download.URL,
		FileName:        download.FileName,
		SavePath:        download.SavePath,
		Status:          download.Status,
		TotalBytes:      download.TotalBytes,
		DownloadedBytes: download.DownloadedBytes,
		Progress:        download.Progress,
		Speed:           download.Speed,
		RemainingTime:   download.RemainingTime,
		Error:           download.Error,
		StartedAt:       download.StartedAt,
		CompletedAt:     download.CompletedAt,
	}

	return result, nil
}

// GetAllDownloads returns list of all downloads
func (a *App) GetAllDownloads() []DownloadItem {
	a.downloadManager.mu.RLock()
	defer a.downloadManager.mu.RUnlock()

	downloads := make([]DownloadItem, 0, len(a.downloadManager.downloads))
	for _, download := range a.downloadManager.downloads {
		download.mu.RLock()
		downloads = append(downloads, DownloadItem{
			ID:              download.ID,
			URL:             download.URL,
			FileName:        download.FileName,
			SavePath:        download.SavePath,
			Status:          download.Status,
			TotalBytes:      download.TotalBytes,
			DownloadedBytes: download.DownloadedBytes,
			Progress:        download.Progress,
			Speed:           download.Speed,
			RemainingTime:   download.RemainingTime,
			Error:           download.Error,
			StartedAt:       download.StartedAt,
			CompletedAt:     download.CompletedAt,
		})
		download.mu.RUnlock()
	}

	return downloads
}

// PauseDownload pauses an active download
func (a *App) PauseDownload(downloadID string) error {
	a.downloadManager.mu.RLock()
	download, exists := a.downloadManager.downloads[downloadID]
	a.downloadManager.mu.RUnlock()

	if !exists {
		return fmt.Errorf("download not found")
	}

	download.mu.RLock()
	status := download.Status
	download.mu.RUnlock()

	if status != "downloading" {
		return fmt.Errorf("download is not active")
	}

	select {
	case download.pauseChan <- true:
	default:
	}

	return nil
}

// ResumeDownload resumes a paused download
func (a *App) ResumeDownload(downloadID string) error {
	a.downloadManager.mu.RLock()
	download, exists := a.downloadManager.downloads[downloadID]
	a.downloadManager.mu.RUnlock()

	if !exists {
		return fmt.Errorf("download not found")
	}

	download.mu.RLock()
	status := download.Status
	download.mu.RUnlock()

	if status != "paused" {
		return fmt.Errorf("download is not paused")
	}

	// Check concurrent limit
	a.downloadManager.mu.Lock()
	if a.downloadManager.activeCount >= a.downloadManager.maxConcurrent {
		download.Status = "queued"
		a.downloadManager.queue = append(a.downloadManager.queue, downloadID)
		a.downloadManager.mu.Unlock()
		return nil
	}

	a.downloadManager.activeCount++
	a.downloadManager.mu.Unlock()

	// Create new context and restart download
	ctx, cancel := context.WithCancel(context.Background())
	download.cancelFunc = cancel
	download.pauseChan = make(chan bool, 1)

	go a.performDownload(ctx, download)

	return nil
}

// CancelDownload cancels and removes a download
func (a *App) CancelDownload(downloadID string) error {
	a.downloadManager.mu.RLock()
	download, exists := a.downloadManager.downloads[downloadID]
	a.downloadManager.mu.RUnlock()

	if !exists {
		return fmt.Errorf("download not found")
	}

	// Cancel context
	if download.cancelFunc != nil {
		download.cancelFunc()
	}

	download.mu.Lock()
	download.Status = "cancelled"
	download.mu.Unlock()

	// Delete partial file
	tempPath := download.SavePath + ".part"
	os.Remove(tempPath)

	// Remove from manager
	a.downloadManager.mu.Lock()
	delete(a.downloadManager.downloads, downloadID)
	
	// Remove from queue if present
	for i, id := range a.downloadManager.queue {
		if id == downloadID {
			a.downloadManager.queue = append(a.downloadManager.queue[:i], a.downloadManager.queue[i+1:]...)
			break
		}
	}
	a.downloadManager.mu.Unlock()

	// Start next queued download
	a.startNextQueuedDownload()

	return nil
}

// GetWorkspacePath returns the configured workspace path
func (a *App) GetWorkspacePath() string {
	a.settings.mu.RLock()
	defer a.settings.mu.RUnlock()
	if a.ctx != nil {
		wailsRuntime.LogDebug(a.ctx, fmt.Sprintf("GetWorkspacePath returning: '%s'", a.settings.WorkspacePath))
	}
	return a.settings.WorkspacePath
}

// SetWorkspacePath updates the workspace path
func (a *App) SetWorkspacePath(path string) error {
	// Validate path exists
	if _, err := os.Stat(path); os.IsNotExist(err) {
		return fmt.Errorf("directory does not exist")
	}

	a.settings.mu.Lock()
	a.settings.WorkspacePath = path
	a.settings.mu.Unlock()

	return nil
}

// SaveSettings saves all application settings
func (a *App) SaveSettings(workspacePath, proxyURL string, notificationsEnabled bool) error {
	wailsRuntime.LogInfo(a.ctx, fmt.Sprintf("SaveSettings called - workspacePath='%s', proxyURL='%s', notificationsEnabled=%v", 
		workspacePath, proxyURL, notificationsEnabled))
	
	// Validate and set workspace path if provided
	if workspacePath != "" {
		if _, err := os.Stat(workspacePath); os.IsNotExist(err) {
			errMsg := fmt.Sprintf("directory does not exist: %s", workspacePath)
			wailsRuntime.LogError(a.ctx, errMsg)
			return fmt.Errorf(errMsg)
		}
		
		a.settings.mu.Lock()
		a.settings.WorkspacePath = workspacePath
		a.settings.mu.Unlock()
		
		wailsRuntime.LogInfo(a.ctx, fmt.Sprintf("Workspace path set to: '%s'", workspacePath))
	}

	// Update other settings
	a.settings.mu.Lock()
	a.settings.ProxyURL = proxyURL
	a.settings.NotificationsEnabled = notificationsEnabled
	a.settings.mu.Unlock()

	// Persist to file
	wailsRuntime.LogInfo(a.ctx, "Saving settings to file...")
	err := a.saveSettingsToFile()
	if err != nil {
		wailsRuntime.LogError(a.ctx, fmt.Sprintf("Failed to save settings to file: %v", err))
		return err
	}
	
	wailsRuntime.LogInfo(a.ctx, "Settings saved successfully!")
	return nil
}

// loadSettingsFromFile loads settings from JSON file
func (a *App) loadSettingsFromFile() error {
	data, err := os.ReadFile(a.settingsFile)
	if err != nil {
		if os.IsNotExist(err) {
			// File doesn't exist yet, use defaults
			if a.ctx != nil {
				wailsRuntime.LogInfo(a.ctx, "Settings file does not exist yet, using defaults")
			}
			return nil
		}
		return fmt.Errorf("failed to read settings file: %v", err)
	}

	a.settings.mu.Lock()
	defer a.settings.mu.Unlock()

	if err := json.Unmarshal(data, a.settings); err != nil {
		return fmt.Errorf("failed to parse settings: %v", err)
	}

	if a.ctx != nil {
		wailsRuntime.LogInfo(a.ctx, fmt.Sprintf("Settings loaded from: %s", a.settingsFile))
		wailsRuntime.LogInfo(a.ctx, fmt.Sprintf("Workspace path: '%s'", a.settings.WorkspacePath))
		wailsRuntime.LogInfo(a.ctx, fmt.Sprintf("Proxy URL: '%s'", a.settings.ProxyURL))
		wailsRuntime.LogInfo(a.ctx, fmt.Sprintf("Notifications enabled: %v", a.settings.NotificationsEnabled))
	}
	return nil
}

// saveSettingsToFile persists settings to JSON file
func (a *App) saveSettingsToFile() error {
	a.settings.mu.RLock()
	data, err := json.MarshalIndent(a.settings, "", "  ")
	a.settings.mu.RUnlock()

	if err != nil {
		return fmt.Errorf("failed to serialize settings: %v", err)
	}

	if err := os.WriteFile(a.settingsFile, data, 0644); err != nil {
		return fmt.Errorf("failed to write settings file: %v", err)
	}

	if a.ctx != nil {
		wailsRuntime.LogInfo(a.ctx, fmt.Sprintf("Settings saved to: %s", a.settingsFile))
	}
	return nil
}

// GetSettings returns current settings
func (a *App) GetSettings() map[string]interface{} {
	a.settings.mu.RLock()
	defer a.settings.mu.RUnlock()

	settings := map[string]interface{}{
		"workspacePath":        a.settings.WorkspacePath,
		"proxyURL":             a.settings.ProxyURL,
		"notificationsEnabled": a.settings.NotificationsEnabled,
	}
	
	if a.ctx != nil {
		wailsRuntime.LogDebug(a.ctx, fmt.Sprintf("GetSettings returning: workspacePath='%s', proxyURL='%s', notificationsEnabled=%v", 
			a.settings.WorkspacePath, a.settings.ProxyURL, a.settings.NotificationsEnabled))
	}
	
	return settings
}

// ShowNotification triggers an OS-level desktop notification
func (a *App) ShowNotification(title string, message string) error {
	// Check if notifications are enabled
	a.settings.mu.RLock()
	enabled := a.settings.NotificationsEnabled
	a.settings.mu.RUnlock()

	if !enabled {
		return nil
	}

	// Use Wails runtime to show notification
	if a.ctx != nil {
		wailsRuntime.EventsEmit(a.ctx, "notification", map[string]string{
			"title":   title,
			"message": message,
		})
	}

	return nil
}

// SelectDirectory opens a directory selection dialog and returns the selected path
func (a *App) SelectDirectory() string {
	if a.ctx == nil {
		wailsRuntime.LogError(a.ctx, "Application context not initialized")
		return ""
	}

	// Open directory selection dialog using Wails runtime
	selectedPath, err := wailsRuntime.OpenDirectoryDialog(a.ctx, wailsRuntime.OpenDialogOptions{
		Title: "Select Workspace Directory",
	})

	if err != nil {
		wailsRuntime.LogError(a.ctx, fmt.Sprintf("Error opening directory dialog: %v", err))
		return ""
	}

	if selectedPath != "" {
		wailsRuntime.LogInfo(a.ctx, fmt.Sprintf("Directory selected: %s", selectedPath))
	} else {
		wailsRuntime.LogInfo(a.ctx, "Directory selection cancelled")
	}

	return selectedPath
}

// getPlatformName returns the full platform name for a given platform ID
func (a *App) getPlatformName(platformID string) string {
	platformNames := map[string]string{
		"qcom":     "Qualcomm Snapdragon QSC-8250",
		"nvidia":   "NVIDIA Jetson Orin AGX-Orin-32G",
		"rockchip": "Rockchip RK3588",
		"nxp":      "NXP i.MX 8M Plus IMX8M-PLUS",
	}
	
	if name, exists := platformNames[platformID]; exists {
		return name
	}
	return platformID
}

// getScriptPath returns the path to the Python script for a platform
func (a *App) getScriptPath(platformID string) (string, error) {
	scriptMap := map[string]string{
		"qcom":     "qualcomm_qsc8250.py",
		"nvidia":   "nvidia_agx_orin.py",
		"rockchip": "rockchip_rk3588.py",
		"nxp":      "nxp_imx8m.py",
	}
	
	scriptName, exists := scriptMap[platformID]
	if !exists {
		return "", fmt.Errorf("unknown platform ID: %s", platformID)
	}
	
	// Try multiple possible locations
	possiblePaths := []string{
		// Relative path (for development with wails dev)
		filepath.Join("scripts", "platforms", scriptName),
		// Relative to current working directory
		filepath.Join(".", "scripts", "platforms", scriptName),
	}
	
	// Try executable directory (for production build)
	if exePath, err := os.Executable(); err == nil {
		exeDir := filepath.Dir(exePath)
		possiblePaths = append(possiblePaths, filepath.Join(exeDir, "scripts", "platforms", scriptName))
	}
	
	// Check each possible path
	for _, scriptPath := range possiblePaths {
		absPath, err := filepath.Abs(scriptPath)
		if err != nil {
			continue
		}
		
		if fileInfo, err := os.Stat(absPath); err == nil && !fileInfo.IsDir() {
			wailsRuntime.LogInfo(a.ctx, fmt.Sprintf("Found script at: %s", absPath))
			return absPath, nil
		}
	}
	
	// If not found, return error with all attempted paths
	return "", fmt.Errorf("script not found: %s (tried: %v)", scriptName, possiblePaths)
}

// BuildPlatform executes a build operation for the specified platform
func (a *App) BuildPlatform(platformID string, bootOption string) error {
	return a.executePlatformOperation(platformID, bootOption, "build")
}

// FlashPlatform executes a flash operation for the specified platform
func (a *App) FlashPlatform(platformID string, bootOption string) error {
	return a.executePlatformOperation(platformID, bootOption, "flash")
}

// executePlatformOperation performs the actual build or flash operation
func (a *App) executePlatformOperation(platformID string, bootOption string, operation string) error {
	// Check if another operation is running
	a.buildProcess.mu.Lock()
	if a.buildProcess.isRunning {
		a.buildProcess.mu.Unlock()
		return fmt.Errorf("another operation is in progress")
	}
	a.buildProcess.isRunning = true
	a.buildProcess.operation = operation
	a.buildProcess.platformID = platformID
	a.buildProcess.platformName = a.getPlatformName(platformID)
	a.buildProcess.bootOption = bootOption
	a.buildProcess.startTime = time.Now()
	a.buildProcess.mu.Unlock()
	
	// Check if Python is available (try both python and python3)
	pythonCmd := ""
	if path, err := exec.LookPath("python"); err == nil {
		pythonCmd = path
		wailsRuntime.LogInfo(a.ctx, fmt.Sprintf("Found python at: %s", path))
	} else if path, err := exec.LookPath("python3"); err == nil {
		pythonCmd = path
		wailsRuntime.LogInfo(a.ctx, fmt.Sprintf("Found python3 at: %s", path))
	} else {
		a.buildProcess.mu.Lock()
		a.buildProcess.isRunning = false
		a.buildProcess.mu.Unlock()
		return fmt.Errorf("Python is required but not found. Please install Python 3.8+ and ensure it's in your PATH")
	}
	
	// Get script path
	scriptPath, err := a.getScriptPath(platformID)
	if err != nil {
		a.buildProcess.mu.Lock()
		a.buildProcess.isRunning = false
		a.buildProcess.mu.Unlock()
		return err
	}
	
	wailsRuntime.LogInfo(a.ctx, fmt.Sprintf("Starting %s for %s with boot option: %s", operation, platformID, bootOption))
	wailsRuntime.LogInfo(a.ctx, fmt.Sprintf("Python command: %s", pythonCmd))
	wailsRuntime.LogInfo(a.ctx, fmt.Sprintf("Script path: %s", scriptPath))
	
	// Execute in goroutine
	go a.runPlatformScript(pythonCmd, scriptPath, operation, bootOption)
	
	return nil
}

// runPlatformScript runs the Python script and streams output
func (a *App) runPlatformScript(pythonCmd string, scriptPath string, operation string, bootOption string) {
	// Create cancellable context
	ctx, cancel := context.WithCancel(context.Background())
	
	a.buildProcess.mu.Lock()
	a.buildProcess.cancelFunc = cancel
	startTime := a.buildProcess.startTime
	platformName := a.buildProcess.platformName
	platformID := a.buildProcess.platformID
	a.buildProcess.mu.Unlock()
	
	// Create command
	cmd := exec.CommandContext(ctx, pythonCmd, scriptPath, "--operation", operation, "--boot-option", bootOption)
	
	// Log the full command for debugging
	wailsRuntime.LogInfo(a.ctx, fmt.Sprintf("Executing: %s %s --operation %s --boot-option %s", pythonCmd, scriptPath, operation, bootOption))
	
	// Get stdout and stderr pipes
	stdout, err := cmd.StdoutPipe()
	if err != nil {
		a.handleBuildError(fmt.Errorf("failed to get stdout: %v", err))
		return
	}
	
	stderr, err := cmd.StderrPipe()
	if err != nil {
		a.handleBuildError(fmt.Errorf("failed to get stderr: %v", err))
		return
	}
	
	// Start the command
	if err := cmd.Start(); err != nil {
		a.handleBuildError(fmt.Errorf("failed to start script: %v", err))
		return
	}
	
	// Stream stdout in goroutine
	var wg sync.WaitGroup
	wg.Add(2)
	
	go func() {
		defer wg.Done()
		scanner := bufio.NewScanner(stdout)
		for scanner.Scan() {
			line := scanner.Text()
			wailsRuntime.EventsEmit(a.ctx, "build:log", map[string]string{
				"type":    "stdout",
				"message": line,
			})
		}
	}()
	
	go func() {
		defer wg.Done()
		scanner := bufio.NewScanner(stderr)
		for scanner.Scan() {
			line := scanner.Text()
			wailsRuntime.EventsEmit(a.ctx, "build:log", map[string]string{
				"type":    "stderr",
				"message": line,
			})
		}
	}()
	
	// Wait for command to complete
	wg.Wait()
	err = cmd.Wait()
	
	// Calculate duration
	duration := int(time.Since(startTime).Seconds())
	
	// Handle completion
	a.buildProcess.mu.Lock()
	a.buildProcess.isRunning = false
	a.buildProcess.cancelFunc = nil
	a.buildProcess.mu.Unlock()
	
	if err != nil {
		if ctx.Err() == context.Canceled {
			// User cancelled
			wailsRuntime.EventsEmit(a.ctx, "build:cancelled", map[string]interface{}{
				"operation": operation,
				"platform":  platformName,
			})
			wailsRuntime.LogInfo(a.ctx, fmt.Sprintf("%s cancelled by user", operation))
		} else {
			// Script error
			errorMsg := fmt.Sprintf("Script failed: %v", err)
			a.handleBuildError(fmt.Errorf(errorMsg))
			
			// Create failed activity
			a.createActivity(platformID, platformName, operation, bootOption, "failed", duration, errorMsg)
			
			// Show notification
			title := fmt.Sprintf("%s Failed", capitalizeFirst(operation))
			message := fmt.Sprintf("%s %s failed", platformName, operation)
			a.ShowNotification(title, message)
		}
	} else {
		// Success
		wailsRuntime.EventsEmit(a.ctx, "build:complete", map[string]interface{}{
			"operation": operation,
			"platform":  platformName,
			"duration":  duration,
		})
		
		// Create success activity
		a.createActivity(platformID, platformName, operation, bootOption, "success", duration, "")
		
		// Show notification
		title := fmt.Sprintf("%s Complete", capitalizeFirst(operation))
		message := fmt.Sprintf("%s %s completed successfully", platformName, operation)
		a.ShowNotification(title, message)
		
		wailsRuntime.LogInfo(a.ctx, fmt.Sprintf("%s completed successfully in %d seconds", operation, duration))
	}
}

// handleBuildError handles errors during build/flash operations
func (a *App) handleBuildError(err error) {
	a.buildProcess.mu.Lock()
	a.buildProcess.isRunning = false
	a.buildProcess.cancelFunc = nil
	a.buildProcess.mu.Unlock()
	
	wailsRuntime.EventsEmit(a.ctx, "build:error", map[string]string{
		"error": err.Error(),
	})
	wailsRuntime.LogError(a.ctx, err.Error())
}

// CancelBuildFlash cancels the currently running build or flash operation
func (a *App) CancelBuildFlash() error {
	a.buildProcess.mu.Lock()
	defer a.buildProcess.mu.Unlock()
	
	if !a.buildProcess.isRunning {
		return fmt.Errorf("no operation is running")
	}
	
	if a.buildProcess.cancelFunc != nil {
		a.buildProcess.cancelFunc()
	}
	
	return nil
}

// createActivity creates a new activity entry and saves it
func (a *App) createActivity(platformID, platformName, operation, bootOption, status string, duration int, errorMsg string) {
	activity := ActivityItem{
		ID:           uuid.New().String(),
		Timestamp:    time.Now(),
		PlatformID:   platformID,
		PlatformName: platformName,
		Operation:    operation,
		Status:       status,
		Duration:     duration,
		BootOption:   bootOption,
		Error:        errorMsg,
	}
	
	a.activitiesMu.Lock()
	a.activities = append([]ActivityItem{activity}, a.activities...)
	
	// Prune to keep only last 100 activities
	if len(a.activities) > 100 {
		a.activities = a.activities[:100]
	}
	a.activitiesMu.Unlock()
	
	// Save to file
	if err := a.saveActivitiesToFile(); err != nil {
		wailsRuntime.LogWarning(a.ctx, fmt.Sprintf("Failed to save activities: %v", err))
	}
}

// GetRecentActivities returns the most recent activities
func (a *App) GetRecentActivities(limit int) []ActivityItem {
	if limit <= 0 {
		limit = 10
	}
	
	a.activitiesMu.RLock()
	defer a.activitiesMu.RUnlock()
	
	if len(a.activities) <= limit {
		return a.activities
	}
	
	return a.activities[:limit]
}

// loadActivitiesFromFile loads activities from JSON file
func (a *App) loadActivitiesFromFile() error {
	data, err := os.ReadFile(a.activitiesFile)
	if err != nil {
		if os.IsNotExist(err) {
			// File doesn't exist yet, use empty list
			return nil
		}
		return fmt.Errorf("failed to read activities file: %v", err)
	}
	
	var fileData struct {
		Activities []ActivityItem `json:"activities"`
	}
	
	if err := json.Unmarshal(data, &fileData); err != nil {
		// Corrupted file, backup and start fresh
		backupPath := a.activitiesFile + ".bak"
		os.Rename(a.activitiesFile, backupPath)
		wailsRuntime.LogWarning(a.ctx, fmt.Sprintf("Corrupted activities file backed up to: %s", backupPath))
		return nil
	}
	
	a.activitiesMu.Lock()
	a.activities = fileData.Activities
	a.activitiesMu.Unlock()
	
	return nil
}

// saveActivitiesToFile persists activities to JSON file
func (a *App) saveActivitiesToFile() error {
	a.activitiesMu.RLock()
	fileData := struct {
		Activities []ActivityItem `json:"activities"`
	}{
		Activities: a.activities,
	}
	a.activitiesMu.RUnlock()
	
	data, err := json.MarshalIndent(fileData, "", "  ")
	if err != nil {
		return fmt.Errorf("failed to serialize activities: %v", err)
	}
	
	// Atomic write: write to temp file, then rename
	tempFile := a.activitiesFile + ".tmp"
	if err := os.WriteFile(tempFile, data, 0644); err != nil {
		return fmt.Errorf("failed to write activities file: %v", err)
	}
	
	if err := os.Rename(tempFile, a.activitiesFile); err != nil {
		return fmt.Errorf("failed to rename activities file: %v", err)
	}
	
	return nil
}

// capitalizeFirst capitalizes the first letter of a string
func capitalizeFirst(s string) string {
	if len(s) == 0 {
		return s
	}
	return string(s[0]-32) + s[1:]
}
