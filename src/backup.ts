import {type Layout,validateLayout} from './core';
import {type SavedCollection,normalizeCollectionName} from './collections';
export type Backup={format:'multistream-hub-backup';version:1;exportedAt:string;personal:Layout;collections:SavedCollection[]};
export function makeBackup(personal:Layout,collections:SavedCollection[]):Backup{return {format:'multistream-hub-backup',version:1,exportedAt:new Date().toISOString(),personal,collections};}
export function parseBackup(input:unknown):Backup{
 if(!input||typeof input!=='object')throw Error('備份檔格式無效');
 const x=input as Record<string,unknown>;
 if(x.format!=='multistream-hub-backup'||x.version!==1||!Array.isArray(x.collections)||x.collections.length>30)throw Error('備份版本不相容或組合數量超過 30 組');
 const personal=validateLayout(x.personal);
 const collections:SavedCollection[]=x.collections.map((v:unknown)=>{
  if(!v||typeof v!=='object')throw Error('備份含有無效的組合');
  const c=v as Record<string,unknown>;
  if(typeof c.id!=='string'||!c.id||c.id.length>120||typeof c.name!=='string'||!normalizeCollectionName(c.name)||typeof c.createdAt!=='string'||typeof c.updatedAt!=='string'||c.createdAt.length>50||c.updatedAt.length>50)throw Error('備份含有無效的組合資料');
  return {id:c.id,name:c.name,layout:validateLayout(c.layout),createdAt:c.createdAt,updatedAt:c.updatedAt};
 });
 if(new Set(collections.map(c=>c.id)).size!==collections.length || new Set(collections.map(c=>c.name.toLocaleLowerCase())).size!==collections.length)throw Error('備份包含重複的組合');
 return {format:'multistream-hub-backup',version:1,exportedAt:typeof x.exportedAt==='string'?x.exportedAt:'',personal,collections};
}
export function mergeCollections(existing:SavedCollection[],incoming:SavedCollection[]):SavedCollection[]{
 const names=new Set(existing.map(c=>c.name.toLocaleLowerCase()));
 const ids=new Set(existing.map(c=>c.id));
 const result=[...existing];
 for(const c of incoming){if(names.has(c.name.toLocaleLowerCase()))continue;if(result.length>=30)throw Error('合併後組合超過 30 組');const id=ids.has(c.id)?crypto.randomUUID():c.id;result.push({...c,id});ids.add(id);names.add(c.name.toLocaleLowerCase());}
 return result;
}
