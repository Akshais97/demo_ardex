export const fixtures={
 terrace:{mode:'ardex',areaType:'TERRACE',customer:{name:'Ananya Rao (demo)',phone:'DEMO-0001',city:'Bengaluru',address:'Demo Terrace, Sample Layout'},location:{lat:12.9716,lng:77.5946},measurement:{method:'dimensions',unit:'FT',length:30,width:20,upturn:1,showerLength:0,showerHeight:0,drains:2,penetrations:1},answers:{surface:'BARE_CONCRETE',coating_condition:'NONE',cracks:'HAIRLINE',ponding_after_rain:true,slope_ok:true,to_be_tiled:false,exposed_steel:'NO',spalling:'NO'},expectedArea:700},
 bathroom:{mode:'my-lead',areaType:'BATHROOM',customer:{name:'Meera Shah (demo)',phone:'DEMO-0002',city:'Bengaluru',address:'Demo Bathroom, Sample Layout'},location:{lat:12.9716,lng:77.5946},measurement:{method:'dimensions',unit:'FT',length:8,width:6,upturn:1,showerLength:8,showerHeight:6,drains:1,penetrations:2},answers:{tiles_removed:'YES',membrane_visible:false,cracks:'HAIRLINE',leak_below:true,ceiling_below:'DAMP'},expectedArea:116}
};
export const expectedAnchors={terrace:{floor:600,perimeter:100,treated:700,puRequired:154,puPurchased:156,puCostPaise:4420000,puPacks:[{size:20,count:7},{size:4,count:4}],meshRequired:11.217675,primerRequired:11.55},bathroom:{floor:48,perimeter:28,treated:116,tapeMetres:10.5344,tapeRolls:2}};
export function validateCatalog(catalog){
 const errors=[];const skus=new Map(catalog.skus.map(s=>[s.code,s]));
 for(const s of catalog.skus){if(!['KG','L','SQM','ROLL'].includes(s.unit))errors.push(s.code+' unit');if(s.unit!=='ROLL'&&!(s.coverage_per_sqft_coat>0))errors.push(s.code+' coverage');for(const p of s.packs)if(!(p.size>0)||!Number.isSafeInteger(p.price_paise)||p.price_paise<=0)errors.push(s.code+' pack');}
 for(const p of catalog.packages){for(const b of p.bom)if(!skus.has(b.sku)||!['AREA','LINEAR'].includes(b.method))errors.push(p.code+' BOM');for(const s of p.stages)for(const sku of s.skus||[])if(!p.bom.some(b=>b.sku===sku))errors.push(p.code+' stage SKU');if(new Set(p.stages.map(s=>s.key)).size!==p.stages.length)errors.push(p.code+' stage keys');for(const b of Object.values(p.labour_bands))if(!(b.min_per_sqft_paise<=b.default_per_sqft_paise&&b.default_per_sqft_paise<=b.max_per_sqft_paise))errors.push(p.code+' labour');}
 return errors;
}
export function registryFixture(catalog){const packs={};for(const sku of catalog.skus)for(const pack of sku.packs)for(let i=1;i<=200;i++){const serial=`DEMO-${sku.code}-${pack.size}-${String(i).padStart(3,'0')}`;packs[serial]={serial,sku:sku.code,size:pack.size,unit:sku.unit,batch:'SYNTHETIC-26',consumedBy:null};}packs['DEMO-USED']={serial:'DEMO-USED',sku:'WPM810',size:20,unit:'KG',batch:'SYNTHETIC-26',consumedBy:'other-demo-job'};return packs;}
export const mediaManifest={version:1,mode:'sample',warning:'Synthetic stage cards, not evidence of a real completed site',diagnosis: ['wide-view','damage','drain','junction'],liveCapture:{mode:'camera',galleryAllowed:false}};


