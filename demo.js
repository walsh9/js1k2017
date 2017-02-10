S = 250
T = STAGE = 0
W = a.width
H = a.height
M = Math
R = M.random
cls=_=>{c.clearRect(0,0,W,H)};
shf=l=>l.map((v,i)=>l[l[i]=l[j=0|i+R()*(l.length-i)],j]=v)

$ = ch => {
  c.font = `${S}px serif`;
  c.textBaseline = "top";  
  c.fillText(ch, 0, 0);
  im = c.getImageData(0, 0, S, S);
  cls();
  gs = [];
  for (i = im.data.length; i-=4;) {
    [rc, gc, bc] = im.data.slice(i, i+3);
    lum = 0.2126 * rc/255 + 0.7152 * gc/255 + 0.0722 * bc/255;
    li = ~~((116 * M.pow(lum, 1/3) - 16)/100 * 255);
    gs[i/4] = li;
  }
  gs.forEach((px, i) => {
    opx = px;
    npx = px > 128 ? 255 : 0;
    q = opx - npx;
    gs[i] = npx;
    dx = i % S;
    dy = ~~(i / S);
    [[ 1,0,7/16],
     [-1,1,3/16],
     [ 0,1,5/16],
     [ 1,1,1/16]].forEach(dith => {
      dx += dith[0];
      dy += dith[1];
      if(dx < S && dx >= 0 && dy < S) 
        gs[dx + dy * S] += M.round(q * dith[2])
    });
  });
  pt = [];
  for(i = gs.length; i--;) { 
    if(gs[i] == 0 && im.data[i*4+3] > 99)
      pt.push([i % S, ~~(i/S)])
  }
  shf(pt)
  return pt
}

ct = (p1, p2) => {
  diff = p1.length - p2.length;
  if (diff > 0)
    pad(p2, diff);
  else
    pad(p1, M.abs(diff));
  return p1.map((_,i) => [p1[i][0], p1[i][1], p2[i][0], p2[i][1]]);
}

pad=(particles, n)=>{
  for (;n--;) {
    particles.push(particles[~~(R() * particles.length)]);
  }
};

D=99;
ani = (b,e) => b+(e-b)*T/D

draw = (ps, x=0, y=0) => {
  cls()
  c.fillStyle = '#f0f';
  ps.forEach((p) => {
    c.fillRect(~~(ani(p[0], p[2]) + x), ~~(ani(p[1], p[3]) + y), 1, 1);
  });
  if (T >= D) {
    T = 0;
    STAGE++;
  }
}

e = [..."🐇🎩🕊🐣🎩👋"].map($)
t = []
len = e.length
for(x=len-1;x--;)
  t.push(ct(e[x+1], e[x]))
t.push(ct(e[0], e[len-1]))

setInterval(_=>{
  T++
  if (STAGE < len)
    draw(t[STAGE], 20, 20);
  else
    STAGE=T=0
}, 32);