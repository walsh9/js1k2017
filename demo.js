// init
mx=my=T=S=200;

// shortcuts
W=a.width
H=a.height
M=Math
R=M.random
L='length'

// integer scaling to screen width/height
X=0|M.max(1,M.min(W,H)/S)
V=(X-1)*W/2

// clear canvas
cls=_=>c.clearRect(0,0,W,H)

// get mouse movement, also mousedown to catch touch taps
onmousemove=onmousedown=e=>{mx=e.pageX;my=e.pageY} 

// set canvas properties for text (emoji) drawing
c.font='150px x'
c.textAlign='center'

// dither a character to b/w and convert it to a list of particle coordinates
A=a=> {
  // draw a character to the canvas and read it as imagedata
  cls()
  c.fillText(a,W/2,150)
  dt=c.getImageData(0,0,W,S).data
  cls()

  // convert imagedata to grayscale
  gs=[]
  for(i=dt[L];i-=4;)gs[i/4]=0|M.max(0,M.min(255,(dt[i]*.3+dt[i+1]*.6+dt[i+2]*.1)))
  
  // floyd-steinberg dithering to black/white only
  gs.map((px,i)=>{
    gs[i]=px>128?255:0,
    qe=px-gs[i],
    [[1,.44],
     [W-1,.2],
     [W,.3],
     [W+1,.06]].map(di => {
      gs[i+di[0]]+=(qe*di[1])|0,gs[i]
    })
  })

  // convert black pixels in dithered image to a list of points
  pt=[]
  for(i=gs[L];i--;)if(!gs[i]&&dt[i*4+3]>128)pt.push([i%W,0|(i/W)])

  // and shuffle
  C(pt)
  return pt
}

// create a list of pairs of points from two lists of points
// [[x1,y1]...],[[x2,y2],...] => [[x1, y1, x2, y2],...]
B=(a,b,c=a[L]-b[L])=>{
  // pad the smallest list so they're both the same length
  C(c>0?b:a,M.abs(c))

  //zip the lists
  return a.map((_,i)=>[a[i][0],a[i][1],b[i][0],b[i][1]])
}

// pad an array a, with random values from itself, until it has length b
// also shuffles, use without parameter b to just shuffle
C=(a,b)=>{
  // padding
  for(;b--;)a.push(a[0|(R()*a[L])])
  // fisher-yates shuffle i copied from somewhere
  a.map((v,i)=>a[a[i]=a[j=0|i+R()*(a[L]-i)],j]=v)
}

// simple linear tween: return value between a and b at time tick T of 99
D=(a,b)=>(a+(b-a)*T/99)|0

// get a list of food emoji
e=[]
for(k=47;k--;)e.push(String.fromCodePoint(0x1f344+k))
C(e)

setInterval(_=>{
  // set up a new animation at tf, reset timer to -50
  if(T>99)e.push(e.shift()),tf=B(A(e[0]),A(e[1])),T=-50

  // increase time ticks
  T+=2;

  // background color
  c.fillStyle='hsl('+mx/W*255+',90%,90%)'

  // draw background
  c.fillRect(0,0,W,H)

  // pixel color
  c.fillStyle='hsl('+my/H*255+',90%,20%)'
  tf.map(p=>{
    // draw the points between the two emoji states, 
    // location is tweened based on time ticks (T)
    if(T > 0)c.fillRect(D(p[0],p[2])*X-V,D(p[1],p[3])*X,X,X)

    // pause on pre-animation state for a bit, 
    // with some random jitter
    else c.fillRect((p[0]-R()+.5|0)*X -V,(p[1]-R()+.5|0)*X,X,X)
  })
}, 67)