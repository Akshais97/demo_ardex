import fs from 'node:fs';
import path from 'node:path';

const dist=path.resolve(import.meta.dirname,'../dist');
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml','.webp':'image/webp','.ico':'image/x-icon','.woff2':'font/woff2','.pdf':'application/pdf'};

export function serveStatic(req,res,url){
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);res.end();return;}
  let file;
  try{file=path.resolve(dist,'.'+decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname));}
  catch{res.writeHead(400);res.end('Invalid path');return;}
  if(!file.startsWith(dist+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);res.end('File not found');return;}
  res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','X-Content-Type-Options':'nosniff','Cache-Control':file.startsWith(path.join(dist,'assets')+path.sep)?'public, max-age=31536000, immutable':'no-cache'});
  if(req.method==='HEAD'){res.end();return;}
  const stream=fs.createReadStream(file);
  stream.on('error',()=>res.destroy());
  stream.pipe(res);
}
