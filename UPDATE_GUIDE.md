# V1.3 GitHub 更新方式

請不要上傳外層資料夾，也不要直接將 `main.tsx` 放到儲存庫根目錄。

建議在一般 GitHub 網站上分兩次上傳：

1. 到儲存庫 `src/` 資料夾，上傳 `main.tsx`、`style.css`、新增的 `backup.ts`；其他檔案維持原樣。
2. 回儲存庫根目錄，上傳 `package.json`、`README.md`、`CHANGELOG.md`。

注意：完整 ZIP 內有整份專案供備份；不需要覆蓋 `.github/workflows/deploy.yml`、`vite.config.ts` 或 `src/core.ts`。

部署後驗收：
- 匯出 JSON，改用其他瀏覽器匯入；先測合併，再測取代（先備份）。
- 拖曳監看卡片調整順序，刷新並確認順序保留；使用上下按鈕亦可。
- 專注模式隱藏介紹及輸入列，仍能退出。
- 設定監看播放器上限 0、2、4；切換同步播放後確認超額項目仍顯示卡片。
- 重測聊天室、通知、Hash 分享、組合儲存。

備註：目前完整 npm 安裝／建置在交付環境逾時，須透過 GitHub Actions 確認完整編譯。
