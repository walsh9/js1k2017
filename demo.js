
S = 200;
T = 0;
STAGE = 0;
CLEAR = () => {c.clearRect(0,0,a.width,a.height)};

drawEmoji = function(e) {
  c.font = `${S}px serif`;
  c.textBaseline = "top";
  c.fillStyle = "#0000ff";
  c.fillText(e, 0, 0);
  return c.getImageData(0, 0, S, S);
}

function grayscale(imageData) {
  let gs = new Uint8ClampedArray(imageData.width * imageData.height);
  for (let i = 0; i < imageData.data.length; i +=4) {
    let [r, g, b] = imageData.data.slice(i, i+3);
    let luminance = 0.2126 * r/255 + 0.7152 * g/255 + 0.0722 * b/255;
    let l = Math.floor((116 * Math.pow(luminance, 1/3) - 16)/100 * 255);
    gs[i/4] = l;
  }
  return gs;
}

function dither(img) {
  ditherMethod = [
    [ 1,0,7/16],
    [-1,1,3/16],
    [ 0,1,5/16],
    [ 1,1,1/16],
  ];
  buffer = new ImageData(S, S);
  data = buffer.data;
  gs = grayscale(img);
  gs.forEach((pixel, i) => {
    let oldPixel   = pixel;
    let newPixel   = pixel > 128 ? 255 : 0;
    let quantError = oldPixel - newPixel;
    data[i*4] = data[i*4+1] = data[i*4+2] = newPixel;
    data[i*4+3] = img.data[i*4+3];
    let x = i % S;
    let y = Math.floor(i / S);
    ditherMethod.forEach(dith => {
      let dx = x + dith[0];
      let dy = y + dith[1];
      if (dx < S && dx >= 0 && dy < S) {
        gs[dx + dy * S] += Math.round(quantError * dith[2]);
      }
    });
  });
  return buffer;
}

function atomize(img) {
  particles = [];
  for(i = 0; i < img.data.length; i+=4) { 
    if (img.data[i] === 0 && img.data[i+3] > 128)
      particles.push([i/4 % S, Math.floor(i/4/S)]);
  }
  return particles;
}

function transmogrify(p1, p2) {
  diff = p1.length - p2.length;
  if (diff > 0) {
    pad(p2, diff);
  } else {    
    pad(p1, Math.abs(diff));
  }
  return p1.map((_,i) => [p1[i][0], p1[i][1], p2[i][0], p2[i][1]]);
}

function pad(particles, n) {
  while (n > 0) {
    particles.push(particles[Math.floor(Math.random() * particles.length)]);
    n--;
  }
};


function drawTransition(img1, img2, x=0, y=0) {
  T++;
  T++;
  c.putImageData(img1, x, y, 0, T, S, S);
  c.putImageData(img2, x, y, 0, T - S, S, S);
  if (T >= S) {
    T = 0;
    STAGE++;
  }
}

function drawParticles(particles, x=0, y=0) {
  c.fillStyle = '#ffffff';
  c.fillRect(0, 0, c.canvas.width, c.canvas.height);
  c.fillStyle = '#000000';
  particles.forEach((p, i) => {
    c.fillRect(p[0] + x, p[1] + y, 1, 1);
    particles[i] = [p[0] + Math.round((0.5 - Math.random()) * 3), p[1] + Math.round(Math.random() * 3)];
  });
}

D=100;
function animate(b,e) {
  change = (e-b);
  delta = T/D
  ts=delta*delta;
  tc=ts*delta;
  if (Math.random() > .95)
    return b+change*(3*tc*ts + -11*ts*ts + 22*tc + -22*ts + 9*delta);
  return b+change*(delta);

  // return b+change*(56*tc*ts + -175*ts*ts + 200*tc + -100*ts + 20*delta);
}

function drawTransform(ps, x=0, y=0) {
  c.fillStyle = '#ffffff';
  c.fillRect(0, 0, c.canvas.width, c.canvas.height);
  c.fillStyle = '#000000';
  ps.forEach((p) => {
    c.fillRect(Math.floor(animate(p[0], p[2]) + x), Math.floor(animate(p[1], p[3]) + y), 1, 1);
  });
  if (T >= D) {
    T = 0;
    STAGE++;
  }
}

i1 = drawEmoji("🎩");
d1 = dither(i1);
p1 = atomize(d1)
CLEAR();
i2 = drawEmoji("🐰");
d2 = dither(i2);
p2 = atomize(d2);
CLEAR();

t = transmogrify(p1, p2);
t2 = transmogrify(p2, p1);

function update() {
  T++;
  CLEAR()
  if (STAGE == 0)
    drawTransition(i1, d1, 200, 100);
  if (STAGE == 1)
    drawTransform(t, 200, 100);
  if (STAGE == 2)
    drawTransition(d2, i2, 200, 100);
  if (STAGE == 3)
    drawTransition(i2, d2, 200, 100);
  if (STAGE == 4)
    drawTransform(t2, 200, 100);
  if (STAGE == 5)
    drawTransition(d1, i1, 200, 100);
  if (STAGE == 6) {STAGE = 0; T=0;}
}

var timer1 = setInterval(update, 32);