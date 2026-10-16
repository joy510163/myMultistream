import React from 'react';
import {createRoot} from 'react-dom/client';
import {Plus,Share2,MessageSquare,Volume2,VolumeX,MonitorPlay,Trash2,ArrowUpRight,Pin,ChevronDown,ChevronUp,Copy,X,Check,Settings,ExternalLink,PanelRightClose,PanelRightOpen,RotateCcw,Play,AlertCircle,AlertTriangle,GripVertical,Sun,Moon,Info,FolderOpen,Save,FolderPlus,Pencil} from 'lucide-react';
import {type Layout,parseStream,loadSaved,save,encodeLayout,decodeLayout,mergeLayout,streamSrc,chatSrc} from './core';
import {type SavedCollection,loadCollections,saveCollections,normalizeCollectionName} from './collections';
import './style.css';
function App(){
 const [personal,setPersonal]=React.useState<Layout>(loadSaved);
 const [collections,setCollections]=React.useState<SavedCollection[]>(loadCollections);
 const [collectionOpen,setCollectionOpen]=React.useState(false);
 const [collectionName,setCollectionName]=React.useState('');
 const [selectedCollectionId,setSelectedCollectionId]=React.useState<string|null>(null);
 const [deleteCollectionId,setDeleteCollectionId]=React.useState<string|null>(null);
 const [active,setActive]=React.useState<Layout>(()=>loadSaved());
 const [temporary,setTemporary]=React.useState(false);
 const [incoming,setIncoming]=React.useState<Layout|null>(null);
 const [importError,setImportError]=React.useState('');
 const [replaceConfirm,setReplaceConfirm]=React.useState(false);
 const [addInput,setAddInput]=React.useState('');
 type NoticeKind = 'success' | 'error' | 'warning' | 'info';
 type Notice = {id:number; message:string; kind:NoticeKind};
 const [notice,setNotice]=React.useState<Notice|null>(null);
 const [noticeVisible,setNoticeVisible]=React.useState(true);
 const [noticeRevision,setNoticeRevision]=React.useState(0);
 const [noticeResuming,setNoticeResuming]=React.useState(false);
 const [noticePaused,setNoticePaused]=React.useState(false);
 const noticeTimer=React.useRef<ReturnType<typeof setTimeout>|null>(null);
 const noticeExitTimer=React.useRef<ReturnType<typeof setTimeout>|null>(null);
 const noticeRemaining=React.useRef(5000);
 const noticeStarted=React.useRef(0);
 const noticeNextId=React.useRef(0);
 const chatPickerRef=React.useRef<HTMLDivElement|null>(null);
 const chatTriggerRef=React.useRef<HTMLButtonElement|null>(null);
 const [shareOpen,setShareOpen]=React.useState(false);
 const [showChat,setShowChat]=React.useState(true);
 const [chatSelectionOpen,setChatSelectionOpen]=React.useState(false);
 const [muted,setMuted]=React.useState(true);
 const [settings,setSettings]=React.useState(false);
 const [youtubeChatTheme,setYoutubeChatTheme]=React.useState<'dark'|'light'>(()=>localStorage.getItem('msh:youtubeChatTheme:v1')==='light'?'light':'dark');
 const [limit,setLimit]=React.useState(9);
 const [showAll,setShowAll]=React.useState(true);
 const [liveMonitors,setLiveMonitors]=React.useState(()=>localStorage.getItem('msh:liveMonitors:v1')==='true');
 const [panelWidth,setPanelWidth]=React.useState(()=>{const v=Number(localStorage.getItem('msh:monitorWidth:v1'));return Number.isFinite(v)&&v>=400&&v<=1200?v:440;});
 const [dragging,setDragging]=React.useState(false);
 const viewRef=React.useRef<HTMLElement|null>(null);
 function clearNoticeTimers(){
  if(noticeTimer.current!==null){clearTimeout(noticeTimer.current);noticeTimer.current=null;}
  if(noticeExitTimer.current!==null){clearTimeout(noticeExitTimer.current);noticeExitTimer.current=null;}
 }
 function notify(message:string,kind:NoticeKind='success'){
  clearNoticeTimers();
  noticeRemaining.current=5000;
  setNoticePaused(false);
  setNoticeResuming(Boolean(notice && !noticeVisible));
  setNoticeVisible(true);
  // Keep the mounted notification identity when replacing a visible message.
  setNotice(current=>current ? {...current,message,kind} : {id:++noticeNextId.current,message,kind});
  // Only the progress bar and five-second timer should restart.
  setNoticeRevision(current=>current+1);
 }
 function dismissNotice(){
  if(noticeTimer.current!==null){clearTimeout(noticeTimer.current);noticeTimer.current=null;}
  setNoticeVisible(false);
 }
 function pauseNotice(){
  if(!notice||!noticeVisible||noticePaused)return;
  if(noticeTimer.current!==null){clearTimeout(noticeTimer.current);noticeTimer.current=null;}
  noticeRemaining.current=Math.max(0,noticeRemaining.current-(Date.now()-noticeStarted.current));
  setNoticePaused(true);
 }
 function resumeNotice(){if(noticePaused)setNoticePaused(false);}
 React.useEffect(()=>{
  if(!notice||!noticeVisible||noticePaused)return;
  noticeStarted.current=Date.now();
  noticeTimer.current=setTimeout(()=>{noticeTimer.current=null;setNoticeVisible(false);},noticeRemaining.current);
  return ()=>{if(noticeTimer.current!==null){clearTimeout(noticeTimer.current);noticeTimer.current=null;}};
 },[noticeRevision,noticeVisible,noticePaused]);
 React.useEffect(()=>{
  if(!notice||noticeVisible)return;
  noticeExitTimer.current=setTimeout(()=>{setNotice(null);noticeExitTimer.current=null;},440);
  return ()=>{if(noticeExitTimer.current!==null){clearTimeout(noticeExitTimer.current);noticeExitTimer.current=null;}};
 },[notice?.id,noticeVisible]);
 React.useEffect(()=>()=>clearNoticeTimers(),[]);
 React.useEffect(()=>{
  if(!chatSelectionOpen)return;
  const onPointerDown=(event:PointerEvent)=>{if(!chatPickerRef.current?.contains(event.target as Node))setChatSelectionOpen(false);};
  const onKeyDown=(event:KeyboardEvent)=>{if(event.key==='Escape'){setChatSelectionOpen(false);chatTriggerRef.current?.focus();}};
  document.addEventListener('pointerdown',onPointerDown);
  document.addEventListener('keydown',onKeyDown);
  return ()=>{document.removeEventListener('pointerdown',onPointerDown);document.removeEventListener('keydown',onKeyDown);};
 },[chatSelectionOpen]);
 React.useEffect(()=>{localStorage.setItem('msh:youtubeChatTheme:v1',youtubeChatTheme);},[youtubeChatTheme]);
 React.useEffect(()=>{localStorage.setItem('msh:liveMonitors:v1',String(liveMonitors));},[liveMonitors]);
 React.useEffect(()=>{localStorage.setItem('msh:monitorWidth:v1',String(panelWidth));},[panelWidth]);
 React.useEffect(()=>{
  if(!dragging)return;
  const move=(e:PointerEvent)=>{const rect=viewRef.current?.getBoundingClientRect();if(!rect)return;const available=rect.width-18;const max=Math.max(400,available-420);setPanelWidth(Math.round(Math.min(max,Math.max(400,rect.right-e.clientX))));};
  const stop=()=>setDragging(false);
  window.addEventListener('pointermove',move);window.addEventListener('pointerup',stop);window.addEventListener('pointercancel',stop);
  return ()=>{window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',stop);window.removeEventListener('pointercancel',stop);};
 },[dragging]);
 React.useEffect(()=>{try{const parsed=decodeLayout(location.hash);if(parsed){setIncoming(parsed);setImportError('');}}catch(e){setImportError((e as Error).message);}},[]);
 function apply(next:Layout){setActive(next);if(!temporary){setPersonal(next);save(next);}}
 function clearHash(){history.replaceState(null,'',location.pathname+location.search);}
 function importChoice(mode:'temporary'|'merge'|'replace'){
  if(!incoming)return;
  if(mode==='temporary'){setActive(incoming);setTemporary(true);notify('已暫時開啟分享組合，個人清單未變更');}
  if(mode==='merge'){const result=mergeLayout(personal,incoming);setPersonal(result);setActive(result);save(result);setTemporary(false);notify('已合併頻道並儲存至我的清單');clearHash();}
  if(mode==='replace'){setPersonal(incoming);setActive(incoming);save(incoming);setTemporary(false);notify('已取代我的清單');clearHash();}
  setIncoming(null);setReplaceConfirm(false);
 }
 function backPersonal(){setTemporary(false);setActive(personal);clearHash();notify('已返回個人清單');}
 function storeCollections(next:SavedCollection[]){
  try{saveCollections(next);setCollections(next);return true;}catch{notify('無法儲存組合，瀏覽器儲存空間可能不足','error');return false;}
 }
 function createCollection(){
  const name=normalizeCollectionName(collectionName);
  if(!name){notify('請輸入組合名稱（最多 40 字）','error');return;}
  if(collections.length>=30){notify('最多儲存 30 組觀看組合','warning');return;}
  if(collections.some(c=>c.name.toLocaleLowerCase()===name.toLocaleLowerCase())){notify('已有相同名稱的組合，請換個名稱','warning');return;}
  const now=new Date().toISOString();
  const item:SavedCollection={id:crypto.randomUUID(),name,layout:structuredClone(active),createdAt:now,updatedAt:now};
  if(storeCollections([...collections,item])){setSelectedCollectionId(item.id);setCollectionName('');notify(`已儲存組合「${name}」`);}
 }
 function activateCollection(item:SavedCollection){
  const layout=structuredClone(item.layout);
  setPersonal(layout);setActive(layout);save(layout);setTemporary(false);clearHash();
  setSelectedCollectionId(item.id);setCollectionOpen(false);notify(`已載入組合「${item.name}」`);
 }
 function updateCollection(item:SavedCollection){
  const next=collections.map(c=>c.id===item.id?{...c,layout:structuredClone(active),updatedAt:new Date().toISOString()}:c);
  if(storeCollections(next)){setSelectedCollectionId(item.id);notify(`已更新組合「${item.name}」`);}
 }
 function renameCollection(item:SavedCollection){
  const name=window.prompt('重新命名觀看組合',item.name);
  if(name===null)return;
  const valid=normalizeCollectionName(name);
  if(!valid){notify('名稱不可空白或超過 40 字','error');return;}
  if(collections.some(c=>c.id!==item.id&&c.name.toLocaleLowerCase()===valid.toLocaleLowerCase())){notify('已有相同名稱的組合','warning');return;}
  if(storeCollections(collections.map(c=>c.id===item.id?{...c,name:valid,updatedAt:new Date().toISOString()}:c)))notify('組合已重新命名');
 }
 function deleteCollection(item:SavedCollection){
  if(deleteCollectionId!==item.id){setDeleteCollectionId(item.id);return;}
  if(storeCollections(collections.filter(c=>c.id!==item.id))){
   if(selectedCollectionId===item.id)setSelectedCollectionId(null);
   setDeleteCollectionId(null);notify(`已刪除組合「${item.name}」`);
  }
 }

 function add(){try{const item=parseStream(addInput);if(active.streams.some(x=>x.key===item.key))throw Error('這台直播已經在清單內囉');if(active.streams.length>=64)throw Error('目前最多儲存 64 台直播');apply({...active,streams:[...active.streams,item],main:active.main??item.key,chat:active.chat??item.key});setAddInput('');notify(`已加入 ${item.label}`);}catch(e){const message=(e as Error).message;notify(message,message.includes('已經在清單')?'warning':'error');}}
 function remove(key:string){const streams=active.streams.filter(x=>x.key!==key);apply({...active,streams,main:active.main===key?streams[0]?.key??null:active.main,chat:active.chat===key?streams[0]?.key??null:active.chat});}
 const main=active.streams.find(s=>s.key===active.main)||active.streams[0];
 const chat=active.streams.find(s=>s.key===active.chat)||main;
 const others=active.streams.filter(s=>s.key!==main?.key);
 const displayed=showAll?others:others.slice(0,Math.max(0,limit-1));
 const shareUrl=location.origin+location.pathname+location.search+'#s='+encodeLayout(active);
 async function copyShare(){try{await navigator.clipboard.writeText(shareUrl);notify('分享網址已複製！');}catch{notify('無法自動複製，請手動選取網址','error');}}
 return <div className="app">
  <header className="topbar"><div className="brand"><span className="brand-mark"><MonitorPlay size={21}/></span><div><strong>MultiStream <span>Hub</span></strong><small>YOUR LIVE CONTROL ROOM</small></div></div><div className="top-actions"><span className="live-counter"><span className="pulse"/>{active.streams.length} 個頻道</span>{temporary&&<button className="ghost small" onClick={backPersonal}><RotateCcw size={15}/> 返回個人清單</button>}<button className="ghost collection-top-btn" onClick={()=>setCollectionOpen(true)}><FolderOpen size={16}/> 我的組合</button><button className="btn primary" onClick={()=>setShareOpen(true)}><Share2 size={16}/> <span>分享組合</span></button><button className="icon-button" title="偏好設定" onClick={()=>setSettings(true)}><Settings size={19}/></button></div></header>
  <main className="workspace">
   <section className="intro"><div><p className="eyebrow">STREAM WORKSPACE <span className="accent-line"/></p><h1>你的直播，一眼掌握。</h1><p className="sub">集中觀看 Twitch 與 YouTube，讓精彩不漏接。</p></div><div className="stats"><div><strong>{active.streams.length.toString().padStart(2,'0')}</strong><small>目前直播來源</small></div></div></section>
   <section className="add-panel"><div className="add-icon"><Plus size={21}/></div><div className="add-field"><label htmlFor="stream-url">新增直播來源</label><input id="stream-url" placeholder="貼上 Twitch 或 YouTube 直播網址…" value={addInput} onChange={e=>setAddInput(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')add();}}/></div><button className="btn primary add-button" onClick={add}><Plus size={16}/> 加入頻道</button></section>
   {notice&&<div key={notice.id} className={'notice-slot '+(noticeVisible?'is-visible':'is-leaving')+(noticePaused?' is-paused':'')+(noticeResuming?' is-resuming':'')} onPointerEnter={pauseNotice} onPointerLeave={resumeNotice} onFocusCapture={pauseNotice} onBlurCapture={e=>{if(!e.currentTarget.contains(e.relatedTarget as Node|null))resumeNotice();}} role={notice.kind==='error'?'alert':'status'} aria-live={notice.kind==='error'?'assertive':'polite'}><div className={'alert '+notice.kind}>{notice.kind==='success'?<Check size={16}/>:notice.kind==='error'?<AlertCircle size={16}/>:notice.kind==='warning'?<AlertTriangle size={16}/>:<Info size={16}/>}<span>{notice.message}</span><button aria-label="關閉提示" onClick={dismissNotice}><X size={14}/></button></div><div key={noticeRevision} className="notice-progress" aria-hidden="true"/></div>}
   {temporary&&<div className="temporary-banner"><Pin size={16}/> 目前為暫時分享觀看模式，新增或移除不會改動你的個人清單。<button onClick={backPersonal}>返回我的清單</button></div>}
   <div className="section-title"><div><span className="section-kicker">01 / LIVE VIEW</span><h2>觀看控制台</h2></div><div className="toolbar"><button className="ghost" onClick={()=>setLiveMonitors(v=>!v)}>{liveMonitors?'關閉多台同步播放':'啟用多台同步播放'}</button><button className="ghost" onClick={()=>setMuted(v=>!v)} title="設定重新載入播放器時的預設靜音狀態"><span>{muted?<VolumeX size={16}/>:<Volume2 size={16}/>}</span>{muted?'新播放器預設靜音':'新播放器預設有聲'}</button><button className="ghost" onClick={()=>setShowChat(v=>!v)}>{showChat?<PanelRightClose size={16}/>:<PanelRightOpen size={16}/>} {showChat?'隱藏聊天室':'顯示聊天室'}</button></div></div>
   <section ref={viewRef} style={{'--monitor-width':`${panelWidth}px`} as React.CSSProperties} className={'view-grid '+(dragging?' resizing ':'')+(showChat?'':'without-chat')+(liveMonitors?' with-live-monitors':'')}>
    <div className="main-column"><div className="player-shell"><div className="player-head"><div><span className="playing-dot"/> <span>主直播</span> {main&&<span className={'platform '+main.platform}>{main.platform==='twitch'?'TWITCH':'YOUTUBE'}</span>}</div><div className="head-actions">{main&&<a title="開啟平台原始連結" href={main.platform==='twitch'?`https://www.twitch.tv/${main.id}`:`https://www.youtube.com/watch?v=${main.id}`} target="_blank" rel="noreferrer"><ExternalLink size={15}/></a>}</div></div><div className="video-area">{main?<iframe key={main.key+':'+muted} src={streamSrc(main,muted)} title={`${main.label} 直播播放器`} allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowFullScreen referrerPolicy="strict-origin-when-cross-origin"/>:<div className="empty-player"><div className="empty-graphic"><MonitorPlay size={55} strokeWidth={1.2}/></div><h3>準備好開始觀看了嗎？</h3><p>貼上第一個 Twitch 或 YouTube 直播連結<br/>建立你的專屬多直播控制台。</p></div>}</div><div className="player-foot"><div><strong>{main?main.label:'尚未選擇直播'}</strong><small>{main?'直播內容由原平台提供':'等待新增直播來源'}</small></div>{main&&<div className="foot-buttons"><button className="icon-button" onClick={()=>remove(main.key)} title="移除此頻道"><Trash2 size={16}/></button></div>}</div></div>
    {showChat&&<div className="chat-box"><div className="chat-header"><div><MessageSquare size={17}/><strong>直播聊天室</strong></div><div className="chat-picker" ref={chatPickerRef}>{chat?.platform==='youtube'&&<button className="chat-theme-toggle" title={`切換 YouTube 聊天室為${youtubeChatTheme==='dark'?'淺色':'深色'}主題（可能受 YouTube 限制）`} aria-label="切換 YouTube 聊天室深淺色" onClick={()=>setYoutubeChatTheme(t=>t==='dark'?'light':'dark')}>{youtubeChatTheme==='dark'?<Moon size={14}/>:<Sun size={14}/>}<span>{youtubeChatTheme==='dark'?'深色':'淺色'}</span></button>}<button ref={chatTriggerRef} aria-expanded={chatSelectionOpen} aria-haspopup="true" aria-controls="chat-channel-menu" onClick={()=>setChatSelectionOpen(v=>!v)} disabled={!chat}>{chat?chat.label:'尚無頻道'} <ChevronDown size={15}/></button>{chatSelectionOpen&&<div className="chat-menu" id="chat-channel-menu">{active.streams.map(s=><button key={s.key} onClick={()=>{apply({...active,chat:s.key});setChatSelectionOpen(false);}}>{s.platform==='twitch'?'🟣':'🔴'} {s.label}</button>)}</div>}</div></div><div className="chat-content">{chat?<iframe key={chat.key+(chat.platform==='youtube'?youtubeChatTheme:'')} title={`${chat.label} 聊天室`} src={chatSrc(chat,youtubeChatTheme)} referrerPolicy="strict-origin-when-cross-origin"/>:<div className="chat-empty"><MessageSquare size={28}/><p>加入直播後即可切換聊天室</p></div>}</div><div className="chat-footer">聊天室由 Twitch / YouTube 官方提供；YouTube 主題切換為非官方相容性設定，效果依平台而定</div></div>}</div>
    <div className="resize-handle" role="separator" aria-label="拖曳調整主畫面與監看區寬度" aria-orientation="vertical" tabIndex={0} onPointerDown={e=>{if(e.button!==0)return;e.preventDefault();setDragging(true);}} onKeyDown={e=>{if(e.key==='ArrowLeft'){e.preventDefault();setPanelWidth(v=>Math.min(1200,v+30));}if(e.key==='ArrowRight'){e.preventDefault();setPanelWidth(v=>Math.max(400,v-30));}}} title="拖曳調整寬度；方向鍵也可以調整"><GripVertical size={18}/></div>
    <aside className="monitor-column"><div className="monitor-head"><div><h3>其他直播</h3><span>LIVE MONITOR GRID</span></div><span className="monitor-count">{others.length} 台</span></div>{others.length===0?<div className="monitor-empty"><Play size={26}/><p>其他頻道將出現在這裡</p><small>點擊任一頻道可切換至主畫面</small></div>:<div className="monitor-list">{displayed.map((s,i)=><div className="monitor-card" key={s.key}>{liveMonitors?<div className="monitor-live"><iframe title={`${s.label} 監看直播`} src={streamSrc(s,true)} allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowFullScreen referrerPolicy="strict-origin-when-cross-origin"/></div>:<button className={'monitor-preview '+s.platform} onClick={()=>apply({...active,main:s.key})} title={`將 ${s.label} 設為主畫面`}><span className="preview-number">{String(i+2).padStart(2,'0')}</span><div className="preview-play"><Play size={23} fill="currentColor"/></div><span className="preview-caption">點擊切換主畫面</span></button>}<div className="monitor-meta"><div><span className={'mini-platform '+s.platform}>{s.platform==='twitch'?'T':'▶'}</span><strong title={s.label}>{s.label}</strong></div><div className="monitor-actions"><button title="切換到主畫面" onClick={()=>apply({...active,main:s.key})}><MonitorPlay size={14}/></button><button title="檢視聊天室" onClick={()=>{apply({...active,chat:s.key});setShowChat(true);}}><MessageSquare size={14}/></button><button title="移除頻道" onClick={()=>remove(s.key)}><X size={14}/></button></div></div></div>)}{others.length>limit-1&&<button className="show-more" onClick={()=>setShowAll(v=>!v)}>{showAll?<ChevronUp size={16}/>:<ChevronDown size={16}/>} {showAll?'收起其他頻道':`顯示其餘 ${others.length-displayed.length} 台`}</button>}</div>}<div className="monitor-note"><AlertCircle size={15}/><p>可啟用多台同步播放，啟用後監看區使用真正的嵌入播放器，預設靜音；Twitch 需至少 400 × 300 尺寸。大量同時播放可能耗用大量網路與硬體資源。</p></div></aside>
   </section>
   <footer>MultiStream Hub <span>·</span> V1.2.0 <span>·</span> Made for the moments worth watching.</footer>
  </main>

  {collectionOpen&&<div className="overlay" onMouseDown={e=>{if(e.target===e.currentTarget){setCollectionOpen(false);setDeleteCollectionId(null);}}}><div className="modal collection-modal"><div className="modal-head"><div><p className="eyebrow">SAVED COLLECTIONS</p><h2>我的直播組合</h2></div><button className="icon-button" onClick={()=>{setCollectionOpen(false);setDeleteCollectionId(null);}} aria-label="關閉組合管理"><X size={19}/></button></div>
  <p className="modal-description">將目前的觀看清單存成具名組合。切換後可以繼續調整；想保留變更，再按「更新此組合」。組合僅儲存在這台裝置的瀏覽器。</p>
  <div className="collection-create"><input aria-label="新組合名稱" maxLength={40} placeholder="例如：電競賽事、常看實況主…" value={collectionName} onChange={e=>setCollectionName(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')createCollection();}}/><button className="btn primary" onClick={createCollection}><FolderPlus size={16}/> 儲存新組合</button></div>
  <div className="collection-count">已儲存 {collections.length} / 30 組 · 目前觀看 {active.streams.length} 台</div>
  {collections.length===0?<div className="collection-empty"><FolderOpen size={26}/><p>目前還沒有儲存組合</p><small>在上方輸入名稱，即可把目前的觀看配置保存起來。</small></div>:<div className="collection-list">{collections.map(item=><div className="collection-card" key={item.id}><div className="collection-info"><strong>{item.name}</strong>{selectedCollectionId===item.id&&<span className="collection-active">最近載入／儲存</span>}<small>{item.layout.streams.length} 台頻道 · 更新於 {new Date(item.updatedAt).toLocaleDateString('zh-TW')}</small></div><div className="collection-actions"><button onClick={()=>activateCollection(item)} title="載入此組合"><FolderOpen size={14}/> 載入</button><button onClick={()=>updateCollection(item)} title="將目前畫面覆寫到此組合"><Save size={14}/> 更新此組合</button><button onClick={()=>renameCollection(item)} title="重新命名"><Pencil size={14}/></button><button className={deleteCollectionId===item.id?'collection-delete-confirm':''} onClick={()=>deleteCollection(item)} title="刪除組合"><Trash2 size={14}/>{deleteCollectionId===item.id?' 確認刪除':''}</button>{deleteCollectionId===item.id&&<button onClick={()=>setDeleteCollectionId(null)}>取消</button>}</div></div>)}</div>}
  <div className="info-note">分享方式：先按「載入」組合，再點右上角「分享組合」。分享網址只包含該次觀看配置，不包含你其他已儲存的組合。</div></div></div>}
  {shareOpen&&<div className="overlay" onMouseDown={e=>{if(e.target===e.currentTarget)setShareOpen(false);}}><div className="modal"><div className="modal-head"><div><p className="eyebrow">SHARE YOUR VIEW</p><h2>分享觀看組合</h2></div><button className="icon-button" onClick={()=>setShareOpen(false)}><X size={19}/></button></div><p className="modal-description">包含 {active.streams.length} 台頻道、主畫面與聊天室選擇。朋友可直接開啟，不需登入。</p><label className="field-label">專屬網址</label><textarea readOnly rows={3} value={shareUrl} onFocus={e=>e.currentTarget.select()}/><button className="btn primary wide" onClick={copyShare}><Copy size={17}/> 複製分享網址</button><div className="info-note">此網址包含觀看組合資訊，任何取得連結的人都可以查看。分享網址可能較長；目前沒有短網址服務。</div></div></div>}
  {(incoming||importError)&&<div className="overlay"><div className="modal"><div className="modal-head"><div><p className="eyebrow">SHARED COLLECTION</p><h2>{importError?'分享連結有問題':'收到一份直播組合'}</h2></div></div>{importError?<><p className="modal-description">{importError}</p><button className="btn primary wide" onClick={()=>{setImportError('');clearHash();}}>返回我的控制台</button></>:<><p className="modal-description">包含 <b>{incoming!.streams.length}</b> 台直播。請選擇如何開啟（預設建議暫時開啟）。</p><div className="import-options"><button className="import-option recommended" onClick={()=>importChoice('temporary')}><span><strong>暫時開啟 <em>推薦</em></strong><small>立即觀看，不修改你儲存的清單</small></span><ArrowUpRight size={20}/></button><button className="import-option" onClick={()=>importChoice('merge')}><span><strong>加入我的清單</strong><small>新增未存在的頻道，保留個人布局</small></span><Plus size={20}/></button><button className="import-option danger-option" onClick={()=>setReplaceConfirm(true)}><span><strong>取代目前清單</strong><small>覆蓋本機原本的頻道與布局</small></span><Trash2 size={18}/></button></div><button className="ghost dismiss" onClick={()=>{setIncoming(null);clearHash();}}>取消，保留我的清單</button>{replaceConfirm&&<div className="confirm-box"><p>確定取代嗎？你的 {personal.streams.length} 台已儲存頻道會被這份 {incoming!.streams.length} 台的組合覆蓋。此操作無法自動復原。</p><div><button className="ghost" onClick={()=>setReplaceConfirm(false)}>返回</button><button className="btn danger" onClick={()=>importChoice('replace')}>確認取代</button></div></div>}</>}</div></div>}
  {settings&&<div className="overlay" onMouseDown={e=>{if(e.target===e.currentTarget)setSettings(false);}}><div className="modal"><div className="modal-head"><div><p className="eyebrow">PREFERENCES</p><h2>顯示設定</h2></div><button className="icon-button" onClick={()=>setSettings(false)}><X size={18}/></button></div><label className="field-label" htmlFor="limit">監看區預設顯示數量</label><select id="limit" value={limit} onChange={e=>{setLimit(Number(e.target.value));setShowAll(false);}}><option value={5}>5 台（主畫面 + 4 張卡片）</option><option value={9}>9 台（主畫面 + 8 張卡片）</option><option value={17}>17 台（主畫面 + 16 張卡片）</option></select><label className="field-label" htmlFor="youtube-chat-theme">YouTube 聊天室主題</label><select id="youtube-chat-theme" value={youtubeChatTheme} onChange={e=>setYoutubeChatTheme(e.target.value as 'dark'|'light')}><option value="dark">深色（預設）</option><option value="light">淺色</option></select><div className="info-note">YouTube 的聊天室是跨網域 iframe，無法由本站 CSS 直接改色；主題選項會嘗試透過嵌入參數切換，並不保證 YouTube 一定套用。</div><div className="version-info"><Info size={16}/><span>目前版本 <strong>V1.2.0</strong> · <a href="https://github.com/joy510163/myMultistream" target="_blank" rel="noreferrer">GitHub 專案</a> · <a href="https://github.com/joy510163/myMultistream/blob/main/CHANGELOG.md" target="_blank" rel="noreferrer">更新紀錄</a></span></div><div className="info-note">開啟「多台同步播放」後，監看卡片會變成真正的影片播放器；監看區可拖曳調整寬度。聊天室嵌入可能受平台設定與瀏覽器限制。</div><button className="btn primary wide" onClick={()=>setSettings(false)}>完成</button></div></div>}
 </div>;
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
