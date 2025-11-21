````
# GEMINI.md
**React + Wails 前端整合實作指南**

本文件規範如何將 React 前端正確整合至 Wails Golang 專案，並建立可維護、可擴充的專案架構。所有內容皆以 React Function Component、生態系標準工具、Wails 2.x 官方整合方式為基礎。

---

## 1. 專案結構規範（Frontend）

```
frontend/
 ├── src/
 │    ├── components/      # 可重複使用的小型 UI 元件
 │    ├── layouts/         # 各行為 Layout（Default / Admin...）
 │    ├── pages/           # Page Routing 目錄（對應 react-router）
 │    ├── store/           # Redux or Zustand 狀態集中
 │    ├── hooks/           # useWails / useAPI 等抽象邏輯
 │    ├── assets/          # 圖片、SCSS、fonts
 │    └── App.jsx          # 主程式，包含 Router + Layout
 └── wailsjs/              # Wails 自動產生的 API（不要手動修改）
```

---

## 2. 元件化原則（Componentization）

將 `root.html` 中視覺結構完整拆分為 React 組件：

- `Header.jsx`
- `Sidebar.jsx`
- `Footer.jsx`
- `MainContent.jsx`
- `NavigationMenu.jsx`

> **原則：每一個 component 只負責一件事（Single Responsibility）。**

---

## 3. 路由管理（React Router v6）

每個 Page 放置於 `src/pages/`，並使用 HashRouter（Wails 官方建議）：

```jsx
import { HashRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </HashRouter>
  );
}
```

---

## 4. 狀態統一管理（Redux 或 Zustand）

禁止跨多層 props 傳遞。共用資料皆需集中管理。

### ✔ Redux Toolkit 或 ✔ Zustand

範例（Zustand）：

```js
import { create } from "zustand";

export const useAppStore = create((set) => ({
  config: {},
  setConfig: (cfg) => set({ config: cfg }),
}));
```

---

## 5. React Hooks 取代 DOM 操作

禁止：

- `document.querySelector`
- `document.getElementById`
- `window.onload`

改採：

- `useEffect` → component mount/unmount
- `useRef`   → DOM 操控
- `useMemo`  → 計算快取
- `useCallback` → 避免無謂 re-render

範例：

```jsx
const inputRef = useRef(null);

useEffect(() => {
  inputRef.current.focus();
}, []);
```

---

## 6. 樣式與 Layout 架構

### 6.1 Layout 抽離

```
src/layouts/
 ├── DefaultLayout.jsx
 └── AdminLayout.jsx
```

`App.jsx` 中套用：

```jsx
<DefaultLayout>
  <Home />
</DefaultLayout>
```

### 6.2 樣式規範（SCSS）

- **只允許 SCSS（禁止 CSS-in-JS、inline-style、TailwindCSS）**
- 採 **BEM 命名規範** 或 **Utility-first**
- 全域樣式放於 `src/assets/styles/`

結構：

```
assets/styles/
 ├── base.scss
 ├── layout.scss
 ├── variables.scss
 └── mixins.scss
```

---

## 7. Wails 後端整合原則

React 前端可直接使用 Wails 自動產生的 API：

```jsx
import { ValidateImageExisted } from "../../../wailsjs/go/main/App";
```

呼叫方式（Promise）：

```jsx
const exist = await ValidateImageExisted(path);
```

### 7.1 封裝成 Hook 或 Store

```jsx
import { ValidateImageExisted } from "../../wailsjs/go/main/App";

export const useWails = () => {
  const validateImage = async (path) => {
    return await ValidateImageExisted(path);
  };

  return { validateImage };
};
```

或封進 Redux async：

```js
export const fetchConfig = createAsyncThunk(
  "config/fetch",
  async () => await GetConfig()
);
```

---

## 8. 必須使用 `wails dev` 測試

React 在真實瀏覽器中無法讀取：

- Wails Bridge
- Golang API
- Runtime 模組

必須執行：

```
wails dev
```

不可使用：

```
npm start
```

否則會出現 `ValidateImageExisted is undefined`。

---

## 9. 開發流程建議

1. 前端編譯：由 Vite 完成
2. 整合 Wails API：用自動產生的 wailsjs
3. Hooks + Redux 抽離邏輯
4. SCSS 套版與樣式規範
5. 最終在 Wails runtime 中測試

---

## 10. 完整導入步驟（快速版）

1. 建立 React 結構
2. 建立 pages + router
3. 建立布局 Layout
4. 安裝 Redux 或 Zustand
5. 產生 wailsjs 並封裝 API
6. 抽離樣式到 SCSS
7. `wails dev` 驗證整合
8. `wails build` 輸出最終可執行檔

---

**提示：** 可依此 GEMINI.md 直接規劃 React + Wails 專案，並保持專案架構一致與可維護性。
````
