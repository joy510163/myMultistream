export type Stream = { key:string; platform:'twitch'|'youtube'; id:string; label:string };
export type EsportsRoles = { official:string|null; left:string|null; right:string|null; teamA?:string[]; teamB?:string[]; teamAName?:string; teamBName?:string };
export type Layout = { version:1; streams:Stream[]; main:string|null; chat:string|null; viewMode?:'focus'|'esports'; esports?:EsportsRoles };
export const EMPTY: Layout = {version:1,streams:[],main:null,chat:null};
const twitchName = /^[a-zA-Z0-9_]{3,25}$/;
const youtubeId = /^[a-zA-Z0-9_-]{11}$/;
export function parseStream(input:string): Stream {
  const value=input.trim(); let url: URL;
  try { url=new URL(value.startsWith('http')?value:`https://${value}`); } catch { throw Error('請貼上完整有效的 Twitch 或 YouTube 連結'); }
  const host=url.hostname.toLowerCase().replace(/^www\./,'').replace(/^m\./,'');
  if(host==='twitch.tv'){
    const parts=url.pathname.split('/').filter(Boolean);
    const name=parts[0];
    if(parts.length!==1 || !name || !twitchName.test(name) || ['videos','directory','settings','downloads','subscriptions','p'].includes(name.toLowerCase())) throw Error('目前只支援 Twitch 頻道首頁連結');
    return {key:`twitch:${name.toLowerCase()}`,platform:'twitch',id:name.toLowerCase(),label:name};
  }
  if(host==='youtube.com' || host==='youtube-nocookie.com' || host==='youtu.be'){
    let id='';
    if(host==='youtu.be') id=url.pathname.split('/')[1]||'';
    else if(url.pathname==='/watch') id=url.searchParams.get('v')||'';
    else if(url.pathname.startsWith('/live/') || url.pathname.startsWith('/shorts/') || url.pathname.startsWith('/embed/')) id=url.pathname.split('/')[2]||'';
    if(!youtubeId.test(id)) throw Error('請使用 YouTube 直播影片網址（需有影片 ID），暫不支援頻道首頁');
    return {key:`youtube:${id}`,platform:'youtube',id,label:`YouTube · ${id}`};
  }
  throw Error('目前只支援 Twitch 或 YouTube 的網址');
}
function isStream(v:unknown):v is Stream{
  if(!v||typeof v!=='object') return false;
  const x=v as Record<string,unknown>;
  return (x.platform==='twitch' && typeof x.id==='string' && twitchName.test(x.id) && x.key===`twitch:${x.id}` || x.platform==='youtube' && typeof x.id==='string' && youtubeId.test(x.id) && x.key===`youtube:${x.id}`) && typeof x.label==='string' && x.label.length<=90;
}
export function validateLayout(v:unknown):Layout {
  if(!v||typeof v!=='object') throw Error('分享資料無效');
  const obj=v as Record<string,unknown>;
  if(obj.version!==1 || !Array.isArray(obj.streams)) throw Error('無法辨識此分享版本');
  if(obj.streams.length>64 || !obj.streams.every(isStream)) throw Error('分享資料包含無效的直播頻道或超出 64 台上限');
  const streams=obj.streams as Stream[];
  if(new Set(streams.map(s=>s.key)).size!==streams.length) throw Error('分享資料有重複頻道');
  const keys=new Set(streams.map(s=>s.key));
  const main=typeof obj.main==='string'&&keys.has(obj.main)?obj.main:streams[0]?.key??null;
  const chat=typeof obj.chat==='string'&&keys.has(obj.chat)?obj.chat:main;
  const rawRoles=obj.esports && typeof obj.esports==='object'?obj.esports as Record<string,unknown>:{};
  const role=(name:string)=>typeof rawRoles[name]==='string' && keys.has(rawRoles[name] as string)?rawRoles[name] as string:null;
  // Old V1.4.1 single-player roles are upgraded on read without changing the URL version.
  const validTeam=(field:string,fallback:string|null)=>{
    const value=rawRoles[field];
    if(!Array.isArray(value))return fallback?[fallback]:[];
    if(value.length>64||value.some(key=>typeof key!=='string'||!keys.has(key)))throw Error('賽事隊伍包含無效頻道');
    return [...new Set(value as string[])];
  };
  const official=role('official');
  const teamA=validTeam('teamA',role('left'));
  const teamB=validTeam('teamB',role('right'));
  if(new Set([official,...teamA,...teamB].filter(Boolean)).size!==Number(Boolean(official))+teamA.length+teamB.length)throw Error('同一頻道不能重複分配賽事角色');
  const cleanName=(name:unknown,fallback:string)=>typeof name==='string'&&name.trim().length>0&&name.trim().length<=32?name.trim():fallback;
  const roles:EsportsRoles={official,left:teamA[0]??null,right:teamB[0]??null,teamA,teamB,teamAName:cleanName(rawRoles.teamAName,'隊伍 A'),teamBName:cleanName(rawRoles.teamBName,'隊伍 B')};
  return {version:1,streams,main,chat,viewMode:obj.viewMode==='esports'?'esports':'focus',esports:roles};
}
export function encodeLayout(layout:Layout):string {
  const bytes=new TextEncoder().encode(JSON.stringify(layout));
  let binary=''; for(const b of bytes)binary+=String.fromCharCode(b);
  return btoa(binary).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
}
export function decodeLayout(hash:string):Layout|null {
  if(!hash.startsWith('#s='))return null;
  const encoded=hash.slice(3);
  if(encoded.length>16000|| !/^[\w-]+$/.test(encoded))throw Error('分享網址格式不正確或太長');
  try { const b=atob(encoded.replace(/-/g,'+').replace(/_/g,'/')); const bytes=Uint8Array.from(b,c=>c.charCodeAt(0)); return validateLayout(JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(bytes))); }
  catch { throw Error('分享連結無法解析，可能已損壞或版本不相容'); }
}
export function loadSaved():Layout {try{return validateLayout(JSON.parse(localStorage.getItem('msh:layout:v1')||'null'));}catch{return EMPTY;}}
export function save(layout:Layout){localStorage.setItem('msh:layout:v1',JSON.stringify(layout));}
export function mergeLayout(base:Layout,incoming:Layout):Layout{
 const known=new Set(base.streams.map(x=>x.key));
 return {...base,streams:[...base.streams,...incoming.streams.filter(x=>!known.has(x.key))]};
}
export function streamSrc(s:Stream,muted:boolean):string {
 if(s.platform==='twitch'){
  const u=new URL('https://player.twitch.tv/');u.searchParams.set('channel',s.id);u.searchParams.set('parent',window.location.hostname);u.searchParams.set('autoplay','true');u.searchParams.set('muted',String(muted));return u.href;
 }
 const u=new URL(`https://www.youtube.com/embed/${s.id}`);u.searchParams.set('autoplay','1');u.searchParams.set('mute',muted?'1':'0');u.searchParams.set('playsinline','1');return u.href;
}
export function chatSrc(s:Stream, youtubeTheme:'dark'|'light'='dark'):string {
 if(s.platform==='twitch')return `https://www.twitch.tv/embed/${s.id}/chat?parent=${encodeURIComponent(window.location.hostname)}&darkpopout`;
 return `https://www.youtube.com/live_chat?v=${encodeURIComponent(s.id)}&embed_domain=${encodeURIComponent(window.location.hostname)}&dark_theme=${youtubeTheme==='dark'?'1':'0'}`;
}
