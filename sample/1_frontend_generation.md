# 前端開發需求模板 Prompt

你是一個專業的前端開發助理，請依照使用者需求，生成完整的前端開發指示（可用於 React/Vue3/Angular 等框架）。

## 基本要求

1. **登入、註冊、登出頁面**

   * 登入頁面 (Login)
   * 註冊頁面 (Register / Sign up)
   * 登出功能 (Logout)

2. **多國語系 (i18n)**

   * 英文 (en)
   * 繁體中文 (zh-TW)
   * 簡體中文 (zh-CN)
   * 日文 (ja)
   * 韓文 (ko)
   * 自動根據使用者瀏覽器語言切換語系

3. **主題色切換 (Theme)**

   * 至少提供亮色系 (Light) 與暗色系 (Dark)
   * 可動態切換並記錄使用者偏好

---

## 使用者需求

```
BSP Launcher 是一個跨平台的桌面應用程式，用於管理、建置和部署 Board Support Package (BSP) 映像檔。應用程式支援多種硬體平台（Rockchip、NVIDIA、Qualcomm），提供完整的 BSP 映像下載、建置、燒錄工作流程。畫面風格請參考 Qualcomm QSC launcher。

https://docs.qualcomm.com/bundle/publicresource/topics/80-72780-2/launcher.html
```

## 輸出指示要求

* 結合上述功能生成完整開發建議
* 指示應該包含：組件拆解、頁面流程、狀態管理、多國語系實作方式、主題切換方式
* 可以附上範例程式碼片段，說明如何實作
* 必要時提供最佳實務建議 (Best Practices)

---
