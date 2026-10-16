import React from 'react';
import {createRoot} from 'react-dom/client';
import {Plus,Share2,MessageSquare,Volume2,VolumeX,MonitorPlay,Trash2,ArrowUpRight,Pin,ChevronDown,ChevronUp,Copy,X,Check,Settings,ExternalLink,PanelRightClose,PanelRightOpen,RotateCcw,Play,AlertCircle,AlertTriangle,GripVertical,Sun,Moon,Info,FolderOpen,Save,FolderPlus,Pencil,Download,Upload,Focus,ArrowUp,ArrowDown,Maximize2,Minimize2,LayoutGrid,Headphones,Trophy,ArrowLeftRight,Star,RotateCcw as RestoreIcon} from 'lucide-react';
import {type Layout,parseStream,loadSaved,save,encodeLayout,decodeLayout,mergeLayout,streamSrc,chatSrc} from './core';
import {type SavedCollection,loadCollections,saveCollections,normalizeCollectionName} from './collections';
import {parseBackup,makeBackup,mergeCollections} from './backup';
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
 const [focusMode,setFocusMode]=React.useState(false);
 const [viewLayout,setViewLayout]=React.useState<'focus'|'esports'>(()=>active.viewMode==='esports'?'esports':'focus');
 const [audioKey,setAudioKey]=React.useState<string|null>(null);
 const [zoomKey,setZoomKey]=React.useState<string|null>(null);
 const [monitorCap,setMonitorCap]=React.useState(()=>{const v=Number(localStorage.getItem('msh:monitorCap:v1'));return [0,2,4,8,16].includes(v)?v:4;});
 const [esportsCenterWidth,setEsportsCenterWidth]=React.useState(()=>{const v=Number(localStorage.getItem('msh:esportsCenterWidth:v1'));return Number.isFinite(v)&&v>=480&&v<=1000?v:620;});
 const [spotlightKey,setSpotlightKey]=React.useState<string|null>(null);
 const [activeDrop,setActiveDrop]=React.useState<'teamA'|'teamB'|'reserve'|null>(null);
 const [reserveStyle,setReserveStyle]=React.useState<'compact'|'preview'>(()=>localStorage.getItem('msh:reserveStyle:v1')==='preview'?'preview':'compact');
 const [backupMode,setBackupMode]=React.useState<'merge'|'replace'>('merge');
 const [backupPending,setBackupPending]=React.useState<ReturnType<typeof parseBackup>|null>(null);
 const [backupOpen,setBackupOpen]=React.useState(false);
 const dragSource=React.useRef<string|null>(null);
 const esportsDrag=React.useRef<string|null>(null);
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
 React.useEffect(()=>{localStorage.setItem('msh:monitorCap:v1',String(monitorCap));},[monitorCap]);
 React.useEffect(()=>{localStorage.setItem('msh:reserveStyle:v1',reserveStyle);},[reserveStyle]);
 React.useEffect(()=>{setViewLayout(active.viewMode==='esports'?'esports':'focus');},[active.viewMode]);
 React.useEffect(()=>{if(audioKey&&!active.streams.some(s=>s.key===audioKey))setAudioKey(null);if(zoomKey&&!active.streams.some(s=>s.key===zoomKey))setZoomKey(null);},[active.streams,audioKey,zoomKey]);
 React.useEffect(()=>{if(!zoomKey)return;const onKey=(e:KeyboardEvent)=>{if(e.key==='Escape')setZoomKey(null);};window.addEventListener('keydown',onKey);return()=>window.removeEventListener('keydown',onKey);},[zoomKey]);
 React.useEffect(()=>{
  if(!dragging)return;
  const move=(e:PointerEvent)=>{const rect=viewRef.current?.getBoundingClientRect();if(!rect)return;const available=rect.width-18;const max=Math.max(400,available-420);setPanelWidth(Math.round(Math.min(max,Math.max(400,rect.right-e.clientX))));};
  const stop=()=>setDragging(false);
  window.addEventListener('pointermove',move);window.addEventListener('pointerup',stop);window.addEventListener('pointercancel',stop);
  return ()=>{window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',stop);window.removeEventListener('pointercancel',stop);};
 },[dragging]);
 React.useEffect(()=>{try{const parsed=decodeLayout(location.hash);if(parsed){setIncoming(parsed);setImportError('');}}catch(e){setImportError((e as Error).message);}},[]);
 function apply(next:Layout){setActive(next);setViewLayout(next.viewMode==='esports'?'esports':'focus');if(!temporary){setPersonal(next);save(next);}}
 function clearHash(){history.replaceState(null,'',location.pathname+location.search);}
 function importChoice(mode:'temporary'|'merge'|'replace'){
  if(!incoming)return;
  if(mode==='temporary'){setActive(incoming);setViewLayout(incoming.viewMode==='esports'?'esports':'focus');setTemporary(true);notify('已暫時開啟分享組合，個人清單未變更');}
  if(mode==='merge'){const result=mergeLayout(personal,incoming);setPersonal(result);setActive(result);setViewLayout(result.viewMode==='esports'?'esports':'focus');save(result);setTemporary(false);notify('已合併頻道並儲存至我的清單');clearHash();}
  if(mode==='replace'){setPersonal(incoming);setActive(incoming);setViewLayout(incoming.viewMode==='esports'?'esports':'focus');save(incoming);setTemporary(false);notify('已取代我的清單');clearHash();}
  setIncoming(null);setReplaceConfirm(false);
 }
 function backPersonal(){setTemporary(false);setActive(personal);setViewLayout(personal.viewMode==='esports'?'esports':'focus');clearHash();notify('已返回個人清單');}
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
  setPersonal(layout);setActive(layout);setViewLayout(layout.viewMode==='esports'?'esports':'focus');save(layout);setTemporary(false);clearHash();
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

 function reorder(from:string,to:string){
  if(from===to)return;
  const src=active.streams.findIndex(s=>s.key===from),dst=active.streams.findIndex(s=>s.key===to);
  if(src<0||dst<0)return;
  const streams=[...active.streams];const [moved]=streams.splice(src,1);streams.splice(dst,0,moved);
  apply({...active,streams});
 }
 function shiftStream(key:string,delta:number){
  const ix=active.streams.findIndex(s=>s.key===key);const other=active.streams[ix+delta];
  if(other)reorder(key,other.key);
 }
 function exportBackup(){
  const json=JSON.stringify(makeBackup(personal,collections),null,2);
  const url=URL.createObjectURL(new Blob([json],{type:'application/json'}));
  const link=document.createElement('a');link.href=url;link.download=`multistream-backup-${new Date().toISOString().slice(0,10)}.json`;link.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);notify('備份檔已建立');
 }
 async function readBackup(file:File|undefined){
  if(!file)return;
  try{
   if(file.size>1024*1024)throw Error('備份檔不可超過 1MB');
   setBackupPending(parseBackup(JSON.parse(await file.text())));notify('備份檔已讀取，請確認匯入方式','info');
  }catch(e){setBackupPending(null);notify((e as Error).message||'備份檔無效','error');}
 }
 function restoreBackup(){
  if(!backupPending)return;
  try{
   const updated=backupMode==='merge'?mergeCollections(collections,backupPending.collections):backupPending.collections;
   // Write collection data first, and keep the current working session unchanged in merge mode.
   saveCollections(updated);
   if(backupMode==='replace'){
    save(backupPending.personal);setPersonal(backupPending.personal);setActive(backupPending.personal);setViewLayout(backupPending.personal.viewMode==='esports'?'esports':'focus');
    setTemporary(false);clearHash();setSelectedCollectionId(null);
   }
   setCollections(updated);setBackupPending(null);setBackupOpen(false);
   notify(backupMode==='replace'?'備份已還原，原有清單已取代':'備份組合已合併完成');
  }catch{notify('儲存空間不足，無法完成匯入','error');}
 }
 function add(){try{const item=parseStream(addInput);if(active.streams.some(x=>x.key===item.key))throw Error('這台直播已經在清單內囉');if(active.streams.length>=64)throw Error('目前最多儲存 64 台直播');apply({...active,streams:[...active.streams,item],main:active.main??item.key,chat:active.chat??item.key});setAddInput('');notify(`已加入 ${item.label}`);}catch(e){const message=(e as Error).message;notify(message,message.includes('已經在清單')?'warning':'error');}}
 function normalizedRoles(){
  const r=active.esports??{official:null,left:null,right:null};
  return {...r,teamA:r.teamA??(r.left?[r.left]:[]),teamB:r.teamB??(r.right?[r.right]:[]),teamAName:r.teamAName??'隊伍 A',teamBName:r.teamBName??'隊伍 B'};
 }
 function remove(key:string){
  const streams=active.streams.filter(x=>x.key!==key);const r=normalizedRoles();
  const teamA=r.teamA.filter(k=>k!==key),teamB=r.teamB.filter(k=>k!==key);
  apply({...active,streams,main:active.main===key?streams[0]?.key??null:active.main,chat:active.chat===key?streams[0]?.key??null:active.chat,esports:{...r,official:r.official===key?null:r.official,teamA,teamB,left:teamA[0]??null,right:teamB[0]??null}});
 }
 function assignEsports(key:string,role:'official'|'teamA'|'teamB'|'reserve'){
  const r=normalizedRoles();
  const teamA=r.teamA.filter(k=>k!==key),teamB=r.teamB.filter(k=>k!==key);
  const official=r.official===key?null:r.official;
  if(role==='official'){
   // Replaced official returns to reserves; team allocations remain unique.
   apply({...active,esports:{...r,official:key,teamA,teamB,left:teamA[0]??null,right:teamB[0]??null}});
  }else{
   if(role==='teamA')teamA.push(key);
   if(role==='teamB')teamB.push(key);
   apply({...active,esports:{...r,official,teamA,teamB,left:teamA[0]??null,right:teamB[0]??null}});
  }
 }
 function reorderTeam(team:'teamA'|'teamB',key:string,delta:number){
  const r=normalizedRoles();const list=[...r[team]];const at=list.indexOf(key);const target=at+delta;
  if(at<0||target<0||target>=list.length)return;
  [list[at],list[target]]=[list[target],list[at]];
  apply({...active,esports:{...r,[team]:list,left:(team==='teamA'?list:r.teamA)[0]??null,right:(team==='teamB'?list:r.teamB)[0]??null}});
 }
 function dropEsports(key:string,target:'teamA'|'teamB'|'reserve',before?:string){
  if(!active.streams.some(s=>s.key===key))return;
  if(before===key){endEsportsDrag();return;}
  const r=normalizedRoles();
  const a=r.teamA.filter(k=>k!==key),b=r.teamB.filter(k=>k!==key);
  if(target!=='reserve'){
   const list=target==='teamA'?a:b;
   const at=before?list.indexOf(before):-1;
   list.splice(at<0?list.length:at,0,key);
  }
  const official=r.official===key?null:r.official;
  apply({...active,esports:{...r,official,teamA:a,teamB:b,left:a[0]??null,right:b[0]??null}});
  esportsDrag.current=null;setActiveDrop(null);
 }
 function startEsportsDrag(e:React.DragEvent<HTMLElement>,key:string){esportsDrag.current=key;e.dataTransfer.effectAllowed='move';e.dataTransfer.setData('text/plain',key);}
 function endEsportsDrag(){esportsDrag.current=null;setActiveDrop(null);}
 function onEsportsDrop(e:React.DragEvent<HTMLElement>,target:'teamA'|'teamB'|'reserve',before?:string){e.preventDefault();const key=esportsDrag.current;if(key)dropEsports(key,target,before);else endEsportsDrag();}
 function swapTeams(){const r=normalizedRoles();apply({...active,esports:{...r,teamA:r.teamB,teamB:r.teamA,left:r.teamB[0]??null,right:r.teamA[0]??null,teamAName:r.teamBName,teamBName:r.teamAName}});}
 React.useEffect(()=>{localStorage.setItem('msh:esportsCenterWidth:v1',String(esportsCenterWidth));},[esportsCenterWidth]);
 React.useEffect(()=>{if(spotlightKey&&!active.streams.some(s=>s.key===spotlightKey))setSpotlightKey(null);},[spotlightKey,active.streams]);
 const main=active.streams.find(s=>s.key===active.main)||active.streams[0];
 const chat=active.streams.find(s=>s.key===active.chat)||main;
 const roles=normalizedRoles();
 const assignedKeys=new Set([roles.official,...roles.teamA,...roles.teamB].filter(Boolean));
 const others=active.streams.filter(s=>viewLayout==='esports'?!assignedKeys.has(s.key):s.key!==main?.key);
 const displayed=showAll?others:others.slice(0,Math.max(0,limit-1));
 const zoomed=active.streams.find(s=>s.key===zoomKey);
 const audible=audioKey===null?(viewLayout==='esports'?(roles.official??main?.key):main?.key):audioKey;
 // Esports slots consume the monitor budget; the official broadcast is independent.
 const teamBudget=monitorCap;
 // Mount only the selected budget. Prioritize selected audio and spotlight without exceeding it.
 const priorityKeys=[spotlightKey,audible,...roles.teamA,...roles.teamB].filter((key):key is string=>Boolean(key)&&[...roles.teamA,...roles.teamB].includes(key!));
 const mountedTeamKeys=new Set(priorityKeys.slice(0,teamBudget));

 const monitoredKeys=new Set(displayed.slice(0,monitorCap).map(s=>s.key));
 if(liveMonitors&&audioKey&&displayed.some(s=>s.key===audioKey)&&monitorCap>0&&!monitoredKeys.has(audioKey)){
  const last=[...monitoredKeys].at(-1);if(last)monitoredKeys.delete(last);monitoredKeys.add(audioKey);
 }
 const shareUrl=location.origin+location.pathname+location.search+'#s='+encodeLayout(active);
 async function copyShare(){try{await navigator.clipboard.writeText(shareUrl);notify('分享網址已複製！');}catch{notify('無法自動複製，請手動選取網址','error');}}
 return <div className={"app "+(focusMode?"focus-mode":"")}>
  <header className="topbar"><div className="brand"><span className="brand-mark"><MonitorPlay size={21}/></span><div><strong>MultiStream <span>Hub</span></strong><small>YOUR LIVE CONTROL ROOM</small></div></div><div className="top-actions"><span className="live-counter"><span className="pulse"/>{active.streams.length} 個頻道</span>{temporary&&<button className="ghost small" onClick={backPersonal}><RotateCcw size={15}/> 返回個人清單</button>}<button className="ghost collection-top-btn" onClick={()=>setCollectionOpen(true)}><FolderOpen size={16}/> 我的組合</button><button className="btn primary" onClick={()=>setShareOpen(true)}><Share2 size={16}/> <span>分享組合</span></button><button className="icon-button" title="偏好設定" onClick={()=>setSettings(true)}><Settings size={19}/></button></div></header>
  <main className="workspace">
   <section className="intro"><div><p className="eyebrow">STREAM WORKSPACE <span className="accent-line"/></p><h1>你的直播，一眼掌握。</h1><p className="sub">集中觀看 Twitch 與 YouTube，讓精彩不漏接。</p></div><div className="stats"><div><strong>{active.streams.length.toString().padStart(2,'0')}</strong><small>目前直播來源</small></div></div></section>
   <section className="add-panel"><div className="add-icon"><Plus size={21}/></div><div className="add-field"><label htmlFor="stream-url">新增直播來源</label><input id="stream-url" placeholder="貼上 Twitch 或 YouTube 直播網址…" value={addInput} onChange={e=>setAddInput(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')add();}}/></div><button className="btn primary add-button" onClick={add}><Plus size={16}/> 加入頻道</button></section>
   {notice&&<div key={notice.id} className={'notice-slot '+(noticeVisible?'is-visible':'is-leaving')+(noticePaused?' is-paused':'')+(noticeResuming?' is-resuming':'')} onPointerEnter={pauseNotice} onPointerLeave={resumeNotice} onFocusCapture={pauseNotice} onBlurCapture={e=>{if(!e.currentTarget.contains(e.relatedTarget as Node|null))resumeNotice();}} role={notice.kind==='error'?'alert':'status'} aria-live={notice.kind==='error'?'assertive':'polite'}><div className={'alert '+notice.kind}>{notice.kind==='success'?<Check size={16}/>:notice.kind==='error'?<AlertCircle size={16}/>:notice.kind==='warning'?<AlertTriangle size={16}/>:<Info size={16}/>}<span>{notice.message}</span><button aria-label="關閉提示" onClick={dismissNotice}><X size={14}/></button></div><div key={noticeRevision} className="notice-progress" aria-hidden="true"/></div>}
   {temporary&&<div className="temporary-banner"><Pin size={16}/> 目前為暫時分享觀看模式，新增或移除不會改動你的個人清單。<button onClick={backPersonal}>返回我的清單</button></div>}
   <div className="section-title"><div><span className="section-kicker">01 / LIVE VIEW</span><h2>觀看控制台</h2></div><div className="toolbar"><button className="ghost" onClick={()=>setFocusMode(v=>!v)}><Focus size={16}/>{focusMode?"離開專注模式":"專注模式"}</button><button className="ghost" onClick={()=>setLiveMonitors(v=>!v)}>{liveMonitors?'關閉多台同步播放':'啟用多台同步播放'}</button><button className="ghost" onClick={()=>setMuted(v=>!v)} title="全部靜音／啟用單一音源"><span>{muted?<VolumeX size={16}/>:<Volume2 size={16}/>}</span>{muted?'全部靜音':'單一音源'}</button><label className="audio-select"><Headphones size={15}/><select aria-label="選擇音訊來源" value={audioKey??main?.key??''} onChange={e=>{setAudioKey(e.target.value);setMuted(false);if(e.target.value!==main?.key){setLiveMonitors(true);setMonitorCap(c=>c===0?2:c);setShowAll(true);}}}><option value="" disabled>選擇聲音</option>{active.streams.map(s=><option key={s.key} value={s.key}>{s.label}</option>)}</select></label><label className="layout-select"><LayoutGrid size={15}/><select aria-label="觀看布局" value={viewLayout} onChange={e=>{const next=e.target.value as 'focus'|'esports';apply({...active,viewMode:next});if(next==='esports'){setLiveMonitors(true);setShowAll(true);}}}><option value="focus">一大多小</option><option value="esports">電競賽事</option></select></label><button className="ghost" onClick={()=>setShowChat(v=>!v)}>{showChat?<PanelRightClose size={16}/>:<PanelRightOpen size={16}/>} {showChat?'隱藏聊天室':'顯示聊天室'}</button></div></div>
   {viewLayout==='esports'&&<section className="esports-area" aria-label="電競賽事觀看區">
     <div className="esports-heading"><div><Trophy size={20}/><strong>電競賽事 · 多人成隊</strong></div><div className="esports-tools"><label className="esports-width-label">主控台寬度 <input type="range" min="480" max="1000" step="20" value={esportsCenterWidth} onChange={e=>setEsportsCenterWidth(Number(e.target.value))} aria-label="調整官方主控台寬度"/><span>{esportsCenterWidth}px</span></label><label className="esports-audio-shortcut"><Headphones size={15}/>音訊 <select aria-label="電競音訊快捷選擇" value={muted?'mute':audible??'mute'} onChange={e=>{if(e.target.value==='mute'){setMuted(true);}else{setAudioKey(e.target.value);setMuted(false);}}}><option value="mute">全部靜音</option>{active.streams.filter(s=>assignedKeys.has(s.key)).map(s=><option key={s.key} value={s.key}>{s.label}</option>)}</select></label><button className="ghost" onClick={swapTeams}><ArrowLeftRight size={16}/> 交換左右隊伍</button></div></div>
     <div className="esports-scroll"><div className="esports-stages esports-multi" style={{"--esports-center":`${esportsCenterWidth}px`} as React.CSSProperties}>
       {(['teamA','official','teamB'] as const).map(slot=>{
        if(slot==='official'){
         const official=active.streams.find(s=>s.key===roles.official);
         const spotlight=active.streams.find(s=>s.key===spotlightKey);
         const stream=spotlight??official;
         return <article className="esports-stage esports-official" key={slot}>
          <div className="esports-stage-head"><strong>{spotlight?'⭐ 臨時置頂：'+spotlight.label:'🏆 官方主控台'}</strong>{spotlight&&<button title="還原官方轉播" onClick={()=>setSpotlightKey(null)}><RestoreIcon size={15}/> 還原</button>}{stream&&<button title="放大官方轉播" onClick={()=>setZoomKey(stream.key)}><Maximize2 size={15}/></button>}</div>
          <select aria-label="指定官方轉播台" value={official?.key??''} onChange={e=>{setSpotlightKey(null);e.target.value?assignEsports(e.target.value,'official'):official&&assignEsports(official.key,'reserve');}}><option value="">選擇官方直播</option>{active.streams.map(s=><option key={s.key} value={s.key}>{s.label}</option>)}</select>
          <div className="esports-video">{stream?<iframe title={'官方：'+stream.label} src={streamSrc(stream,muted||audible!==stream.key)} allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowFullScreen referrerPolicy="strict-origin-when-cross-origin"/>:<div className="esports-placeholder"><MonitorPlay size={26}/>請指定官方轉播頻道</div>}</div>
          <div className="esports-stage-foot"><span>{stream?.label??'尚未指定'}</span>{stream&&<button title="聆聽官方直播" onClick={()=>{setAudioKey(stream.key);setMuted(false);}}><Headphones size={15}/></button>}</div>
         </article>;
        }
        const keys=roles[slot];const left=slot==='teamA';
        return <article className={'esports-stage esports-team '+(left?'esports-left':'esports-right')+(activeDrop===slot?' esports-drop-active':'')} key={slot} onDragOver={e=>{if(esportsDrag.current){e.preventDefault();setActiveDrop(slot);}}} onDragLeave={e=>{if(!e.currentTarget.contains(e.relatedTarget as Node))setActiveDrop(null);}} onDrop={e=>onEsportsDrop(e,slot)}>
         <div className="esports-stage-head"><input aria-label={left?'隊伍 A 名稱':'隊伍 B 名稱'} maxLength={32} value={left?roles.teamAName:roles.teamBName} onChange={e=>apply({...active,esports:{...roles,[left?'teamAName':'teamBName']:e.target.value}})}/><small>{keys.length} 台</small></div>
         <select aria-label={'新增到'+(left?roles.teamAName:roles.teamBName)} value="" onChange={e=>e.target.value&&assignEsports(e.target.value,slot)}><option value="">＋ 新增隊伍直播</option>{active.streams.filter(s=>!assignedKeys.has(s.key)).map(s=><option key={s.key} value={s.key}>{s.label}</option>)}</select>
         <div className="esports-team-list">{keys.length===0?<div className="esports-placeholder team-empty">尚未加入隊伍頻道</div>:keys.map((key,i)=>{
          const stream=active.streams.find(s=>s.key===key);if(!stream)return null;
          return <div className="esports-team-player" key={key} draggable onDragStart={e=>startEsportsDrag(e,key)} onDragEnd={endEsportsDrag} onDragOver={e=>{e.preventDefault();e.stopPropagation();setActiveDrop(slot);}} onDrop={e=>{e.stopPropagation();onEsportsDrop(e,slot,key);}}><div className="esports-team-meta"><strong title="拖曳至其他隊伍或候補區"><GripVertical size={13}/> {stream.label}</strong><div><button title="臨時置頂中央" aria-label={`置頂 ${stream.label}`} onClick={()=>setSpotlightKey(k=>k===key?null:key)}><Star size={13}/></button><button title="往前移動" disabled={i===0} onClick={()=>reorderTeam(slot,key,-1)}><ArrowUp size={13}/></button><button title="往後移動" disabled={i===keys.length-1} onClick={()=>reorderTeam(slot,key,1)}><ArrowDown size={13}/></button><button title="放大" onClick={()=>setZoomKey(key)}><Maximize2 size={13}/></button><button title="聆聽" onClick={()=>{setAudioKey(key);setMuted(false);}}><Headphones size={13}/></button><button title="移回候補" onClick={()=>assignEsports(key,'reserve')}><X size={13}/></button></div></div><div className="esports-video">{mountedTeamKeys.has(key)&&spotlightKey!==key?<iframe title={stream.label+' 隊伍直播'} src={streamSrc(stream,muted||audible!==key)} allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowFullScreen referrerPolicy="strict-origin-when-cross-origin"/>:<button className="team-load-placeholder" onClick={()=>{setAudioKey(key);setMuted(false);setMonitorCap(v=>v===0?2:v);}}><Play size={17}/>未啟用播放器（效能上限）</button>}</div></div>;
         })}</div>
        </article>;
       })}
     </div></div>
     <p className="esports-hint">中央固定官方轉播；左右隊伍可加入多位選手。為符合 Twitch 最低播放器尺寸，空間不足時可水平捲動。左右播放器依設定中的數量上限載入。</p>
     <div className={"esports-reserves"+(activeDrop==='reserve'?' esports-drop-active':'')} onDragOver={e=>{if(esportsDrag.current){e.preventDefault();setActiveDrop('reserve');}}} onDragLeave={e=>{if(!e.currentTarget.contains(e.relatedTarget as Node))setActiveDrop(null);}} onDrop={e=>onEsportsDrop(e,'reserve')}><div className="reserve-heading"><strong>其他直播／候補區（{others.length}）</strong><div className="reserve-toggle"><button className={reserveStyle==='compact'?'selected':''} onClick={()=>setReserveStyle('compact')}>精簡列表</button><button className={reserveStyle==='preview'?'selected':''} onClick={()=>setReserveStyle('preview')}>迷你預覽</button></div></div>
       {others.length===0?<div className="reserve-empty">目前沒有未分配頻道</div>:<div className={'reserve-list '+(reserveStyle==='preview'?'reserve-previews':'reserve-compact')}>{others.map(s=><div className="reserve-item" key={s.key} draggable onDragStart={e=>startEsportsDrag(e,s.key)} onDragEnd={endEsportsDrag}>{reserveStyle==='preview'&&<button className="reserve-image" onClick={()=>setZoomKey(s.key)} title={'放大 '+s.label}><Play size={19}/></button>}<div className="reserve-label"><span className={'mini-platform '+s.platform}>{s.platform==='twitch'?'T':'▶'}</span><strong>{s.label}</strong></div><select aria-label={'分配 '+s.label} value="" onChange={e=>e.target.value&&assignEsports(s.key,e.target.value as 'official'|'teamA'|'teamB')}><option value="">分配到…</option><option value="official">官方轉播</option><option value="teamA">{roles.teamAName}</option><option value="teamB">{roles.teamBName}</option></select></div>)}</div>}
     </div>
   </section>}
   <section ref={viewRef} style={{'--monitor-width':`${panelWidth}px`} as React.CSSProperties} className={'view-grid '+(dragging?' resizing ':'')+(showChat?'':'without-chat')+(liveMonitors?' with-live-monitors':'')+' layout-'+viewLayout}>
    <div className="main-column"><div className="player-shell"><div className="player-head"><div><span className="playing-dot"/> <span>主直播</span> {main&&<span className={'platform '+main.platform}>{main.platform==='twitch'?'TWITCH':'YOUTUBE'}</span>}</div><div className="head-actions">{main&&<a title="開啟平台原始連結" href={main.platform==='twitch'?`https://www.twitch.tv/${main.id}`:`https://www.youtube.com/watch?v=${main.id}`} target="_blank" rel="noreferrer"><ExternalLink size={15}/></a>}</div></div><div className="video-area">{main&&viewLayout!=='esports'?<iframe key={main.key+':'+(muted||audible!==main.key)} src={streamSrc(main,muted||audible!==main.key)} title={`${main.label} 直播播放器`} allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowFullScreen referrerPolicy="strict-origin-when-cross-origin"/>:<div className="empty-player"><div className="empty-graphic"><MonitorPlay size={55} strokeWidth={1.2}/></div><h3>準備好開始觀看了嗎？</h3><p>貼上第一個 Twitch 或 YouTube 直播連結<br/>建立你的專屬多直播控制台。</p></div>}</div><div className="player-foot"><div><strong>{main?main.label:'尚未選擇直播'}</strong><small>{main?'直播內容由原平台提供':'等待新增直播來源'}</small></div>{main&&<div className="foot-buttons"><button title="放大主直播" className="icon-button" onClick={()=>setZoomKey(main.key)}><Maximize2 size={16}/></button><button className="icon-button" onClick={()=>remove(main.key)} title="移除此頻道"><Trash2 size={16}/></button></div>}</div></div>
    {showChat&&<div className="chat-box"><div className="chat-header"><div><MessageSquare size={17}/><strong>直播聊天室</strong></div><div className="chat-picker" ref={chatPickerRef}>{chat?.platform==='youtube'&&<button className="chat-theme-toggle" title={`切換 YouTube 聊天室為${youtubeChatTheme==='dark'?'淺色':'深色'}主題（可能受 YouTube 限制）`} aria-label="切換 YouTube 聊天室深淺色" onClick={()=>setYoutubeChatTheme(t=>t==='dark'?'light':'dark')}>{youtubeChatTheme==='dark'?<Moon size={14}/>:<Sun size={14}/>}<span>{youtubeChatTheme==='dark'?'深色':'淺色'}</span></button>}<button ref={chatTriggerRef} aria-expanded={chatSelectionOpen} aria-haspopup="true" aria-controls="chat-channel-menu" onClick={()=>setChatSelectionOpen(v=>!v)} disabled={!chat}>{chat?chat.label:'尚無頻道'} <ChevronDown size={15}/></button>{chatSelectionOpen&&<div className="chat-menu" id="chat-channel-menu">{active.streams.map(s=><button key={s.key} onClick={()=>{apply({...active,chat:s.key});setChatSelectionOpen(false);}}>{s.platform==='twitch'?'🟣':'🔴'} {s.label}</button>)}</div>}</div></div><div className="chat-content">{chat?<iframe key={chat.key+(chat.platform==='youtube'?youtubeChatTheme:'')} title={`${chat.label} 聊天室`} src={chatSrc(chat,youtubeChatTheme)} referrerPolicy="strict-origin-when-cross-origin"/>:<div className="chat-empty"><MessageSquare size={28}/><p>加入直播後即可切換聊天室</p></div>}</div><div className="chat-footer">聊天室由 Twitch / YouTube 官方提供；YouTube 主題切換為非官方相容性設定，效果依平台而定</div></div>}</div>
    <div className="resize-handle" role="separator" aria-label="拖曳調整主畫面與監看區寬度" aria-orientation="vertical" tabIndex={0} onPointerDown={e=>{if(e.button!==0)return;e.preventDefault();setDragging(true);}} onKeyDown={e=>{if(e.key==='ArrowLeft'){e.preventDefault();setPanelWidth(v=>Math.min(1200,v+30));}if(e.key==='ArrowRight'){e.preventDefault();setPanelWidth(v=>Math.max(400,v-30));}}} title="拖曳調整寬度；方向鍵也可以調整"><GripVertical size={18}/></div>
    <aside className="monitor-column"><div className="monitor-head"><div><h3>其他直播</h3><span>LIVE MONITOR GRID</span></div><span className="monitor-count">{others.length} 台</span></div>{others.length===0?<div className="monitor-empty"><Play size={26}/><p>其他頻道將出現在這裡</p><small>點擊任一頻道可切換至主畫面</small></div>:<div className="monitor-list">{displayed.map((s,i)=><div className="monitor-card" key={s.key} draggable onDragStart={e=>{dragSource.current=s.key;e.dataTransfer.effectAllowed='move';e.dataTransfer.setData('text/plain',s.key);}} onDragOver={e=>{e.preventDefault();e.dataTransfer.dropEffect='move';}} onDrop={e=>{e.preventDefault();const from=dragSource.current;if(from)reorder(from,s.key);dragSource.current=null;}} onDragEnd={()=>{dragSource.current=null;}}>{viewLayout!=='esports'&&liveMonitors&&monitoredKeys.has(s.key)?<div className="monitor-live"><iframe title={`${s.label} 監看直播`} src={streamSrc(s,muted||audible!==s.key)} allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowFullScreen referrerPolicy="strict-origin-when-cross-origin"/></div>:<button className={'monitor-preview '+s.platform} onClick={()=>apply({...active,main:s.key})} title={`將 ${s.label} 設為主畫面`}><span className="preview-number">{String(i+2).padStart(2,'0')}</span><div className="preview-play"><Play size={23} fill="currentColor"/></div><span className="preview-caption">點擊切換主畫面</span></button>}<div className="monitor-meta"><div><span className={'mini-platform '+s.platform}>{s.platform==='twitch'?'T':'▶'}</span><strong title={s.label}>{s.label}</strong></div><div className="monitor-actions"><button title="臨時放大直播" aria-label={`放大 ${s.label}`} onClick={()=>setZoomKey(s.key)}><Maximize2 size={14}/></button><button title="聆聽這台" aria-label={`切換音訊至 ${s.label}`} onClick={()=>{setAudioKey(s.key);setMuted(false);if(!liveMonitors||monitorCap===0){setLiveMonitors(true);setMonitorCap(c=>c===0?2:c);}}}><Headphones size={14}/></button><button title="往前移動" aria-label={`將 ${s.label} 往前移動`} disabled={active.streams.findIndex(x=>x.key===s.key)===0} onClick={()=>shiftStream(s.key,-1)}><ArrowUp size={14}/></button><button title="往後移動" aria-label={`將 ${s.label} 往後移動`} disabled={active.streams.findIndex(x=>x.key===s.key)===active.streams.length-1} onClick={()=>shiftStream(s.key,1)}><ArrowDown size={14}/></button><button title="切換到主畫面" onClick={()=>apply({...active,main:s.key})}><MonitorPlay size={14}/></button><button title="檢視聊天室" onClick={()=>{apply({...active,chat:s.key});setShowChat(true);}}><MessageSquare size={14}/></button><button title="移除頻道" onClick={()=>remove(s.key)}><X size={14}/></button></div></div></div>)}{others.length>limit-1&&<button className="show-more" onClick={()=>setShowAll(v=>!v)}>{showAll?<ChevronUp size={16}/>:<ChevronDown size={16}/>} {showAll?'收起其他頻道':`顯示其餘 ${others.length-displayed.length} 台`}</button>}</div>}<div className="monitor-note"><AlertCircle size={15}/><p>可拖曳卡片排序（亦可使用上下箭頭）。啟用同步播放時，僅前幾張監看卡片載入影片，其餘保留可切換的預覽卡片；Twitch 需至少 400 × 300 尺寸。大量同時播放可能耗用大量網路與硬體資源。</p></div></aside>
   </section>
   <footer>MultiStream Hub <span>·</span> V1.4.3 <span>·</span> Made for the moments worth watching.</footer>
  </main>

  {collectionOpen&&<div className="overlay" onMouseDown={e=>{if(e.target===e.currentTarget){setCollectionOpen(false);setDeleteCollectionId(null);}}}><div className="modal collection-modal"><div className="modal-head"><div><p className="eyebrow">SAVED COLLECTIONS</p><h2>我的直播組合</h2></div><button className="icon-button" onClick={()=>{setCollectionOpen(false);setDeleteCollectionId(null);}} aria-label="關閉組合管理"><X size={19}/></button></div>
  <p className="modal-description">將目前的觀看清單存成具名組合。切換後可以繼續調整；想保留變更，再按「更新此組合」。組合僅儲存在這台裝置的瀏覽器。</p>
  <div className="collection-create"><input aria-label="新組合名稱" maxLength={40} placeholder="例如：電競賽事、常看實況主…" value={collectionName} onChange={e=>setCollectionName(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')createCollection();}}/><button className="btn primary" onClick={createCollection}><FolderPlus size={16}/> 儲存新組合</button></div>
  <div className="backup-actions"><button className="ghost" onClick={exportBackup}><Download size={15}/> 匯出 JSON 備份</button><button className="ghost" onClick={()=>setBackupOpen(true)}><Upload size={15}/> 匯入 JSON 備份</button></div><div className="collection-count">已儲存 {collections.length} / 30 組 · 目前觀看 {active.streams.length} 台</div>
  {collections.length===0?<div className="collection-empty"><FolderOpen size={26}/><p>目前還沒有儲存組合</p><small>在上方輸入名稱，即可把目前的觀看配置保存起來。</small></div>:<div className="collection-list">{collections.map(item=><div className="collection-card" key={item.id}><div className="collection-info"><strong>{item.name}</strong>{selectedCollectionId===item.id&&<span className="collection-active">最近載入／儲存</span>}<small>{item.layout.streams.length} 台頻道 · 更新於 {new Date(item.updatedAt).toLocaleDateString('zh-TW')}</small></div><div className="collection-actions"><button onClick={()=>activateCollection(item)} title="載入此組合"><FolderOpen size={14}/> 載入</button><button onClick={()=>updateCollection(item)} title="將目前畫面覆寫到此組合"><Save size={14}/> 更新此組合</button><button onClick={()=>renameCollection(item)} title="重新命名"><Pencil size={14}/></button><button className={deleteCollectionId===item.id?'collection-delete-confirm':''} onClick={()=>deleteCollection(item)} title="刪除組合"><Trash2 size={14}/>{deleteCollectionId===item.id?' 確認刪除':''}</button>{deleteCollectionId===item.id&&<button onClick={()=>setDeleteCollectionId(null)}>取消</button>}</div></div>)}</div>}
  <div className="info-note">分享方式：先按「載入」組合，再點右上角「分享組合」。分享網址只包含該次觀看配置，不包含你其他已儲存的組合。</div></div></div>}
  {backupOpen&&<div className="overlay" onMouseDown={e=>{if(e.target===e.currentTarget){setBackupOpen(false);setBackupPending(null);}}}><div className="modal"><div className="modal-head"><h2>匯入 JSON 備份</h2><button className="icon-button" onClick={()=>{setBackupOpen(false);setBackupPending(null);}} aria-label="關閉"><X size={18}/></button></div><p className="modal-description">只接受本站匯出的 JSON 備份，大小上限 1MB。合併僅匯入未重複名稱的組合；取代會覆寫個人觀看清單及所有已存組合。</p><input type="file" accept=".json,application/json" onChange={e=>{void readBackup(e.target.files?.[0]);e.target.value='';}}/><div className="backup-choices"><label><input type="radio" checked={backupMode==='merge'} onChange={()=>setBackupMode('merge')}/> 合併組合（保留目前個人清單）</label><label><input type="radio" checked={backupMode==='replace'} onChange={()=>setBackupMode('replace')}/> 取代個人清單及所有組合</label></div>{backupPending&&<div className="info-note">已讀取 {backupPending.collections.length} 組收藏及 {backupPending.personal.streams.length} 台個人頻道。{backupMode==='replace'?'此動作將覆蓋既有資料，建議先匯出備份。':'同名組合將保留本機版本。'}</div>}<button className="btn primary wide" disabled={!backupPending} onClick={restoreBackup}>確認匯入{backupMode==='replace'?'並取代':'並合併'}</button></div></div>}
  {zoomed&&<div className="zoom-overlay" role="dialog" aria-modal="true" aria-label={`${zoomed.label} 放大觀看`}><div className="zoom-frame"><div className="zoom-toolbar"><strong>{zoomed.label}</strong><button className="ghost" onClick={()=>setZoomKey(null)}><Minimize2 size={16}/> 關閉放大（Esc）</button></div><iframe title={`${zoomed.label} 放大直播`} src={streamSrc(zoomed,true)} allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowFullScreen referrerPolicy="strict-origin-when-cross-origin"/><small>放大畫面預設靜音；請在原播放器切換音訊。此模式會另行載入播放器。</small></div></div>}
  {shareOpen&&<div className="overlay" onMouseDown={e=>{if(e.target===e.currentTarget)setShareOpen(false);}}><div className="modal"><div className="modal-head"><div><p className="eyebrow">SHARE YOUR VIEW</p><h2>分享觀看組合</h2></div><button className="icon-button" onClick={()=>setShareOpen(false)}><X size={19}/></button></div><p className="modal-description">包含 {active.streams.length} 台頻道、主畫面與聊天室選擇。朋友可直接開啟，不需登入。</p><label className="field-label">專屬網址</label><textarea readOnly rows={3} value={shareUrl} onFocus={e=>e.currentTarget.select()}/><button className="btn primary wide" onClick={copyShare}><Copy size={17}/> 複製分享網址</button><div className="info-note">此網址包含觀看組合資訊，任何取得連結的人都可以查看。分享網址可能較長；目前沒有短網址服務。</div></div></div>}
  {(incoming||importError)&&<div className="overlay"><div className="modal"><div className="modal-head"><div><p className="eyebrow">SHARED COLLECTION</p><h2>{importError?'分享連結有問題':'收到一份直播組合'}</h2></div></div>{importError?<><p className="modal-description">{importError}</p><button className="btn primary wide" onClick={()=>{setImportError('');clearHash();}}>返回我的控制台</button></>:<><p className="modal-description">包含 <b>{incoming!.streams.length}</b> 台直播。請選擇如何開啟（預設建議暫時開啟）。</p><div className="import-options"><button className="import-option recommended" onClick={()=>importChoice('temporary')}><span><strong>暫時開啟 <em>推薦</em></strong><small>立即觀看，不修改你儲存的清單</small></span><ArrowUpRight size={20}/></button><button className="import-option" onClick={()=>importChoice('merge')}><span><strong>加入我的清單</strong><small>新增未存在的頻道，保留個人布局</small></span><Plus size={20}/></button><button className="import-option danger-option" onClick={()=>setReplaceConfirm(true)}><span><strong>取代目前清單</strong><small>覆蓋本機原本的頻道與布局</small></span><Trash2 size={18}/></button></div><button className="ghost dismiss" onClick={()=>{setIncoming(null);clearHash();}}>取消，保留我的清單</button>{replaceConfirm&&<div className="confirm-box"><p>確定取代嗎？你的 {personal.streams.length} 台已儲存頻道會被這份 {incoming!.streams.length} 台的組合覆蓋。此操作無法自動復原。</p><div><button className="ghost" onClick={()=>setReplaceConfirm(false)}>返回</button><button className="btn danger" onClick={()=>importChoice('replace')}>確認取代</button></div></div>}</>}</div></div>}
  {settings&&<div className="overlay" onMouseDown={e=>{if(e.target===e.currentTarget)setSettings(false);}}><div className="modal"><div className="modal-head"><div><p className="eyebrow">PREFERENCES</p><h2>顯示設定</h2></div><button className="icon-button" onClick={()=>setSettings(false)}><X size={18}/></button></div><label className="field-label" htmlFor="limit">監看區預設顯示數量</label><select id="limit" value={limit} onChange={e=>{setLimit(Number(e.target.value));setShowAll(false);}}><option value={5}>5 台（主畫面 + 4 張卡片）</option><option value={9}>9 台（主畫面 + 8 張卡片）</option><option value={17}>17 台（主畫面 + 16 張卡片）</option></select><label className="field-label" htmlFor="monitor-cap">同步播放的監看播放器上限</label><select id="monitor-cap" value={monitorCap} onChange={e=>setMonitorCap(Number(e.target.value))}><option value={0}>0 台（僅主直播）</option><option value={2}>2 台監看</option><option value={4}>4 台監看（推薦）</option><option value={8}>8 台監看</option><option value={16}>16 台監看（高負載）</option></select><div className="info-note">這項設定控制實際建立的監看 iframe 數量，不會刪除清單中的任何頻道。Twitch 仍有最小播放器尺寸限制。</div><label className="field-label" htmlFor="youtube-chat-theme">YouTube 聊天室主題</label><select id="youtube-chat-theme" value={youtubeChatTheme} onChange={e=>setYoutubeChatTheme(e.target.value as 'dark'|'light')}><option value="dark">深色（預設）</option><option value="light">淺色</option></select><div className="info-note">YouTube 的聊天室是跨網域 iframe，無法由本站 CSS 直接改色；主題選項會嘗試透過嵌入參數切換，並不保證 YouTube 一定套用。</div><div className="version-info"><Info size={16}/><span>目前版本 <strong>V1.4.3</strong> · <a href="https://github.com/joy510163/myMultistream" target="_blank" rel="noreferrer">GitHub 專案</a> · <a href="https://github.com/joy510163/myMultistream/blob/main/CHANGELOG.md" target="_blank" rel="noreferrer">更新紀錄</a></span></div><div className="info-note">開啟「多台同步播放」後，監看卡片會變成真正的影片播放器；監看區可拖曳調整寬度。聊天室嵌入可能受平台設定與瀏覽器限制。</div><button className="btn primary wide" onClick={()=>setSettings(false)}>完成</button></div></div>}
 </div>;
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
