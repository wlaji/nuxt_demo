export const outline = (
  img,
  radius=1,
  edge=defaultEdge) => {
  let c    = document.createElement('canvas');
  let ctx  = c.getContext('2d');
  c.width  = img.width;
  c.height = img.height;

  ctx.drawImage(img,0,0)
  let vertex = []

  for (let y=1; y<img.height-1; y++){
    for (let x=1; x<img.width-1; x++){
      if(vertex.some( ([a,b]) => Math.hypot(x-a,y-b)<radius ))
        continue;
      let imgData = ctx.getImageData(x-1,y-1,3,3).data;
      if(edge(...chunkify(imgData,4)))
        vertex.push([x,y])
    }
  }
  return vertex;
}


// [ a, b, c,
//   d, e, f,
//   g, h, j ]
// Each element is a 4-touple of (r,g,b,a) values
const defaultEdge = (a,b,c,d,e,f,g,h,j) =>
  luminance(...f)>=luminance(...e) && luminance(...e)>luminance(...d)
  || luminance(...j)>=luminance(...e) && luminance(...e)>luminance(...a)
  || luminance(...h)>=luminance(...e) && luminance(...e)>luminance(...b)
  || luminance(...g)>=luminance(...e) && luminance(...e)>luminance(...c)
  || luminance(...d)>=luminance(...e) && luminance(...e)>luminance(...f)
  || luminance(...a)>=luminance(...e) && luminance(...e)>luminance(...j)
  || luminance(...b)>=luminance(...e) && luminance(...e)>luminance(...h)
  || luminance(...c)>=luminance(...e) && luminance(...e)>luminance(...g)


// luminance :: Float -> Float -> Float -> Float -> Float
const luminance = (r,g,b,a) => a*(0.2126*r+0.7152*g+0.0722*b)

// chunkify :: [] -> Int -> [[]]
export const chunkify = (arr, chunknum) => new Array(Math.ceil(arr.length/chunknum))
  .fill(0)
  .map((_,i) => arr.slice(i*4, (i+1)*4))