# BSP LaunchPad - React Frontend

這是一個遵循 Wails 整合標準的 React 前端專案，完全按照 `2_wails_integration.md` 規範實作。

## 專案結構

```
frontend/
├── src/
│   ├── components/         # 可重複使用的 UI 元件
│   │   ├── Header.jsx
│   │   ├── Sidebar.jsx
│   │   ├── PlatformCard.jsx
│   │   └── TerminalLog.jsx
│   ├── layouts/           # 頁面布局
│   │   └── DefaultLayout.jsx
│   ├── pages/             # 路由頁面
│   │   ├── Dashboard.jsx
│   │   ├── Platforms.jsx
│   │   ├── Downloads.jsx
│   │   ├── Settings.jsx
│   │   ├── PlatformWorkspace.jsx
│   │   └── Login.jsx
│   ├── store/             # Zustand 狀態管理
│   │   └── appStore.js
│   ├── hooks/             # 自定義 Hooks
│   │   ├── useTranslation.js
│   │   ├── useBuildProcess.js
│   │   └── useWails.js
│   ├── utils/             # 工具函數與常數
│   │   ├── translations.js
│   │   └── constants.js
│   ├── assets/
│   │   └── styles/        # SCSS 樣式文件
│   │       ├── variables.scss
│   │       ├── base.scss
│   │       ├── layout.scss
│   │       └── components.scss
│   ├── App.jsx            # 主應用程式（含 Router）
│   └── main.jsx           # 進入點
└── wailsjs/               # Wails 自動產生的 API（不要手動修改）
```

## 核心技術

- **React 18** - Function Components + Hooks
- **React Router v6** - HashRouter（Wails 官方建議）
- **Zustand** - 輕量級狀態管理
- **SCSS** - 樣式預處理器（禁用 Tailwind CSS）
- **Lucide React** - Icon 庫
- **Vite** - 建置工具

## 主要功能

### 1. 狀態管理 (Zustand)

所有全域狀態集中於 `store/appStore.js`：

```javascript
const { theme, lang, setTheme, setLang } = useAppStore();
```

### 2. 多語言支援

使用 `useTranslation` Hook：

```javascript
const { t } = useTranslation();
<button>{t('login')}</button>
```

支援語言：English, 繁體中文, 简体中文, 日本語, 한국어

### 3. 主題切換

支援 Light/Dark 模式，使用 CSS 變數實作：

```javascript
const { theme, setTheme } = useAppStore();
setTheme('dark');
```

### 4. 路由管理

使用 React Router v6 + HashRouter：

```javascript
<Routes>
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/platforms" element={<Platforms />} />
  ...
</Routes>
```

### 5. Wails API 整合

所有 Wails API 呼叫封裝於 `hooks/useWails.js`：

```javascript
const { validateImageExisted, startBuild } = useWails();
```

## 開發流程

### 安裝依賴

```bash
cd frontend
npm install
```

### 開發模式

**重要：必須使用 `wails dev`**

```bash
# 在專案根目錄執行
wails dev
```

❌ **不要使用** `npm run dev` - 無法連接 Wails Runtime

### 建置生產版本

```bash
# 在專案根目錄執行
wails build
```

## 元件化原則

### Single Responsibility（單一職責）

每個元件只負責一件事：

- `Header.jsx` - 頂部導航列
- `Sidebar.jsx` - 側邊選單
- `PlatformCard.jsx` - 平台卡片
- `TerminalLog.jsx` - 終端機日誌顯示

### Props 傳遞

禁止跨多層 props 傳遞，使用 Zustand Store 共享狀態。

### 樣式規範

- 只使用 SCSS（禁止 inline styles 或 CSS-in-JS）
- 採用 BEM 命名規範
- 全域變數定義於 `variables.scss`

## Wails 後端整合

### 1. 匯入自動產生的 API

```javascript
import { ValidateImageExisted } from '../../wailsjs/go/main/App';
```

### 2. 封裝成 Hook

```javascript
export const useWails = () => {
  const validateImage = async (path) => {
    return await ValidateImageExisted(path);
  };
  return { validateImage };
};
```

### 3. 在元件中使用

```javascript
const { validateImage } = useWails();
const isValid = await validateImage('/path/to/image');
```

## 頁面說明

### Dashboard (儀表板)

顯示系統狀態與最近活動。

### Platforms (平台選擇)

選擇硬體平台（Qualcomm, NVIDIA, Rockchip, NXP）。

### PlatformWorkspace (平台工作區)

Build 與 Flash 操作介面，包含：
- 即時日誌顯示
- 進度條
- 配置選項

### Downloads (下載中心)

管理 BSP 套件下載。

### Settings (設定)

應用程式配置（工作區路徑、通知、Proxy）。

## 樣式變數

主要顏色定義於 `variables.scss`：

```scss
$color-primary: #3b82f6;
$color-success: #10b981;
$color-warning: #f59e0b;
$color-error: #ef4444;
```

## 注意事項

1. **不要修改 `wailsjs/` 目錄** - 由 Wails 自動產生
2. **必須使用 `wails dev`** - 才能連接 Golang 後端
3. **禁止使用 Tailwind** - 只使用 SCSS
4. **狀態集中管理** - 使用 Zustand Store
5. **遵循 BEM 命名** - 樣式類別命名規範

## 下一步

1. 根據後端 Go API 更新 `useWails.js`
2. 實作真實的 Build/Flash 邏輯
3. 連接檔案系統對話框（使用 Wails Runtime）
4. 加入錯誤處理與通知系統
5. 實作下載進度追蹤

## 參考文件

- [Wails 官方文檔](https://wails.io/)
- [React Router v6](https://reactrouter.com/)
- [Zustand](https://github.com/pmndrs/zustand)
