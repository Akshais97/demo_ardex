function serviceUrl(page,port,current){
  const base=new URL(current.href);
  if(['localhost','127.0.0.1','[::1]'].includes(base.hostname)&&['5173','5175','4173'].includes(base.port))base.port=port;
  return base.origin+page;
}

export function appUrl(page='',current=globalThis.location){return serviceUrl(page,'5173',current);}
export function adminUrl(page='/admin.html',current=globalThis.location){return serviceUrl(page,'5175',current);}
