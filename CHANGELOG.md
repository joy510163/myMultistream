# 更新紀錄（Changelog）

依新到舊排序。版本號與 `package.json` 保持一致。

## V1.1.1 — YouTube 聊天室主題與文件整理

### Added
- YouTube 聊天室深淺色切換（聊天室工具列與顯示設定）。
- YouTube 主題選擇保存在 LocalStorage。
- 設定面板顯示版本資訊與 GitHub／CHANGELOG 入口。

### Changed
- README 採最新版本優先，完整更新紀錄移到 CHANGELOG。
- 保留 V1.1 的一大多小、監看網格及可拖曳比例、Hash 分享資料格式。

### Fixed
- 移除原 V1.1 壓縮包中未使用的 `Columns3` 匯入，避免 TypeScript unused import 建置失敗。

### Notes
- `dark_theme` 是相容性嘗試，非保證有效的 YouTube 官方設定。網站無法直接修改跨網域 iframe 內的文字和背景。

## V1.1.0 — 可拖曳多直播網格

### Added
- 主播放器與監看區可拖曳的分隔線及寬度保存。
- 監看卡片自適應網格、多台同步播放模式。

### Changed
- 響應式布局調整與監看播放器最小尺寸限制。

## V1.0.0 — 初始版本

### Added
- Twitch／YouTube 直播網址加入與主播放器。
- 切換主直播、頻道刪除與官方聊天室選擇。
- LocalStorage 觀看清單保存。
- Hash 分享與暫時開啟／合併／確認取代。
- GitHub Pages 部署工作流程。
