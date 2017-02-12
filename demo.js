S=300
STAGE=0
T=I=-50
D=99
B=20
W = a.width
M = Math
R = M.random
l='length'
cls=_=>a.width=W

$=ch=> {
  c.font=200+'px x'
  c.textAlign='center'
  c.fillText(ch, W/2, 200);
  im = c.getImageData(0, 0, W, S);
  cls()
  gs = []
  for (i = im.data[l]; i-=4;) {
    [rc, gc, bc] = im.data.slice(i, i+3)
    gs[i/4] = 0|M.min(255,M.max(0,296 * M.pow(rc*84e-5 + gc*.003 + bc*275e-6, 1/3) - 42))
  }
  gs.forEach((px, i) => {
    np = px > 128 ? 255 : 0
    qe = px - np
    gs[i] = np;
    [[1,.44],
     [W-1,.19],
     [W,.31],
     [W+1,.06]].forEach(di => {
      if(i+di[0] < gs[l]) { gs[i+di[0]] += (qe * di[1])+.5|0}
    });
  });
  pt = [];
  for(i = gs[l]; i--;) { 
    if(!gs[i] && im.data[i*4+3] > 128) pt.push([i%W, 0|(i/W)])
  }
  pad(pt)
  return pt
}

ct = (p1, p2) => {
  diff = p1[l] - p2[l]
  pad(diff > 0 ? p2 : p1, M.abs(diff))
  return p1.map((_,i) => [p1[i][0], p1[i][1], p2[i][0], p2[i][1]])
}

pad=(ptx, n)=>{
  for (;n--;) {
    ptx.push(ptx[0|(R() * ptx[l])]);
  }
  ptx.map((v,i)=>ptx[ptx[i]=ptx[j=0|i+R()*(ptx[l]-i)],j]=v)
};

ani = (b,e) => (b+(e-b)*T/D)|0

e = [..."🕊🐣🎩🔮"].map($)
t = []
for(x=e[l]-1;x--;)
  t.push(ct(e[x+1], e[x]))
t.push(ct(e[0], e[e[l]-1]))

setInterval(_=>{
  T++
  if (STAGE < e[l]) {
    cls()
    document.bgColor='#eee'
    c.fillStyle = '#333'
    c.font = S+'px serif';
    t[STAGE].forEach(p=>{
      if (T > 0) c.fillRect(ani(p[0], p[2]), ani(p[1], p[3]), 1, 1)
      else c.fillRect(p[0] + R()+.5|0,p[1] + R()+.5|0, 1, 1)
    })
    if (T > D) T=I,STAGE++
  } else 
    STAGE=0,T=I
}, 32);

// document.onmousemove=e=>{mx=e.pageX;my=e.pageY}