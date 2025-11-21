# Wails 整合檢查清單

根據 `2_wails_integration.md` 規範的完整實作檢查清單。

## ✅ 已完成項目

### 1. 專案結構規範

- ✅ `src/components/` - 可重複使用元件
- ✅ `src/layouts/` - Layout 組件
- ✅ `src/pages/` - 路由頁面
- ✅ `src/store/` - Zustand 狀態管理
- ✅ `src/hooks/` - 自定義 Hooks
- ✅ `src/assets/` - 圖片與樣式
- ✅ `src/utils/` - 工具函數
- ✅ `wailsjs/` - Wails 自動產生（已存在）

### 2. 元件化原則

- ✅ Header 元件
- ✅ Sidebar 元件
- ✅ PlatformCard 元件
- ✅ TerminalLog 元件
- ✅ 所有元件遵循 Single Responsibility

### 3. 路由管理

- ✅ 安裝 `react-router-dom` v6
- ✅ 使用 HashRouter
- ✅ 實作所有主要路由：
  - `/dashboard`
  - `/platforms`
  - `/downloads`
  - `/settings`
- ✅ 動態 PlatformWorkspace 顯示

### 4. 狀態管理

- ✅ 安裝 Zustand
- ✅ 建立 `appStore.js`
- ✅ 集中管理所有狀態：
  - 認證狀態
  - 主題與語言
  - 平台選擇
  - Build 狀態與進度

### 5. React Hooks

- ✅ 完全使用 Function Components
- ✅ `useEffect` 管理生命週期
- ✅ 自定義 Hooks：
  - `useTranslation` - 多語言
  - `useBuildProcess` - Build 流程
  - `useWails` - Wails API 封裝
- ✅ 無使用 DOM 操作（`document.querySelector` 等）

### 6. 樣式與 Layout

- ✅ 建立 `DefaultLayout.jsx`
- ✅ 完全使用 SCSS（禁止 Tailwind/CSS-in-JS）
- ✅ 樣式結構：
  - `variables.scss` - 變數定義
  - `base.scss` - 基礎樣式
  - `layout.scss` - 布局樣式
  - `components.scss` - 元件樣式
- ✅ BEM 命名規範
- ✅ 支援 Light/Dark 主題

### 7. Wails 整合

- ✅ 封裝 Wails API 於 `useWails.js`
- ✅ Promise-based 呼叫方式
- ✅ 錯誤處理機制
- ✅ 準備好整合實際 Wails 函數

### 8. 多語言支援

- ✅ 實作 i18n 字典（5 種語言）
- ✅ `useTranslation` Hook
- ✅ 自動偵測瀏覽器語言
- ✅ 語言切換功能

### 9. 配置文件

- ✅ 更新 `package.json` 依賴
- ✅ 配置 `vite.config.js` 支援 React
- ✅ SCSS 預處理器設定
- ✅ 更新 `index.html`

### 10. 頁面完整實作

- ✅ Login 頁面
- ✅ Dashboard 頁面
- ✅ Platforms 頁面
- ✅ Downloads 頁面
- ✅ Settings 頁面
- ✅ PlatformWorkspace 頁面

## 🔄 待整合項目

### Wails 後端連接

1. **更新 `useWails.js`**
   - 匯入實際的 Wails 產生函數
   - 移除 mock console.log
   - 實作真實 API 呼叫

```javascript
// TODO: 更新為實際函數
import { 
  ValidateImageExisted,
  GetConfig,
  SaveConfig,
  StartBuild,
  FlashImage
} from '../../wailsjs/go/main/App';
```

2. **檔案系統對話框**
   - 使用 Wails Runtime Dialog API
   - 實作目錄選擇功能

```javascript
// TODO: 實作
import { SelectDirectory } from '../../wailsjs/runtime/runtime';
```

3. **Build/Flash 流程**
   - 連接真實的 Build API
   - 串流日誌輸出
   - 實際進度回報

4. **下載管理**
   - 實作檔案下載邏輯
   - 進度追蹤
   - 斷點續傳

5. **設定儲存**
   - 持久化配置到檔案系統
   - 使用 Wails 的設定 API

## 🧪 測試流程

### 1. 安裝依賴

```bash
cd frontend
npm install
```

### 2. 啟動開發模式

```bash
# 從專案根目錄執行
wails dev
```

### 3. 測試項目

- [ ] 登入頁面顯示正確
- [ ] 主題切換功能
- [ ] 語言切換功能
- [ ] 側邊欄導航
- [ ] Dashboard 數據顯示
- [ ] 平台選擇功能
- [ ] Platform Workspace 介面
- [ ] Build/Flash 按鈕（模擬）
- [ ] 終端機日誌顯示
- [ ] Settings 表單

### 4. 建置測試

```bash
wails build
```

## 📝 程式碼品質檢查

- ✅ 無使用 `document.querySelector`
- ✅ 無使用 `window.onload`
- ✅ 無 inline styles
- ✅ 無 CSS-in-JS
- ✅ 使用 Function Components
- ✅ Props 不跨多層傳遞
- ✅ 狀態集中管理
- ✅ 元件單一職責
- ✅ SCSS BEM 命名

## 🎯 效能優化（未來）

- [ ] React.memo 優化重渲染
- [ ] useMemo 快取計算
- [ ] useCallback 避免重新建立函數
- [ ] 代碼分割（React.lazy）
- [ ] 圖片懶加載

## 📚 文檔完整性

- ✅ README.md
- ✅ INTEGRATION_CHECKLIST.md
- ✅ 程式碼註解
- ✅ TODO 標記

## ✨ 完成度

**整體完成度：90%**

核心架構與前端實作已完成，剩餘部分為 Wails 後端 API 整合。

## 下一步行動

1. 在 Go 後端實作對應的 API 函數
2. 執行 `wails generate module` 產生 TypeScript 綁定
3. 更新 `useWails.js` 匯入實際函數
4. 測試前後端整合
5. 實作真實的檔案操作與 Build 流程

