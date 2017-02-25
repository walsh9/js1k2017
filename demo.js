// init
x=y=T=150
// shortcuts
W=a.width
H=a.height
M=Math
R=M.random
L='length'
// integer scaling to screen width/height
X=M.max(1,M.min(W,H)/T)|0
V=(X-1)*W/2

// get mouse movement, also mousedown to catch touch taps
onmousemove=onmousedown=e=>{x=e.pageX;y=e.pageY}

// set canvas properties for text (emoji) drawing
c.font='120px x'
c.textBaseline='top' 
c.textAlign='center'

// dither a character to b/w and convert it to a list of particle coordinates
A=a=>{
  // draw a character to the canvas and read it as imagedata
  c.clearRect(0,0,W,H)
  c.fillText(a,W/2,20)
  s=c.getImageData(0,0,W,200).data

  // convert imagedata to monochrome
  m=[]
  for(i=s[L];i-=4;)m[i/4]=M.max(0,M.min(255,(s[i]*.3+s[i+1]*.6+s[i+2]*.1)))|0
  
  // floyd-steinberg dithering to black/white only
  m.map((p,i)=>{
    if(p&&p^255)m[i]=p>128?255:0,
    [[1,.44],
     [W-1,.2],
     [W,.3],
     [W+1,.06]].map(z=>{
      m[i+z[0]]+=((p-m[i])*z[1])|0,m[i]
    })
  })

  // convert black pixels in dithered image to a list of points
  pt=[]
  for(i=m[L];i--;)if(!m[i]&&s[i*4+3]>128)pt.push([i%W,i/W|0])

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
  return a.map((_,i)=>[...a[i],...b[i]])
}

// pad an array a, with random values from itself, until it has length b
// also shuffles, use without parameter b to just shuffle
C=(a,b)=>{
  // padding
  for(;b--;)a.push(a[R()*a[L]|0])
  // fisher-yates shuffle i copied from somewhere
  a.map((v,i)=>a[a[i]=a[j=i+R()*(a[L]-i)|0],j]=v)
}

// simple linear tween: return value between a and b at time tick T of 50
D=(a,b)=>(a+(b-a)*T/50)|0

// get a list of emoji
e=[]
E=(a,b)=>{for(;b--;)e.push(String.fromCodePoint(a+b))}
// flowers, food, drink
E(127799,70)
// animals
E(128e3,61)
// faces
E(128512,56)
// spooky stuff
E(128121,8)

C(e)

setInterval(_=>{
  // increase time ticks
  T++

  // set up a new animation at tf, reset timer to -40
  if(T>50)e.push(e.shift()),n=B(A(e[0]),A(e[1])),T=-50

  // background color
  c.fillStyle='hsl('+x/W*255+',90%,80%)'

  // draw background
  c.fillRect(0,0,W,H)

  // wobble
  w=a=>T<-30?0:(R()+.5|0)*(30+T)/10*X|0

  // pixel color
  c.fillStyle='hsl('+y/H*255+',90%,20%)'
  n.map(p=>
    // draw the points between the two emoji states, 
    // location is tweened based on time ticks (T)
    T>0?c.fillRect(D(p[0],p[2])*X-V-R()*X+.5|0,D(p[1],p[3])*X-R()*X+.5|0,X,X):
    // pause on pre-animation state for a bit, 
    // but add some random wobble
    c.fillRect((p[0]*X-w())-V,(p[1]*X-w()),X,X)
  )
}, 67)