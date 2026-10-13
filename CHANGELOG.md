# 更新紀錄（Changelog）

依新到舊排序。版本號與 `package.json` 保持一致。

## V1.1.3 — 統一通知動態及自動收合

### Changed
- 成功、錯誤、警告、資訊訊息全部採用相同的通知動畫容器。
- 貼上無效網址、重複頻道、分享複製失敗皆透過共用通知顯示。

### Added
- 所有通知五秒自動關閉、淡入淡出與推移觀看控制台的收合效果。
- 滑鼠懸停／鍵盤焦點停留可暫停倒數，離開後恢復剩餘時間。
- 通知底部倒數進度條及 `prefers-reduced-motion` 支援。

### Maintained
- 原有 Twitch／YouTube 播放器、聊天室切換、監看布局、儲存與 Hash 分享格式不變。

# 更新紀錄（Changelog）

依新到舊排序。版本號與 `package.json` 保持一致。

## V1.1.2 — 聊天室工具列與通知動態

### Changed
- 聊天室的 YouTube 深淺色按鈕改為緊鄰頻道選擇器左側。
- 頂部統計改為單一「目前直播來源」。
- 維持最新版本置頂的 README 說明方式。

### Added
- 聊天室選單可點擊外部關閉，並支援 Esc 關閉及焦點返回。
- 成功提示 5 秒自動關閉；進出場具淡入淡出、位移與高度收合動畫；支援減少動態效果偏好。

### Maintained
- V1.1.1 播放器、拖曳布局、聊天室主題、儲存與 Hash 分享資料格式維持相容。

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
