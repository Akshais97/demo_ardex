export function sitePhoto(area:string,key:string){
 const bathroom=area==='BATHROOM';
 const stage=key.toLowerCase();
 if(!bathroom&&stage==='ponding_start')return '/site-photos/terrace-before.png';
 const file=stage.includes('flood')||stage.includes('pond')?'flood':stage.includes('tape')||stage.includes('corner')||stage.includes('joint')?(bathroom?'tape':'coating'):stage.includes('coat')||stage.includes('primer')||stage.includes('mesh')||stage.includes('fabric')?(bathroom?'tape':'coating'):'before';
 return '/site-photos/'+(bathroom?'bathroom':'terrace')+'-'+file+'.png';
}
export function SitePhoto({area,stage,image}:{area:string;stage:string;image?:string}){return <figure className="site-reference"><img src={image||sitePhoto(area,stage)} alt={stage.replaceAll('_',' ')}/>{!image&&<figcaption>Generated reference</figcaption>}</figure>}
