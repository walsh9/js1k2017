S=200
STAGE=0
T=I=-50
W = a.width
H = a.height
M = Math
R = M.random
L='length'
X=0|M.max(1,M.min(W,H)/S)
V=(X-1)*W/2
cls=_=>c.clearRect(0,0,W,H)

// convert a character to a list of dumb particle coordinates
c.font='150px x'
c.textAlign='center'
A=a=> {
  c.fillText(a,W/2,150)
  dt = c.getImageData(0,0,W,S).data
  cls()
  gs = []
  for(i=dt[L];i-=4;)gs[i/4]=0|M.max(0,M.min(255,(dt[i]*.3+dt[i+1]*.6+dt[i+2]*.1)))
  gs.forEach((px, i) => {
    if (px&&px^255) {
    gs[i] = px > 128 ? 255 : 0
    qe = px - gs[i];
    [[1,.44],
     [W-1,.2],
     [W,.3],
     [W+1,.06]].forEach(di => {
      if(i+di[0] < gs[L]) gs[i+di[0]] += (qe * di[1])|0
    })}
  })
  pt = []
  for(i = gs[L]; i--;) if(!gs[i] && dt[i*4+3] > 128) pt.push([i%W, 0|(i/W)])
  C(pt)
  return pt
}

// create a list of particle location maps from two location lists
// a.k.a. pad and zip
// [[x1,y1]...],[[x2,y2],...] => [[x1, y1, x2, y2],...]
B=(a,b,c=a[L]-b[L]) => {
  C(c>0?b:a,M.abs(c))
  return a.map((_,i) => [a[i][0], a[i][1], b[i][0], b[i][1]])
}

// pad an array a, with random values from itself, until it has length b
// so we can make the particle lists have the same number of particles
// also shuffles, use without b to just shuffle.
C=(a,b)=>{
  // padding
  for (;b--;) a.push(a[0|(R() * a[L])])
  // fisher-yates shuffle i copied from somewhere
  a.map((v,i)=>a[a[i]=a[j=0|i+R()*(a[L]-i)],j]=v)
}

// return a simple linear tween from value a to b for duration 99 at time T
D=(a,b)=>(a+(b-a)*T/99)|0

e = []
//get a list of food emoji
for(k=47;k--;)e.push(A(String.fromCodePoint(0x1f344+k)))
C(e)
t = []
for(x=e[L]-1;x--;) t.push(B(e[x+1], e[x]))
t.push(B(e[0], e[e[L]-1]))

setInterval(_=>{
  T++
  if (STAGE < e[L]) {
    cls()
    a.style.background='#def'
    c.fillStyle = '#336'
    t[STAGE].forEach(p=>{
      if (T > 0) c.fillRect(D(p[0], p[2])*X -V, D(p[1], p[3])*X, X, X)
      else c.fillRect((p[0]+R()+.5|0)*X -V,(p[1]+R()+.5|0)*X, X, X)
    })
    if (T>99) T=I,STAGE++
  } else 
    STAGE=0,T=I
}, 32)

// document.onmousemove=e=>{mx=e.pageX;my=e.pageY}