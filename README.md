# MultiStream Hub

Twitch × YouTube 多直播觀看中心（GitHub Pages 靜態網站）。

**最新版本：V1.3.0（2026-10-16）**

網站：https://joy510163.github.io/myMultistream/

## V1.3.0 新功能

- **JSON 備份與還原**：在「我的組合」下載包含個人觀看清單及具名組合的 JSON，匯入時可選「合併」或「取代」。合併保留目前個人觀看清單，遇到同名組合則保留本機版本；取代會覆蓋兩類資料，請先備份。
- **監看卡片排序**：使用拖曳或上下移動按鈕調整順序；重新整理後仍保留個人清單順序。具名組合需手動按「更新此組合」保存修改。
- **專注觀看模式**：保留觀看控制台與工具列，隱藏介紹、新增來源輸入列與頂部導覽列；可直接點「離開專注模式」。
- **播放效能上限**：在設定中控制同時啟用的監看播放器數（0、2、4、8、16）；其餘仍保留可切換的預覽卡片。預設 4 台監看播放器，不包含主畫面。此控制不代表能強制控制 YouTube/Twitch 畫質或保證自動播放。

## 原有功能

Twitch/YouTube 播放、可拖曳一大多小布局、聊天室獨立切換及 YouTube 主題設定、LocalStorage 清單、Hash 網址分享（三種匯入模式）、具名直播組合管理、通知淡入／淡出與連續訊息更新。

## 開發與部署

`npm install` 後執行 `npm run build`。使用 `.github/workflows/deploy.yml` 部署 GitHub Pages；儲存庫須使用 `myMultistream` 的路徑。

GitHub 更新路徑與測試指引見 [UPDATE_GUIDE.md](UPDATE_GUIDE.md)，歷史版本見 [CHANGELOG.md](CHANGELOG.md)。
