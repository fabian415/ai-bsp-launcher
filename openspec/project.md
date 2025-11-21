# Project Context

## Purpose

BSP LaunchPad 是一個桌面應用程式，專為嵌入式系統開發者設計，用於簡化 Board Support Package (BSP) 的管理、建置與燒錄流程。

### 主要目標
- 提供統一的介面管理多種硬體平台（Qualcomm、NVIDIA、Rockchip、NXP 等）
- 簡化 BSP 下載、建置與燒錄的複雜操作流程
- 支援多語言（繁中、簡中、英文、日文、韓文）與深色/淺色主題
- 提供即時的建置日誌與進度追蹤

### 目標用戶
- 嵌入式系統開發工程師
- BSP 維護團隊
- 硬體驗證與測試人員

## Tech Stack

### 前端技術
- **Framework**: React 18.2.0
- **狀態管理**: Zustand 4.4.7（輕量級、無 boilerplate）
- **路由**: React Router DOM 6.20.0（HashRouter 模式）
- **樣式**: SCSS + BEM 命名規範
- **圖示**: Lucide React 0.294.0
- **建置工具**: Vite 5.0.8
- **模組類型**: ES Modules

### 後端技術
- **語言**: Go 1.23
- **框架**: Wails v2.9.2（Go + Web 技術的桌面應用框架）
- **模組名稱**: myproject

### 開發工具
- **版本控制**: Git
- **套件管理**: npm (frontend), Go modules (backend)
- **開發伺服器**: Wails Dev Server（支援 Hot Reload）

### 專案架構
- **應用類型**: 跨平台桌面應用程式（Windows, macOS, Linux）
- **通訊模式**: Go 後端透過 Wails 綁定直接呼叫
- **前端打包**: 使用 Vite 打包後嵌入 Go 執行檔

## Project Conventions

### Code Style

#### 前端 (React/JavaScript)
- **檔案命名**: PascalCase for components (`Header.jsx`, `PlatformCard.jsx`)
- **函數命名**: camelCase (`useBuildProcess`, `validateImageExisted`)
- **常數命名**: UPPER_SNAKE_CASE (`MOCK_PLATFORMS`, `BUILD_STATUS`)
- **CSS 類別**: BEM 命名法（`.platform-card__header`, `.terminal-log--success`）
- **元件結構**: Function Components + React Hooks（禁止 Class Components）
- **狀態管理**: Zustand store，避免 prop drilling
- **Import 順序**: 
  1. React/外部庫
  2. Wails 生成文件
  3. 內部元件/hooks
  4. 樣式檔案

#### 後端 (Go)
- **檔案命名**: lowercase with underscores (Go 慣例)
- **函數命名**: PascalCase for exported, camelCase for internal
- **錯誤處理**: 明確返回 error，不使用 panic
- **Context**: 使用 context.Context 進行生命週期管理

### Architecture Patterns

#### 前端架構
```
frontend/src/
├── components/    # 可重用 UI 元件（單一職責）
├── layouts/       # 頁面布局元件
├── pages/         # 路由頁面（對應 URL）
├── hooks/         # 自定義 React Hooks
│   └── useWails.js    # Wails API 封裝層（重要！）
├── store/         # Zustand 全域狀態
├── utils/         # 工具函數與常數
└── assets/        # 靜態資源（字型、圖片、樣式）
```

#### 關鍵設計原則
1. **元件單一職責**: 每個元件只負責一個功能區塊
2. **Props 不跨多層**: 使用 Zustand 避免 prop drilling
3. **API 封裝**: 所有 Wails API 呼叫必須透過 `useWails` Hook
4. **錯誤邊界**: 在頁面層級實作錯誤處理
5. **懶加載**: 路由層級的程式碼分割（生產環境）

#### 樣式架構
```
assets/styles/
├── variables.scss   # 顏色、間距、字型變數
├── base.scss        # 基礎樣式、動畫、主題
├── layout.scss      # 布局、卡片、按鈕、輸入框
└── components.scss  # 下拉選單、狀態指示器、Modal
```

