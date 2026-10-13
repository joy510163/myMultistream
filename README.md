# MultiStream Hub

**最新版本：V1.1.1** · Twitch × YouTube 多直播觀看中心 · React + TypeScript + Vite

🌐 **[立即使用 MultiStream Hub](https://joy510163.github.io/myMultistream/)** · [完整更新紀錄](CHANGELOG.md)

## ✨ V1.1.1 最新更新

- YouTube 聊天室工具列新增 **深色／淺色切換**，在「顯示設定」中也可以調整，偏好保存在瀏覽器 `localStorage`。
- YouTube 主題切換是透過 `dark_theme=1/0` 嵌入網址參數嘗試實現，**不保證 YouTube 會套用**；外部 iframe 的內部文字與背景無法由本站 CSS 強制修改。
- 設定面板新增 **目前版本**、GitHub 專案及 CHANGELOG 連結。
- 更新 README 為最新版本優先、建立 CHANGELOG，並移除未使用的 `Columns3` 匯入。
- **維持 V1.1 功能與 Hash 分享格式相容**；本次不包含短網址／資料庫／自訂網域。

## 已支援功能

- 貼上 Twitch 頻道網址或 YouTube 直播影片網址加入觀看清單（最多 64 台）。
- 一台主直播＋監看網格；可以啟用多台同步播放（效能及播放器尺寸限制請見下方）。
- 桌面版拖曳主畫面／監看區分隔線，並保存監看區寬度。
- 主直播切換、刪除頻道、聊天室獨立切換與顯示／隱藏。
- 使用 `localStorage` 保存個人觀看清單與部分偏好。
- 以 `#s=` Hash 產生分享網址，免登入、免後端。接收分享可 **暫時開啟**／**合併不重複頻道**／**確認後取代**。
- 免費 GitHub Pages 靜態部署，自動讀取 repository 名稱設定 Vite `base`。

## 快速使用

1. 開啟 [網站](https://joy510163.github.io/myMultistream/)。
2. 貼上 Twitch 頻道網址或 YouTube 直播影片網址並加入。
3. 以右側監看網格切換主畫面；需要多台同步播放可按對應按鈕。
4. 聊天室切到 YouTube 時，使用聊天室右上角的 **深色／淺色** 控制切換主題；如果仍異常，請直接開啟原影片聊天室測試。
5. 點「分享組合」取得 Hash 網址。

## 本機開發與建置

需 Node.js（建議 22.12+）及 npm：

```bash
npm install
npm run dev
npm run build
```

## 部署到 GitHub Pages

專案已包含 `.github/workflows/deploy.yml`。推送到 `main` 後，到 GitHub repository 的 **Settings → Pages** 將 Source 選為 **GitHub Actions**。部署結果請至 **Actions** 查看。現有網站網址為 `https://joy510163.github.io/myMultistream/`。

## 已知限制

- Twitch 需要符合官方 HTTPS、`parent` 網域與至少 400 × 300 的嵌入播放器尺寸要求。
- YouTube 只支援可辨識影片 ID 的直播網址；不會自動由頻道首頁尋找正在播放的影片。
- YouTube 聊天室主題參數不是官方可靠的介面契約；聊天室顯示可能仍受 YouTube 本身、瀏覽器外掛與帳號偏好影響。
- 官方聊天室位於不同網域 iframe，不能直接用本站 CSS 改寫其內容。
- 多台同步播放可能耗用大量頻寬與硬體資源；能否自動播放依平台及瀏覽器而定。
- Hash 分享內資料可被任何取得連結的人還原，不包含隱私保護或短網址服務。

## 歷史版本

**V1.1.1 → V1.1.0 → V1.0.0**。詳細修改請見 [CHANGELOG.md](CHANGELOG.md)，最新版本置頂。
