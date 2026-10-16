## V1.4.3 更新

上傳 `src/main.tsx`、`src/style.css` 到 GitHub 的 `src/`，以及根目錄 `package.json`、`index.html`、`README.md`、`CHANGELOG.md`、`UPDATE_GUIDE.md`。其餘文件保持不變。

# V1.4.2 GitHub 更新指引

請先備份目前個人組合，並使用一般 GitHub 網站 **Add file → Upload files**（無須 github.dev）：

## 第一批：`src/`

網址：https://github.com/joy510163/myMultistream/tree/main/src

- `main.tsx` — 覆蓋
- `style.css` — 覆蓋
- `core.ts` — 覆蓋（保存／分享格式相容性必須更新）

Commit：`feat: add multi-team esports layout`

## 第二批：儲存庫根目錄

網址：https://github.com/joy510163/myMultistream

- `package.json`、`index.html`、`README.md`、`CHANGELOG.md`、`UPDATE_GUIDE.md`、`FIX_NOTES.md`

Commit：`docs: release v1.4.2`

不要把 `src/` 的檔案上傳到根目錄。`src/backup.ts`、`src/collections.ts`、`vite.config.ts`、`.github/workflows/deploy.yml` 不需要變動。第二批提交完成後，再檢查最新 GitHub Actions 建置結果。

## 建議驗收

1. 電競：設定官方 + 左右各多台；檢查排序、交換、候補移動、候補顯示切換。
2. 在較窄螢幕檢查三欄水平捲動、Twitch 尺寸及 YouTube 播放。
3. 檢查播放器數量上限、音訊選擇、臨時放大、聊天室。
4. 儲存組合、刷新頁面、匯出 JSON、複製 Hash，確認角色資料保留。
5. 檢查 V1.4.1 舊分享連結讀取和一般一大多小模式。

本環境缺少完整 npm 依賴，正式 `npm run build` 尚未通過；請以 GitHub Actions 作為正式建置驗證。
