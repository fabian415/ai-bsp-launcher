# 🚀 快速啟動指南

## 立即開始使用重構後的 BSP LaunchPad

### 1️⃣ 安裝依賴（已完成）

```bash
cd frontend
npm install  # ✅ 已執行完成
```

### 2️⃣ 啟動開發伺服器

```bash
# 從專案根目錄執行
wails dev
```

這會：
- 啟動 Go 後端
- 啟動 Vite 開發伺服器
- 開啟應用程式視窗
- 支援 Hot Reload

### 3️⃣ 測試功能

應用程式啟動後，你可以測試：

#### 登入畫面
- ✅ 主題切換 (Light/Dark)
- ✅ 語言切換 (5 種語言)
- ✅ 登入表單（任意輸入即可進入）

#### 主應用程式
- ✅ 側邊欄導航
- ✅ Dashboard（系統狀態）
- ✅ Platforms（平台選擇）
- ✅ Downloads（下載管理）
- ✅ Settings（設定頁面）

#### Platform Workspace
1. 點擊 Platforms
2. 選擇任一平台（如 Qualcomm Snapdragon）
3. 測試 Build/Flash 按鈕
4. 觀察終端機日誌與進度條

### 4️⃣ 檢查點

確認以下功能正常：

- [ ] 應用程式成功啟動
- [ ] 登入頁面顯示正確
- [ ] 主題切換功能正常
- [ ] 語言切換功能正常
- [ ] 側邊欄導航可點擊
- [ ] 各頁面正確顯示
- [ ] Platform Workspace 可進入
- [ ] Build/Flash 模擬流程運作

### 5️⃣ 建置生產版本

```bash
# 從專案根目錄
wails build
```

建置完成後，執行檔位於：
- Windows: `build/bin/test-bsp-launcher.exe`
- macOS: `build/bin/test-bsp-launcher.app`
- Linux: `build/bin/test-bsp-launcher`

## 🛠 開發建議

### 修改前端程式碼

所有前端檔案位於 `frontend/src/`：

```
frontend/src/
├── components/     # UI 元件
├── pages/          # 路由頁面
├── hooks/          # 自定義 Hooks
├── store/          # Zustand Store
└── assets/styles/  # SCSS 樣式
```

### 熱重載

修改任何 `.jsx` 或 `.scss` 檔案後，Vite 會自動重載。

### 新增頁面

1. 在 `frontend/src/pages/` 創建新檔案
2. 在 `App.jsx` 中加入路由
3. 在 `Sidebar.jsx` 中加入導航項目

### 新增 Wails API

1. 在 `app.go` 中定義 Go 函數
2. 執行 `wails dev`（自動產生綁定）
3. 在 `useWails.js` 中匯入並封裝
4. 在元件中使用 Hook

## 📚 重要文件

- `frontend/README.md` - 前端專案說明
- `frontend/INTEGRATION_CHECKLIST.md` - 整合檢查清單
- `WAILS_INTEGRATION_SUMMARY.md` - 完整總結

## ⚠️ 常見問題

### Q: 執行 `npm run dev` 沒反應？

**A:** 必須使用 `wails dev`，不是 `npm run dev`。

### Q: Wails API 未定義？

**A:** 確保：
1. 在 Go 中定義了函數
2. 使用 `wails dev` 啟動
3. 函數有正確的綁定

### Q: 樣式沒有套用？

**A:** 檢查：
1. SCSS 檔案是否正確匯入
2. `vite.config.js` 配置是否正確
3. 瀏覽器開發者工具中的錯誤訊息

### Q: 熱重載不工作？

**A:** 重新啟動 `wails dev`。

## 🎯 下一步

1. **整合後端 API**
   - 在 `app.go` 中實作函數
   - 更新 `useWails.js` 綁定

2. **實作真實功能**
   - Build 流程
   - Flash 功能
   - 檔案系統操作

3. **優化與測試**
   - 效能優化
   - 錯誤處理
   - 使用者體驗改善

## 💡 提示

- 使用 React DevTools 檢查元件狀態
- 使用瀏覽器開發者工具調試樣式
- 查看 Wails 文檔了解更多 API：https://wails.io/

---

**準備好了嗎？執行 `wails dev` 開始吧！** 🚀

