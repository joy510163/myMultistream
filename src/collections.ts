import {type Layout,validateLayout} from './core';
export type SavedCollection = {id:string;name:string;layout:Layout;createdAt:string;updatedAt:string};
const KEY='msh:collections:v1';
export function normalizeCollectionName(input:string){const value=input.trim();return value.length<=40?value:'';}
export function loadCollections():SavedCollection[]{
 try{
  const input:unknown=JSON.parse(localStorage.getItem(KEY)||'[]');
  if(!Array.isArray(input))return [];
  return input.slice(0,30).flatMap((x:unknown)=>{
   if(!x||typeof x!=='object')return [];
   const c=x as Record<string,unknown>;
   if(typeof c.id!=='string'||!c.id||typeof c.name!=='string'||!normalizeCollectionName(c.name)||typeof c.createdAt!=='string'||typeof c.updatedAt!=='string')return [];
   try{return [{id:c.id,name:c.name,layout:validateLayout(c.layout),createdAt:c.createdAt,updatedAt:c.updatedAt}];}catch{return [];}
  });
 }catch{return [];}
}
export function saveCollections(collections:SavedCollection[]){
 if(collections.length>30)throw Error('Too many collections');
 localStorage.setItem(KEY,JSON.stringify(collections));
}
