# MultiStream Hub V1.0

繁體中文 Twitch + YouTube 多直播監看中心，React + TypeScript + Vite，純靜態部署，沒有後端或資料庫。

## 功能

- 貼上 Twitch 頻道網址、YouTube 直播**影片**網址加入頻道（最多 64 台清單）
- 一台主播放器與多台快速切換監看卡片，並可手動啟用「多台同步播放」將監看卡片切換為真實、預設靜音的官方播放器
- 主直播切換、頻道移除、獨立切換官方聊天室
- 使用 `localStorage` 保存個人清單
- `#s=` Hash 分享（包含頻道清單、主畫面、聊天室）；無需帳號
- 收到分享提供三種選擇：「暫時開啟」（不覆蓋本機儲存）、「加入我的清單」、「二次確認後取代」
- 內建 GitHub Pages 自動部署流程

## 本機執行

安裝 Node.js 20.19+ 或 22.12+，在專案資料夾中：

```bash
npm install
npm run dev
```

開啟 Vite 顯示的網址（通常是 `http://localhost:5173`）。Twitch 嵌入可能需要 HTTPS 才能正常觀看，因此實際播放器建議部署到 GitHub Pages 後測試。

## 部署 GitHub Pages

1. 在 GitHub 建立公開 repository，例如 `multistream-hub`。
2. 將本專案檔案（包含 `.github/workflows/deploy.yml`）推送至 `main` 分支。
3. 到 GitHub repository 的 **Settings → Pages → Build and deployment**，選擇 **GitHub Actions**。
4. Actions 部署完成後開啟 `https://你的帳號.github.io/multistream-hub/`。
5. `vite.config.ts` 會在 GitHub Actions 自動讀取 repository 名稱，設定 Vite `base` 路徑。若改變工作流程部署平台或目錄，請重新確認 `base`。

## 限制與設計取捨

- Twitch 官方播放器要求 HTTPS、正確的 `parent` 網域，且播放器至少 400 × 300 px。此版主播放器會按部署網域填入 `parent`。
- YouTube 目前接受 watch、live、youtu.be 形式的影片 ID，不會自動從頻道首頁尋找最新直播。
- 不保證每台 YouTube 直播都開放嵌入或聊天室；YouTube 直播聊天室嵌入需該直播支援。
- Twitch / YouTube 自動播放及靜音會受瀏覽器政策、平台與嵌入播放器自身控制影響；右上靜音切換是**重新載入主播放器時的初始靜音設定**，並非每台播放器的即時音訊混音控制。
- 預設僅啟用主播放器以節省資源；點選「啟用多台同步播放」才會建立多個監看 iframe。開啟 9 台以上可能非常吃效能，而且是否自動播放仍由瀏覽器和平台決定。Twitch 監看框最低 400 × 300，狹窄螢幕可能出現橫向捲動。
- 分享網址中的 Hash 是可解碼的公開資料，不包含秘密；長清單可能產生非常長的連結。
- 暫時開啟模式的編輯不會寫回自己的 LocalStorage，返回個人清單會還原自己的原有設定。

## 測試

```bash
npm run build
```

手動測試：加入 Twitch / YouTube → 重新整理確認保存 → 分享網址在無痕視窗開啟 → 暫時開啟 → 合併（去重）→ 取代（確認）→ 無效 Hash 錯誤提示。

## V1.1 — 可拖曳多直播網格

- 保留 V1.0 原有的 Twitch / YouTube、聊天室、LocalStorage、Hash 分享及三種匯入方式。
- 桌面寬視窗（約 1180px 以上）：主播放器與監看區之間新增可拖曳分隔線，亦可使用方向鍵微調；寬度自動保存在同一瀏覽器的 LocalStorage。
- 監看卡片依可用寬度自動排列成網格。按「啟用多台同步播放」後，監看卡片切換成官方 iframe 播放器；預設關閉，避免開站瞬間產生過大頻寬負擔。
- Twitch 監看 iframe 保持至少 400 × 300px。較小視窗自動改成上下排列；手機尺寸可能需要橫向滑動 Twitch 播放器。
- 監看直播預設靜音；各平台播放器能否自動播放仍受瀏覽器與直播平台限制。
- 分享資料格式仍為 `version:1`，舊分享連結可以沿用，布局寬度屬於個人偏好而不分享。

### 在既有 GitHub 儲存庫更新

建議使用 GitHub 網頁編輯器 `https://github.dev/<帳號>/<儲存庫>`，依照本新版將以下檔案內容覆蓋並 Commit + Push：`src/main.tsx`、`src/style.css`、`package.json` 和 `README.md`。**不要刪掉原儲存庫或覆蓋 `.github/workflows/deploy.yml`**。Github Actions 會在 main 分支推送後再次部署。

注意：在產生此版的環境中，無法連線到 npm registry，因此只完成了 TypeScript/JSX 語法轉換檢查；完整套件安裝、正式建置與瀏覽器實測仍待 GitHub Actions 驗證。
