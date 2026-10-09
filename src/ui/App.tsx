import {useEffect,useRef,useState}from 'react';
import {isSession,newSession,openSessionStore}from '../adapters/session.mjs';
import {Workflow}from './Workflow';
import type {DemoUser}from './Auth';
type Session={schemaVersion:number;id:string;view:'workspace';role:'applicator'|'homeowner'|'admin'};
export function App({user,logout}:{user:DemoUser;logout:()=>void}){
 const [session,setSession]=useState<Session>(newSession(crypto.randomUUID()) as Session),[ready,setReady]=useState(false);
 const store=useRef<Awaited<ReturnType<typeof openSessionStore>>|null>(null);
 useEffect(()=>{let active=true;(async()=>{try{const db=await openSessionStore();if(!active){db.close();return;}store.current=db;const saved=await db.read();if(!active)return;if(isSession(saved))setSession({...saved,view:'workspace'} as Session);const shared=new URLSearchParams(location.search).get('session');if(shared&&/^[a-zA-Z0-9-]{1,80}$/.test(shared))setSession(s=>({...s,id:shared}));}catch{}if(active)setReady(true)})();return()=>{active=false;store.current?.close()}},[]);
 useEffect(()=>{if(ready&&store.current)store.current.write(session).catch(()=>{})},[session,ready]);
 return <div className="pitch-site"><header className="pitch-header"><a className="pitch-brand" href="/"><img src="/brand/ardex-endura.png" alt="ARDEX ENDURA"/><span>PRO</span></a><div className="pitch-header-links"><span>CHLEAR × SAKHAA</span><a href={'http://127.0.0.1:5175/admin.html?session='+session.id} target="_blank" rel="noreferrer">Control panel ↗</a><button onClick={logout}>Switch role</button></div></header><main className="pitch-main"><div className="pitch-intro presentation-intro"><span className="eyebrow">ONE HOME. ONE CONNECTED JOURNEY.</span><h1>What happens after the enquiry?</h1><p>One homeowner. A measured scope. A traceable handover.</p></div>{ready?<Workflow id={session.id} role={session.role} user={user}/>:<p className="pitch-loading">Opening your experience…</p>}<footer className="pitch-footer"><span>ARDEX PRO · CHLEAR × SAKHAA</span><span>Interactive presentation · WhatsApp delivery simulated</span></footer></main></div>;
}
