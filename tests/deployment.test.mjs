import test from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {mkdtempSync,rmSync,existsSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {once} from 'node:events';

test('hosted API enforces origins, separates admin sessions and persists SQLite across restarts',async()=>{
  const root=path.resolve(import.meta.dirname,'..');
  const dataDir=mkdtempSync(path.join(tmpdir(),'ardex-deployment-'));
  const origin='https://demo.example';
  let child;
  async function start(){
    child=spawn(process.execPath,['server/index.mjs'],{cwd:root,env:{...process.env,NODE_ENV:'production',PORT:'0',HOST:'127.0.0.1',PUBLIC_ORIGIN:origin,DATA_DIR:dataDir},stdio:['ignore','pipe','pipe'],windowsHide:true});
    return new Promise((resolve,reject)=>{
      let output='';
      const timer=setTimeout(()=>reject(Error('Server startup timed out: '+output)),15000);
      child.stderr.on('data',chunk=>{output+=chunk;});
      child.stdout.on('data',chunk=>{output+=chunk;const match=output.match(/listening on port (\d+)/);if(match){clearTimeout(timer);resolve('http://127.0.0.1:'+match[1]);}});
      child.once('error',e=>{clearTimeout(timer);reject(e);});
      child.once('exit',code=>{clearTimeout(timer);reject(Error('Server exited '+code+': '+output));});
    });
  }
  async function stop(){if(child&&child.exitCode===null){const exited=once(child,'exit');child.kill();await exited;}}
  try{
    let base=await start();
    assert.equal((await fetch(base+'/api/health')).status,200);
    const login=(id,extra={})=>fetch(base+'/api/login',{method:'POST',headers:{'Content-Type':'application/json',Origin:origin,...extra},body:JSON.stringify({id,password:'ArdexDemo!2026'})});
    assert.equal((await login('presenter',{Origin:'https://attacker.example'})).status,403);
    assert.equal((await login('presenter',{Origin:'http://localhost:5173'})).status,403);
    const app=await login('presenter');assert.equal(app.status,200);
    assert.match(app.headers.get('set-cookie'),/; Secure/);
    const appCookie=app.headers.get('set-cookie').split(';')[0];
    const admin=await login('admin',{Referer:origin+'/admin.html'});assert.equal(admin.status,200);
    const adminCookie=admin.headers.get('set-cookie').split(';')[0];
    assert.match(adminCookie,/^ardex_admin_auth=/);
    const headers={Cookie:appCookie+'; '+adminCookie};
    assert.equal((await (await fetch(base+'/api/me',{headers})).json()).user.role,'presenter');
    assert.equal((await (await fetch(base+'/api/me',{headers:{...headers,Referer:origin+'/admin.html'}})).json()).user.role,'admin');
    assert.equal((await fetch(base+'/api/admin',{headers})).status,200);
    assert.equal((await fetch(base+'/server/database.mjs')).status,404);
    assert.equal((await fetch(base+'/%2e%2e%2fpackage.json')).status,404);
    if(existsSync(path.join(root,'dist/index.html'))){
      assert.equal((await fetch(base+'/')).status,200);
      assert.equal((await fetch(base+'/admin.html',{method:'HEAD'})).status,200);
      assert.equal((await fetch(base+'/passport.html')).status,200);
    }
    await stop();base=await start();
    assert.equal((await (await fetch(base+'/api/me',{headers})).json()).user.role,'presenter');
  }finally{await stop();rmSync(dataDir,{recursive:true,force:true});}
});
