import React from 'react';
import {createRoot} from 'react-dom/client';
import {Plus,Share2,MessageSquare,Volume2,VolumeX,MonitorPlay,Trash2,ArrowUpRight,Pin,ChevronDown,ChevronUp,Copy,X,Check,Settings,ExternalLink,PanelRightClose,PanelRightOpen,RotateCcw,Play,AlertCircle,GripVertical} from 'lucide-react';
import {type Layout,parseStream,loadSaved,save,encodeLayout,decodeLayout,mergeLayout,streamSrc,chatSrc} from './core';
import './style.css';
function App(){
 const [personal,setPersonal]=React.useState<Layout>(loadSaved);
 const [active,setActive]=React.useState<Layout>(()=>loadSaved());
 const [temporary,setTemporary]=React.useState(false);
 const [incoming,setIncoming]=React.useState<Layout|null>(null);
 const [importError,setImportError]=React.useState('');
 const [replaceConfirm,setReplaceConfirm]=React.useState(false);
 const [addInput,setAddInput]=React.useState('');
 const [error,setError]=React.useState('');
 const [notice,setNotice]=React.useState('');
 const [shareOpen,setShareOpen]=React.useState(false);
 const [showChat,setShowChat]=React.useState(true);
 const [chatSelectionOpen,setChatSelectionOpen]=React.useState(false);
 const [muted,setMuted]=React.useState(true);
 const [settings,setSettings]=React.useState(false);
 const [limit,setLimit]=React.useState(9);
 const [showAll,setShowAll]=React.useState(true);
 const [liveMonitors,setLiveMonitors]=React.useState(()=>localStorage.getItem('msh:liveMonitors:v1')==='true');
 const [panelWidth,setPanelWidth]=React.useState(()=>{const v=Number(localStorage.getItem('msh:monitorWidth:v1'));return Number.isFinite(v)&&v>=400&&v<=1200?v:440;});
 const [dragging,setDragging]=React.useState(false);
 const viewRef=React.useRef<HTMLElement|null>(null);
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
  if(mode==='temporary'){setActive(incoming);setTemporary(true);setNotice('已暫時開啟分享組合，個人清單未變更');}
  if(mode==='merge'){const result=mergeLayout(personal,incoming);setPersonal(result);setActive(result);save(result);setTemporary(false);setNotice('已合併頻道並儲存至我的清單');clearHash();}
  if(mode==='replace'){setPersonal(incoming);setActive(incoming);save(incoming);setTemporary(false);setNotice('已取代我的清單');clearHash();}
  setIncoming(null);setReplaceConfirm(false);
 }
 function backPersonal(){setTemporary(false);setActive(personal);clearHash();setNotice('已返回個人清單');}
 function add(){setError('');try{const item=parseStream(addInput);if(active.streams.some(x=>x.key===item.key))throw Error('這台直播已經在清單內囉');if(active.streams.length>=64)throw Error('目前最多儲存 64 台直播');apply({...active,streams:[...active.streams,item],main:active.main??item.key,chat:active.chat??item.key});setAddInput('');setNotice(`已加入 ${item.label}`);}catch(e){setError((e as Error).message);}}
 function remove(key:string){const streams=active.streams.filter(x=>x.key!==key);apply({...active,streams,main:active.main===key?streams[0]?.key??null:active.main,chat:active.chat===key?streams[0]?.key??null:active.chat});}
 const main=active.streams.find(s=>s.key===active.main)||active.streams[0];
 const chat=active.streams.find(s=>s.key===active.chat)||main;
 const others=active.streams.filter(s=>s.key!==main?.key);
 const displayed=showAll?others:others.slice(0,Math.max(0,limit-1));
 const shareUrl=location.origin+location.pathname+location.search+'#s='+encodeLayout(active);
 async function copyShare(){try{await navigator.clipboard.writeText(shareUrl);setNotice('分享網址已複製！');}catch{setNotice('無法自動複製，請手動選取網址');}}
 return <div className="app">
  <header className="topbar"><div className="brand"><span className="brand-mark"><MonitorPlay size={21}/></span><div><strong>MultiStream <span>Hub</span></strong><small>YOUR LIVE CONTROL ROOM</small></div></div><div className="top-actions"><span className="live-counter"><span className="pulse"/>{active.streams.length} 個頻道</span>{temporary&&<button className="ghost small" onClick={backPersonal}><RotateCcw size={15}/> 返回個人清單</button>}<button className="btn primary" onClick={()=>setShareOpen(true)}><Share2 size={16}/> <span>分享組合</span></button><button className="icon-button" title="偏好設定" onClick={()=>setSettings(true)}><Settings size={19}/></button></div></header>
  <main className="workspace">
   <section className="intro"><div><p className="eyebrow">STREAM WORKSPACE <span className="accent-line"/></p><h1>你的直播，一眼掌握。</h1><p className="sub">集中觀看 Twitch 與 YouTube，讓精彩不漏接。</p></div><div className="stats"><div><strong>{active.streams.length.toString().padStart(2,'0')}</strong><small>已加入頻道</small></div><div><strong>{displayed.length+(main?1:0)}</strong><small>監看區已列出</small></div></div></section>
   <section className="add-panel"><div className="add-icon"><Plus size={21}/></div><div className="add-field"><label htmlFor="stream-url">新增直播來源</label><input id="stream-url" placeholder="貼上 Twitch 或 YouTube 直播網址…" value={addInput} onChange={e=>setAddInput(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')add();}}/></div><button className="btn primary add-button" onClick={add}><Plus size={16}/> 加入頻道</button></section>
   {error&&<div className="alert error"><AlertCircle size={16}/>{error}<button onClick={()=>setError('')}><X size={14}/></button></div>}
   {notice&&<div className="alert success"><Check size={16}/>{notice}<button onClick={()=>setNotice('')}><X size={14}/></button></div>}
   {temporary&&<div className="temporary-banner"><Pin size={16}/> 目前為暫時分享觀看模式，新增或移除不會改動你的個人清單。<button onClick={backPersonal}>返回我的清單</button></div>}
   <div className="section-title"><div><span className="section-kicker">01 / LIVE VIEW</span><h2>觀看控制台</h2></div><div className="toolbar"><button className="ghost" onClick={()=>setLiveMonitors(v=>!v)}>{liveMonitors?'關閉多台同步播放':'啟用多台同步播放'}</button><button className="ghost" onClick={()=>setMuted(v=>!v)} title="設定重新載入播放器時的預設靜音狀態"><span>{muted?<VolumeX size={16}/>:<Volume2 size={16}/>}</span>{muted?'新播放器預設靜音':'新播放器預設有聲'}</button><button className="ghost" onClick={()=>setShowChat(v=>!v)}>{showChat?<PanelRightClose size={16}/>:<PanelRightOpen size={16}/>} {showChat?'隱藏聊天室':'顯示聊天室'}</button></div></div>
   <section ref={viewRef} style={{'--monitor-width':`${panelWidth}px`} as React.CSSProperties} className={'view-grid '+(dragging?' resizing ':'')+(showChat?'':'without-chat')+(liveMonitors?' with-live-monitors':'')}>
    <div className="main-column"><div className="player-shell"><div className="player-head"><div><span className="playing-dot"/> <span>主直播</span> {main&&<span className={'platform '+main.platform}>{main.platform==='twitch'?'TWITCH':'YOUTUBE'}</span>}</div><div className="head-actions">{main&&<a title="開啟平台原始連結" href={main.platform==='twitch'?`https://www.twitch.tv/${main.id}`:`https://www.youtube.com/watch?v=${main.id}`} target="_blank" rel="noreferrer"><ExternalLink size={15}/></a>}</div></div><div className="video-area">{main?<iframe key={main.key+':'+muted} src={streamSrc(main,muted)} title={`${main.label} 直播播放器`} allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowFullScreen referrerPolicy="strict-origin-when-cross-origin"/>:<div className="empty-player"><div className="empty-graphic"><MonitorPlay size={55} strokeWidth={1.2}/></div><h3>準備好開始觀看了嗎？</h3><p>貼上第一個 Twitch 或 YouTube 直播連結<br/>建立你的專屬多直播控制台。</p></div>}</div><div className="player-foot"><div><strong>{main?main.label:'尚未選擇直播'}</strong><small>{main?'直播內容由原平台提供':'等待新增直播來源'}</small></div>{main&&<div className="foot-buttons"><button className="icon-button" onClick={()=>remove(main.key)} title="移除此頻道"><Trash2 size={16}/></button></div>}</div></div>
    {showChat&&<div className="chat-box"><div className="chat-header"><div><MessageSquare size={17}/><strong>直播聊天室</strong></div><div className="chat-picker"><button onClick={()=>setChatSelectionOpen(v=>!v)} disabled={!chat}>{chat?chat.label:'尚無頻道'} <ChevronDown size={15}/></button>{chatSelectionOpen&&<div className="chat-menu">{active.streams.map(s=><button key={s.key} onClick={()=>{apply({...active,chat:s.key});setChatSelectionOpen(false);}}>{s.platform==='twitch'?'🟣':'🔴'} {s.label}</button>)}</div>}</div></div><div className="chat-content">{chat?<iframe key={chat.key} title={`${chat.label} 聊天室`} src={chatSrc(chat)} referrerPolicy="strict-origin-when-cross-origin"/>:<div className="chat-empty"><MessageSquare size={28}/><p>加入直播後即可切換聊天室</p></div>}</div><div className="chat-footer">聊天室由 Twitch / YouTube 官方提供；部分影片可能不開放嵌入聊天室</div></div>}</div>
    <div className="resize-handle" role="separator" aria-label="拖曳調整主畫面與監看區寬度" aria-orientation="vertical" tabIndex={0} onPointerDown={e=>{if(e.button!==0)return;e.preventDefault();setDragging(true);}} onKeyDown={e=>{if(e.key==='ArrowLeft'){e.preventDefault();setPanelWidth(v=>Math.min(1200,v+30));}if(e.key==='ArrowRight'){e.preventDefault();setPanelWidth(v=>Math.max(400,v-30));}}} title="拖曳調整寬度；方向鍵也可以調整"><GripVertical size={18}/></div>
    <aside className="monitor-column"><div className="monitor-head"><div><h3>其他直播</h3><span>LIVE MONITOR GRID</span></div><span className="monitor-count">{others.length} 台</span></div>{others.length===0?<div className="monitor-empty"><Play size={26}/><p>其他頻道將出現在這裡</p><small>點擊任一頻道可切換至主畫面</small></div>:<div className="monitor-list">{displayed.map((s,i)=><div className="monitor-card" key={s.key}>{liveMonitors?<div className="monitor-live"><iframe title={`${s.label} 監看直播`} src={streamSrc(s,true)} allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowFullScreen referrerPolicy="strict-origin-when-cross-origin"/></div>:<button className={'monitor-preview '+s.platform} onClick={()=>apply({...active,main:s.key})} title={`將 ${s.label} 設為主畫面`}><span className="preview-number">{String(i+2).padStart(2,'0')}</span><div className="preview-play"><Play size={23} fill="currentColor"/></div><span className="preview-caption">點擊切換主畫面</span></button>}<div className="monitor-meta"><div><span className={'mini-platform '+s.platform}>{s.platform==='twitch'?'T':'▶'}</span><strong title={s.label}>{s.label}</strong></div><div className="monitor-actions"><button title="切換到主畫面" onClick={()=>apply({...active,main:s.key})}><MonitorPlay size={14}/></button><button title="檢視聊天室" onClick={()=>{apply({...active,chat:s.key});setShowChat(true);}}><MessageSquare size={14}/></button><button title="移除頻道" onClick={()=>remove(s.key)}><X size={14}/></button></div></div></div>)}{others.length>limit-1&&<button className="show-more" onClick={()=>setShowAll(v=>!v)}>{showAll?<ChevronUp size={16}/>:<ChevronDown size={16}/>} {showAll?'收起其他頻道':`顯示其餘 ${others.length-displayed.length} 台`}</button>}</div>}<div className="monitor-note"><AlertCircle size={15}/><p>可啟用多台同步播放，啟用後監看區使用真正的嵌入播放器，預設靜音；Twitch 需至少 400 × 300 尺寸。大量同時播放可能耗用大量網路與硬體資源。</p></div></aside>
   </section>
   <footer>MultiStream Hub <span>·</span> V1.1 <span>·</span> Made for the moments worth watching.</footer>
  </main>
  {shareOpen&&<div className="overlay" onMouseDown={e=>{if(e.target===e.currentTarget)setShareOpen(false);}}><div className="modal"><div className="modal-head"><div><p className="eyebrow">SHARE YOUR VIEW</p><h2>分享觀看組合</h2></div><button className="icon-button" onClick={()=>setShareOpen(false)}><X size={19}/></button></div><p className="modal-description">包含 {active.streams.length} 台頻道、主畫面與聊天室選擇。朋友可直接開啟，不需登入。</p><label className="field-label">專屬網址</label><textarea readOnly rows={3} value={shareUrl} onFocus={e=>e.currentTarget.select()}/><button className="btn primary wide" onClick={copyShare}><Copy size={17}/> 複製分享網址</button><div className="info-note">此網址包含觀看組合資訊，任何取得連結的人都可以查看。分享網址可能較長；目前沒有短網址服務。</div></div></div>}
  {(incoming||importError)&&<div className="overlay"><div className="modal"><div className="modal-head"><div><p className="eyebrow">SHARED COLLECTION</p><h2>{importError?'分享連結有問題':'收到一份直播組合'}</h2></div></div>{importError?<><p className="modal-description">{importError}</p><button className="btn primary wide" onClick={()=>{setImportError('');clearHash();}}>返回我的控制台</button></>:<><p className="modal-description">包含 <b>{incoming!.streams.length}</b> 台直播。請選擇如何開啟（預設建議暫時開啟）。</p><div className="import-options"><button className="import-option recommended" onClick={()=>importChoice('temporary')}><span><strong>暫時開啟 <em>推薦</em></strong><small>立即觀看，不修改你儲存的清單</small></span><ArrowUpRight size={20}/></button><button className="import-option" onClick={()=>importChoice('merge')}><span><strong>加入我的清單</strong><small>新增未存在的頻道，保留個人布局</small></span><Plus size={20}/></button><button className="import-option danger-option" onClick={()=>setReplaceConfirm(true)}><span><strong>取代目前清單</strong><small>覆蓋本機原本的頻道與布局</small></span><Trash2 size={18}/></button></div><button className="ghost dismiss" onClick={()=>{setIncoming(null);clearHash();}}>取消，保留我的清單</button>{replaceConfirm&&<div className="confirm-box"><p>確定取代嗎？你的 {personal.streams.length} 台已儲存頻道會被這份 {incoming!.streams.length} 台的組合覆蓋。此操作無法自動復原。</p><div><button className="ghost" onClick={()=>setReplaceConfirm(false)}>返回</button><button className="btn danger" onClick={()=>importChoice('replace')}>確認取代</button></div></div>}</>}</div></div>}
  {settings&&<div className="overlay" onMouseDown={e=>{if(e.target===e.currentTarget)setSettings(false);}}><div className="modal"><div className="modal-head"><div><p className="eyebrow">PREFERENCES</p><h2>顯示設定</h2></div><button className="icon-button" onClick={()=>setSettings(false)}><X size={18}/></button></div><label className="field-label" htmlFor="limit">監看區預設顯示數量</label><select id="limit" value={limit} onChange={e=>{setLimit(Number(e.target.value));setShowAll(false);}}><option value={5}>5 台（主畫面 + 4 張卡片）</option><option value={9}>9 台（主畫面 + 8 張卡片）</option><option value={17}>17 台（主畫面 + 16 張卡片）</option></select><div className="info-note">開啟「多台同步播放」後，監看卡片會變成真正的影片播放器；監看區可拖曳調整寬度。聊天室嵌入可能受平台設定與瀏覽器限制。</div><button className="btn primary wide" onClick={()=>setSettings(false)}>完成</button></div></div>}
 </div>;
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
