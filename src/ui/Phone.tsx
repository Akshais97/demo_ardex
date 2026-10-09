import type {ReactNode}from 'react';
export function Phone({kind,children}:{kind:string;children:ReactNode}){return <div className={'device '+kind}><div className="device-status"><b>9:41</b><div className="device-island"/><span>▮▮▮ ▰</span></div>{children}<div className="device-home"/></div>}
