c.font = '120px serif';
c.textBaseline = "top";
x = 200;
y = 200;
s = 122;
c.fillText("🍩", x, y);

emoji = c.getImageData(x, y, s, s);
var grayscaleImage = convertToGrayscale(emoji);
// dithered = dither(emoji);
// c.putImageData(dithered, 200, y);


function _lightness(r,g,b) {
  let luminance = 0.2126 * r/255 + 0.7152 * g/255 + 0.0722 * b/255;
  return 116 * Math.pow(luminance, 1/3) - 16;
}

function convertToGrayscale(imageData) {
  let grayscale = new Uint8ClampedArray(imageData.width * imageData.height);
  for (let i = 0; i < imageData.data.length; i +=4) {
    let [r, g, b] = imageData.data.slice(i, i+3);
    let l = Math.floor(_lightness(r,g,b)/100 * 255);
    grayscale[i/4] = l;
  }
  return grayscale;
}

ditherMethod = [
  [ 1,0,7/16],
  [-1,1,3/16],
  [ 0,1,5/16],
  [ 1,1,1/16],
];

particles = [];
t=0;
speed = s;
function update() {
  let width = s;
  let height = s;
  let data = emoji.data;
  grayscaleImage.forEach((pixel, i) => {
    if (i < t * speed || i >= (t+1) * speed) return;
    let oldPixel   = pixel;
    let newPixel   = pixel > 128 ? 255 : 0;
    let quantError = oldPixel - newPixel;
    data[i*4] = data[i*4+1] = data[i*4+2] = newPixel;
    let x = i % width;
    let y = Math.floor(i / width);
    ditherMethod.forEach(dith => {
      let dx = x + dith[0];
      let dy = y + dith[1];
      if (dx < width && dx >= 0 && dy < height) {
        grayscaleImage[dx + dy * width] += Math.round(quantError * dith[2]);
      }
    });
  });
  c.fillStyle = '#ffffff';
  c.fillRect(x, y, c.width, c.height);
  c.putImageData(emoji, x, y - t);
  t++;
  if (t * speed > grayscaleImage.length) {
    for(i = 0; i < emoji.data.length; i+=4) { 
      if (emoji.data[i] === 0 && emoji.data[i+3] > 0)
        particles.push([i/4 % s, Math.floor(i/4/s)]);
    }
    clearInterval(timer1);
    setInterval(drawParticles, 33);
  }
}

function drawParticles() {
  c.fillStyle = '#ffffff';
  c.fillRect(0, 0, c.canvas.width, c.canvas.height);
  c.fillStyle = '#000000';
  particles.forEach((p, i) => {
    c.fillRect(p[0] + x, p[1] + y - t, 1, 1);
    particles[i] = [p[0] + Math.round((0.5 - Math.random()) * 3), p[1] + Math.round(Math.random() * 3)];
  });
}



var timer1 = setInterval(update, 33);