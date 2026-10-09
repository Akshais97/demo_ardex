import {spawn}from 'node:child_process';import path from 'node:path';import {fileURLToPath}from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const processes=[spawn(process.execPath,['server/index.mjs'],{cwd:root,stdio:'inherit',windowsHide:true}),spawn(process.execPath,['node_modules/vite/bin/vite.js',...(process.argv.includes('--preview')?['preview']:[]),'--host','127.0.0.1','--port',process.argv.includes('--preview')?'4173':'5173','--strictPort'],{cwd:root,stdio:'inherit',windowsHide:true}),spawn(process.execPath,['node_modules/vite/bin/vite.js',...(process.argv.includes('--preview')?['preview']:[]),'--host','127.0.0.1','--port','5175','--strictPort'],{cwd:root,stdio:'inherit',windowsHide:true})];
let stopping=false;function stop(){if(stopping)return;stopping=true;for(const p of processes)p.kill();}
process.on('SIGINT',stop);process.on('SIGTERM',stop);for(const p of processes)p.on('exit',code=>{if(!stopping){stop();process.exitCode=code||0;}});

