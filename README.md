# 中文注音打字遊戲 Pro (Zhuyin Challenge Pro)

![Version](https://img.shields.io/badge/version-1.3.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

這是一個專為繁體中文使用者設計的注音打字練習遊戲，旨在幫助學生與初學者提升注音輸入的速度與準確度。

## ✨ 特色功能

- **多級難度系統**：包含「初學者」、「入門」、「進階」與「大師」模式。
- **進階詞庫**：內建常用漢字、詞語及四字成語。
- **全球排行榜**：挑戰世界各地的玩家，留下你的大名！
- **成績分享**：一鍵生成精美的成績單圖片，分享你的進步。
- **PWA 支援**：支援離線遊玩，可安裝至手機或電腦桌面。
- **現代化設計**：基於 Vite + Tailwind CSS 的響應式介面。

## 🚀 快速開始

### 線上遊玩
訪問連結：[https://cagoooo.github.io/typeCC/](https://cagoooo.github.io/typeCC/)

### 本地開發
1. 克隆專案：
   ```bash
   git clone https://github.com/cagoooo/typeCC.git
   ```
2. 安裝依賴：
   ```bash
   npm install
   ```
3. 啟動開發伺服器：
   ```bash
   npm run dev
   ```
4. 建構生產版本：
   ```bash
   npm run build
   ```

## 🛠️ 技術棧

- **Vite**：快速的前端開發與建構工具。
- **Firebase (Auth & Firestore)**：提供登入與全球排行榜。
- **html2canvas**：實作成績單截圖功能。
- **Tailwind CSS**：專業的響應式風格設計。

## 📜 授權

本專案採用 MIT 授權條款。

---

<!-- BEGIN:PROJECT_GUIDE -->
## 專案導覽

中文注音打字遊戲 (pro版)

- 專案定位：互動遊戲／遊戲化學習專案
- Repository：`cagoooo/typeCC`
- 可見性：公開
- 主要技術：JavaScript、Vite、Firebase、Tailwind CSS
- 線上入口：未在 GitHub repository metadata 設定

### 可以怎麼應用

- 課堂暖身、複習活動或學習站任務
- 校慶、闖關或社團活動中的互動挑戰
- 替換題庫、美術、音效與規則後，延伸成其他學科或主題遊戲

這些是依目前專案定位整理的延伸方向，不代表所有情境都已內建完成；實作前請先確認現有功能與資料格式。

### 技術與專案結構

- `README.md`
- `index.html`
- `package.json`
- `public`
- `scripts`
- `src`
- `vite.config.js`

檔案結構會隨版本演進；若本節與程式碼不一致，以目前預設分支的原始碼為準。

### 本機執行

```bash
npm install
# dev
npm run dev
# build
npm run build
```
請以 `package.json` 的 `scripts` 為準；若專案需要雲端服務，請先建立自己的環境變數與測試專案。

### 給 AI Agent 的接手指南

1. 先閱讀本 README、`AGENTS.md`（若有）、套件腳本與部署設定。
2. 先找出遊戲狀態、關卡／題庫資料與輸入控制的來源，再調整規則。
3. 更換素材時同步檢查授權、載入路徑、碰撞區域與不同螢幕比例。
4. 修改後至少驗證開始、遊玩、計分／勝負、重新開始，以及手機與桌面版面。
5. 不要捏造尚未存在的功能；README 與實作有落差時，應同時更新文件。
6. 提交前只納入本次任務檔案，並記錄實際執行過的驗證。

### 安全與資料注意事項

- 不要提交 `.env`、服務帳號、API 金鑰、token、學生個資或正式環境匯出資料。
- 使用 Firebase、Supabase、Google API 或其他雲端服務時，請建立自己的測試專案並套用最小權限。
- 若要公開衍生作品，請先確認程式碼、圖片、音訊、字型與教材內容的授權。

### 貢獻與客製化

歡迎依教學現場、活動或工作流程需求進行 fork／客製化。建議在變更說明中交代使用情境、主要修改、測試方式，以及是否影響資料格式或部署設定。
<!-- END:PROJECT_GUIDE -->
