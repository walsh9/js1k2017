S = 250
T = STAGE = 0
W = a.width
H = a.height
M = Math
R = M.random
_='length'

cls=_=>a.width=W

$=ch=> {
  c.font = `${S}px serif`
  c.textBaseline = "top"  
  c.fillText(ch, 0, 0);
  im = c.getImageData(0, 0, S, S);
  cls()
  gs = []
  for (i = im.data[_]; i-=4;) {
    [rc, gc, bc] = im.data.slice(i, i+3);
    lum = .21 * rc/255 + .72 * gc/255 + .07 * bc/255
    li = ~~((116 * M.pow(lum, 1/3) - 16)/99 * 255)
    gs[i/4] = li
  }
  gs.forEach((px, i) => {
    opx = px;
    npx = px > 128 ? 255 : 0
    qe = opx - npx
    gs[i] = npx
    ex = i % S
    ey = ~~(i / S);
    [[ 1,0,.44],
     [-1,1,.19],
     [ 0,1,.31],
     [ 1,1,.06]].forEach(di => {
      idx = ex + di[0] + (ey + di[1]) * S
      if(idx < gs[_]) 
        gs[idx] += (qe * di[2])+.5|0 
    });
  });
  pt = [];
  for(i = gs[_]; i--;) { 
    if(!gs[i] && im.data[i*4+3] > 128)
      pt.push([i % S, ~~(i/S)])
  }
  pad(pt)
  return pt
}

ct = (p1, p2) => {
  diff = p1[_] - p2[_]
  pad(diff > 0 ? p2 : p1, M.abs(diff));
  return p1.map((_,i) => [p1[i][0], p1[i][1], p2[i][0], p2[i][1]]);
}

pad=(ptx, n)=>{
  for (;n--;) {
    ptx.push(ptx[~~(R() * ptx[_])]);
  }
  ptx.map((v,i)=>ptx[ptx[i]=ptx[j=0|i+R()*(ptx[_]-i)],j]=v)
};

D=99;
ani = (b,e) => b+(e-b)*T/D

draw = (ps, x=20, y=20) => {
  cls()
  c.fillStyle = '#f0f';
  ps.forEach((p) => {
    c.fillRect(~~(ani(p[0], p[2]) + x)*2, ~~(ani(p[1], p[3]) + y)*2, 2, 2);
  });
  if (T >= D)
    T = -99,STAGE++
}

e = [..."👾🔮"].map($)
t = []
len = e[_]
for(x=len-1;x--;)
  t.push(ct(e[x+1], e[x]))
t.push(ct(e[0], e[len-1]))

setInterval(_=>{
  T++
  if (STAGE < len && T > 0)
      draw(t[STAGE]);
  else if (STAGE >= len)
    STAGE=0,T=-99
}, 32);