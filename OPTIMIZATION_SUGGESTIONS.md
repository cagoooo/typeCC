# GitHub 移植評估與後續優化建議報告

本報告針對「中文注音打字遊戲 (typeCC)」進行移植到 GitHub 的可行性評估，並提供後續的功能與技術優化建議。

## 🚀 GitHub 移植評估

### 1. 移植可行性：100% (極高)
本專案為純前端應用（單一 HTML 檔案，依賴 CDN 載入 Tailwind CSS 與 FontAwesome），非常適合使用 **GitHub Pages** 進行免費部署。

### 2. 建議部署步驟 (GitHub Actions + Vite)
為了更專業的管理與 SEO，建議將其從單一 HTML 轉換為 Vite 專案：
1.  **專案初始化**：將 `typeCC.html` 拆解為 `index.html`, `style.css` (可繼續用 Tailwind CSS), 與 `main.js`。
2.  **建立 GitHub 專案**：
    *   `git init`
    *   建立 `.gitignore` (排除 `node_modules`, `.env`)
3.  **CI/CD 設定**：
    *   建立 `.github/workflows/deploy.yml`。
    *   設定當 push 到 `main` 分支時，自動打包並推送到 `gh-pages` 分支。
4.  **環境變數安全**：若未來加入 Firebase 或外部 API，請務必遵循「佔位符機制」與「GitHub Secrets 注入」規範。

---

## 🛠️ 後續優化改良建議

### 第一階段：性能與基礎設施
*   **PWA 支援**：加入 Service Worker，實作離線遊戲功能，讓使用者可以將遊戲安裝在手機桌面上。
*   **字型在地化**：目前的 Noto Sans TC 是透過 Google Fonts 載入，考慮使用更輕量化的分段字型載入以提升首屏速度。
*   **靜態資源管理**：將 CSS 與 JS 從 HTML 中抽離，利用 Vite 的 minify 功能壓縮代碼大小。

### 第二階段：遊戲性增強
*   **難度分級**：
    *   **入門**：顯示注音按鍵提示（目前已具備）。
    *   **進階**：隱藏按鍵提示，僅顯示文字。
    *   **大師**：加快落地速度，並加入連擊 (Combo) 分數倍率。
*   **詞庫擴充**：目前的字庫約 100 多字，可加入常用成語、網路用語或學科專有名詞庫，增加練習價值。
*   **音效反饋**：
    *   加入按鍵音。
    *   字元擊破時的清脆音效。
    *   時間倒數最後 10 秒的滴答聲。

### 第三階段：社群與持久化
*   **Firebase 整合**：
    *   **全球排行榜**：使用 Firestore 存儲玩家分數。
    *   **匿名登入**：記錄玩家個人的最佳成績曲線。
*   **分享功能**：生成漂亮的成績截圖圖片（可使用 `html2canvas`），方便玩家分享到社群媒體。

---
*本報告由 Antigravity AI 撰寫，旨在協助專案朝向產品化邁進。*
