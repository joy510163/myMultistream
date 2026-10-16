## 1.4.3

- 電競隊伍拖曳與隊內排序。
- 中央主控台寬度設定。
- 選手臨時置頂與還原。
- 電競音訊快捷操作。
- 改善播放器載入上限與重複 iframe。

## V1.4.2 — 電競賽事多視角（2026-10-16）

### Added
- 官方主控台固定中央；左右各可加入多台隊伍直播，保留 16:9 比例並在必要時水平捲動。
- 隊伍名稱編輯、雙方成員交換、隊內順序微調、移回候補。
- 候補區切換精簡列表／靜態迷你預覽，不額外產生播放器。
- 隊伍直播採用監看播放器數量上限，降低同時載入的 iframe 數量。

### Compatibility
- 保留 `version:1` Hash、LocalStorage、具名組合和 JSON 備份結構。
- 既有單一 left/right 賽事角色自動轉換為新隊伍陣列。
- 一大多小、聊天室、通知、音訊切換及放大功能沿用。

---

## V1.4.0 — 2026-10-16

### Added
- 新增音訊來源選擇與全體靜音切換（受平台播放器 API／瀏覽器政策限制）。
- 新增一大多小、雙欄和四視角網格布局選擇。
- 新增主畫面與監看頻道的臨時放大視窗，支援 Esc 關閉。

### Maintained
- V1.3 的備份還原、直播排序、專注模式、效能控制。
- Twitch / YouTube 觀看、聊天室、通知、組合管理與 Hash 分享資料格式。

---

## V1.3.0 — 2026-10-16

### Added
- JSON 備份與還原（合併／取代）及資料格式檢查。
- 直播監看卡片拖曳排序與上下移動按鈕。
- 專注觀看模式。
- 限制同時啟用監看播放器數量。

### Maintained
- V1.2 直播組合、Hash 分享、通知及聊天室相容性。

---

# CHANGELOG

## V1.2.0 — 直播組合管理

### Added
- 新增具名觀看組合清單，支援儲存、載入、更新、重新命名與刪除。
- 可儲存最多 30 組，每組包含最多 64 台直播的配置。
- 具名組合另行保存到 LocalStorage，不改動既有 Hash 分享版本格式。

### Maintained
- 保留播放器、網格拖曳、聊天室、通知動畫和三種分享匯入模式。

---

> V1.1.3 hotfix：修正通知進場狀態與退場狀態混用；進場動畫於通知掛載時開始，保留 5 秒倒數及暫停。

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


### V1.1.3 hotfix — update visible notifications in place
- Keep the same mounted toast when a new message arrives during its visible phase.
- Replace text, kind and icon without replaying the entrance animation.
- Restart the five-second countdown and progress bar separately.