- 使用 SCSS 變數統一管理設計系統
- 支援 `.light` 和 `.dark` 主題切換
- 遵循 BEM 命名避免樣式衝突

### Testing Strategy

#### 目前狀態
- 🚧 測試框架尚未完整建立（MVP 階段）
- ✅ 手動功能測試通過（UI 操作、路由、狀態管理）

#### 未來測試計劃
1. **單元測試** (Vitest + React Testing Library)
   - 自定義 Hooks 測試（特別是 `useBuildProcess`）
   - 工具函數測試（翻譯、常數）
   - Zustand store 測試

2. **整合測試**
   - Wails API 呼叫模擬測試
   - 頁面導航流程測試
   - 狀態管理與 UI 同步測試

3. **E2E 測試** (考慮使用 Playwright)
   - 完整建置流程測試
   - 燒錄功能測試
   - 跨平台相容性測試

#### 測試原則
- 測試行為而非實作細節
- Mock Wails API 呼叫避免依賴後端
- 每個 PR 必須包含相關測試（生產環境要求）
- 覆蓋率目標: 80%（關鍵路徑必須 100%）

### Git Workflow

#### 分支策略
- `main/master`: 生產環境穩定版本
- `feature/*`: 新功能開發分支
- `bugfix/*`: 錯誤修復分支
- `hotfix/*`: 緊急修復分支

#### Commit 訊息規範（Conventional Commits）
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Type 類型:**
- `feat`: 新功能
- `fix`: 錯誤修復
- `docs`: 文件更新
- `style`: 程式碼格式（不影響功能）
- `refactor`: 重構（不改變外部行為）
- `perf`: 效能優化
- `test`: 測試相關
- `chore`: 建置工具、依賴更新

**範例:**
```
feat(platforms): add Rockchip RK3588 platform support

- Add RK3588 platform card to platforms page
- Implement build configuration for Rockchip
- Update platform constants

Closes #42
```

#### PR 規範
- PR 標題遵循 Conventional Commits
- 描述必須包含: 問題背景、解決方案、影響範圍
- 至少一位 Reviewer 核准
- CI/CD 檢查通過
- 合併前必須 rebase 到最新 main

#### 禁止操作
- ❌ 直接提交到 main/master
- ❌ Force push 到共享分支
- ❌ 跳過 Git hooks (`--no-verify`)
- ❌ 未經審查的大型重構

## Domain Context

### BSP (Board Support Package) 基礎知識

#### 什麼是 BSP？
BSP 是介於作業系統與硬體之間的軟體層，包含：
- Bootloader（U-Boot、UEFI）
- Kernel（Linux Kernel 及驅動程式）
- Device Tree（硬體描述）
- RootFS（根檔案系統）
- 工具鏈與建置腳本

#### 支援的硬體平台
1. **Qualcomm Snapdragon** (QSC-8250)
   - 行動處理器架構
   - 常用於 Android BSP
   - 建置工具: Yocto/Android Build System

2. **NVIDIA Jetson Orin** (AGX-Orin-32G)
   - AI 邊緣運算平台
   - 常用於機器人、自駕車
   - 建置工具: NVIDIA SDK Manager

3. **Rockchip** (RK3588)
   - 高效能 ARM SoC
   - 常用於 Android/Linux 開發板
   - 建置工具: Rockchip SDK

4. **NXP i.MX 8M** (IMX8M-PLUS)
   - 工業級處理器
   - 常用於 Yocto Linux
   - 建置工具: Yocto/Buildroot

### 典型工作流程
1. **下載 BSP 原始碼** (Downloads 頁面)
2. **選擇目標平台** (Platforms 頁面)
3. **設定建置參數** (Settings 頁面)
4. **執行建置** (Platform Workspace)
5. **燒錄映像檔到硬體** (Platform Workspace)

### 關鍵術語
- **Image**: 建置完成的映像檔（可燒錄到儲存裝置）
- **Flash**: 將映像檔寫入硬體的過程
- **Workspace**: 建置過程的工作目錄
- **Build Log**: 建置過程的輸出訊息
- **Progress**: 建置/燒錄的進度百分比

