# V1.4.0 GitHub 上傳說明

請使用一般 GitHub 網頁的兩次分路徑上傳，不使用 github.dev：

1. 進入 `https://github.com/joy510163/myMultistream/tree/main/src`，選 `Add file` → `Upload files`，上傳 **src 內**的 `main.tsx`、`style.css`。
2. 進入 `https://github.com/joy510163/myMultistream` 儲存庫根目錄，上傳 `package.json`、`index.html`、`README.md`、`CHANGELOG.md`、`UPDATE_GUIDE.md`。
3. 每批均提交至 `main`；第二批完成後以最新一次 GitHub Actions 部署結果為準。
4. **絕對不要**把 `main.tsx` 或 `style.css` 放在儲存庫根目錄。`src/core.ts`、`src/backup.ts`、`src/collections.ts` 以及 GitHub Actions 不需修改。

本版音訊切換透過官方 iframe 的靜音參數重設，可能造成播放器緩衝或被瀏覽器阻擋自動有聲播放。放大視窗使用額外的靜音 iframe。這些功能尚需在正式網站實測。
