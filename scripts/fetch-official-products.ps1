$ErrorActionPreference='Stop'
$base='https://www.ardexendura.com'
$items=@(
 @{code='WPM265';slug='liquid-applied-membranes/wpm-265'},
 @{code='WPM004';slug='liquid-applied-membranes/wpm-004'},
 @{code='WPM004F';slug='liquid-applied-membranes/wpm-004-flex'},
 @{code='WPM002';slug='liquid-applied-membranes/wpm-002'},
 @{code='WPM810';slug='liquid-applied-membranes/wpm-810'},
 @{code='WPM158';slug='liquid-applied-membranes/wpm-158'},
 @{code='WPM007R';slug='liquid-applied-membranes/wpm-007-roofkote'},
 @{code='WPT300';slug='waterproofing-accessories/wpt-300-series'}
)
New-Item -ItemType Directory -Force -Path public/products | Out-Null
$records=@{}
foreach($item in $items){
 $page=$base+'/products/waterproofing-systems/'+$item.slug+'/'
 $html=(Invoke-WebRequest -Uri $page).Content
 $tag=[regex]::Matches($html,'<img[^>]+>') | Where-Object {$_.Value -match 'id="zoomImage"'} | Select-Object -First 1
 if(-not $tag){throw "No confirmed primary product image on $page"}
 $src=[regex]::Match($tag.Value,'src="([^"]+)"').Groups[1].Value
 $image=[uri]::new([uri]$base,$src).AbsoluteUri
 if(([uri]$image).Host -ne 'www.ardexendura.com'){throw 'Image is not on official domain'}
 $extension=[IO.Path]::GetExtension(([uri]$image).AbsolutePath)
 $file=$item.code.ToLower()+$extension
 Invoke-WebRequest -Uri $image -OutFile ('public/products/'+$file)
 $records[$item.code]=@{image='/products/'+$file;sourcePage=$page;sourceImage=$image;retrievedOn='2026-10-04';source='ARDEX ENDURA official website'}
 Write-Output ($item.code+' '+$image)
}
$records | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath config/product-images.json -Encoding utf8