## Important Constraints

### 技術限制
1. **Wails 限制**
   - 必須使用 HashRouter（`#/` 路由）而非 BrowserRouter
   - 不支援某些 Node.js 原生模組
   - 跨平台 API 需測試各作業系統相容性

2. **前端限制**
   - 檔案系統操作必須透過 Wails API（不能直接使用瀏覽器 File API）
   - 大檔案處理需考慮記憶體限制（BSP 檔案可能 >10GB）
   - 終端機日誌需限制顯示行數（避免 DOM 過大）

3. **後端限制**
   - Go 建置流程需考慮跨平台編譯
   - 外部工具依賴（git, make, gcc）需檢查是否安裝
   - 建置過程可能需要數小時（需非同步執行）

### 業務限制
1. **使用者環境**
   - 開發者機器可能無網路連線（內網環境）
   - 需支援離線模式（BSP 檔案預先下載）
   - 硬碟空間可能不足（建置需要 50-100GB）

2. **安全性限制**
   - BSP 原始碼可能包含機密資訊
   - 不允許自動回傳使用資料（隱私考量）
   - 需支援企業代理伺服器設定

3. **效能考量**
   - 建置過程 CPU 密集（需進度指示器）
   - 檔案 I/O 密集（建議使用 SSD）
   - 記憶體使用需控制（避免 OOM）

### 平台相容性
- **Windows 10/11**: 主要目標平台
- **macOS**: 次要支援（開發者可能使用 Mac）
- **Linux**: 必須支援（BSP 建置通常在 Linux 環境）

## External Dependencies

### 必要工具（使用者需自行安裝）
1. **Git** (>= 2.20)
   - BSP 原始碼通常使用 Git 管理
   - 需檢查: `git --version`

2. **建置工具鏈**
   - **Linux**: gcc, make, python3
   - **Windows**: WSL2 + Ubuntu（推薦）
   - **macOS**: Xcode Command Line Tools

3. **平台專屬工具**
   - **Qualcomm**: Android SDK, repo tool
   - **NVIDIA**: NVIDIA SDK Manager
   - **Rockchip**: Rockchip 官方建置環境
   - **NXP**: Yocto 依賴套件

### Runtime 依賴
- **Go Runtime**: Go 1.23+（建置時需要）
- **Node.js**: Node 18+（前端開發時需要，打包後不需要）

### 可選依賴
- **Docker**: 隔離建置環境（避免污染主機）
- **SSH Client**: 遠端燒錄支援
- **Serial Console Tools**: 除錯硬體啟動過程

### 網路服務（可選）
- **BSP 下載伺服器**: 內部或外部 BSP 儲存庫
- **代理伺服器**: 企業環境可能需要設定 HTTP_PROXY
- **更新檢查服務**: 檢查應用程式版本更新（未來功能）

### 開發依賴
- **Wails CLI**: `go install github.com/wailsapp/wails/v2/cmd/wails@latest`
- **npm/pnpm**: 前端套件管理
- **SASS compiler**: SCSS 編譯（Vite 自動處理）

---

## 備註

### 文件維護
- 本文件應隨專案演進持續更新
- 重大架構變更需更新「Architecture Patterns」章節
- 新增外部依賴需記錄在「External Dependencies」章節

### AI 助理使用建議
- 閱讀本文件後，再參考 `openspec/AGENTS.md` 了解工作流程
- 修改程式碼前，確認符合「Code Style」與「Architecture Patterns」
- 遇到 BSP 相關問題，參考「Domain Context」章節
- 評估技術方案時，考慮「Important Constraints」中的限制

### 專案狀態
- **階段**: MVP（Minimum Viable Product）
- **前端完成度**: 90%（UI/UX 完整，待後端整合）
- **後端完成度**: 10%（基礎架構，待實作核心功能）
- **測試覆蓋率**: 0%（MVP 階段先以功能為主）

### 快速參考連結
- Wails 文件: https://wails.io/docs/
- React 文件: https://react.dev/
- Zustand 文件: https://zustand-demo.pmnd.rs/
- Vite 文件: https://vitejs.dev/
