S = 250
T = STAGE = 0
W = a.width
M = Math
R = M.random
l='length'
cls=_=>a.width=W

$=ch=> {
  c.font = S+'px x';
  c.fillText(ch, 0, S);
  im = c.getImageData(0, 10, S, S);
  cls()
  gs = []
  for (i = im.data[l]; i-=4;) {
    [rc, gc, bc] = im.data.slice(i, i+3);
    lum = rc*848e-6 + gc*.0028 + bc*275e-6;
    li = 0|((116 * M.pow(lum, 1/3) - 16)/100 * 255)
    gs[i/4] = M.min(255,M.max(0,li))
  }
  gs.forEach((px, i) => {
    opx = px;
    npx = px > 128 ? 255 : 0
    qe = opx - npx
    gs[i] = npx;
    [[1,.44],
     [S-1,.19],
     [S,.31],
     [S+1,.06]].forEach(di => {
      if(i+di[0] < gs[l]) { gs[i+di[0]] += (qe * di[1])+0.5|0}
        im.data[i*4]=im.data[i*4+1]=im.data[i*4+2]=opx
    });
  });
  pt = [];
  for(i = gs[l]; i--;) { 
    if(!gs[i] && im.data[i*4+3] > 128) pt.push([i%S, 0|(i/S)])
  }
  pad(pt)
  return pt
}

ct = (p1, p2) => {
  diff = p1[l] - p2[l]
  pad(diff > 0 ? p2 : p1, M.abs(diff));
  return p1.map((_,i) => [p1[i][0], p1[i][1], p2[i][0], p2[i][1]]);
}

pad=(ptx, n)=>{
  for (;n--;) {
    ptx.push(ptx[0|(R() * ptx[l])]);
  }
  ptx.map((v,i)=>ptx[ptx[i]=ptx[j=0|i+R()*(ptx[l]-i)],j]=v)
};

D=99;
ani = (b,e) => b+(e-b)*T/D

e = [..."🔥👾"].map($)
t = []
for(x=e[l]-1;x--;)
  t.push(ct(e[x+1], e[x]))
t.push(ct(e[0], e[e[l]-1]))

setInterval(_=>{
  T++
  if (STAGE < e[l] && T > 0) {
    cls()
    document.bgColor='#cc8'
    c.fillStyle = '#818'
  c.font = S+'px serif';
    t[STAGE].forEach((p) => {
     c.fillRect(0|(ani(p[0], p[2]) + W/2-S/2), 0|(ani(p[1], p[3]) + 20), 1, 1);
    });
    if (T >= D) T = -99,STAGE++
  } else if (STAGE >= e[l])
    STAGE=0,T=-99
}, 32);

// document.onmousemove=e=>{mx=e.pageX;my=e.pageY}