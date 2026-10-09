import images from '../../config/product-images.json';
type ProductImage={image:string;sourcePage:string;sourceImage:string;source:string;retrievedOn:string};
export function ProductPhoto({code,name}:{code:string;name:string}){
 const product=(images as Record<string,ProductImage>)[code];
 return product?<a className="catalog-product-photo" href={product.sourcePage} target="_blank" rel="noreferrer" title={'View '+name+' on ARDEX ENDURA'}><img src={product.image} alt={name} loading="lazy"/><span>ARDEX ENDURA ↗</span></a>:<div className="catalog-photo-pending"><span>Photo pending</span><small>Product confirmation required</small></div>;
}
