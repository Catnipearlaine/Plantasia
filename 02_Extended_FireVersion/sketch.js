let mic, fft;
let micOn = false;
let PALETTE = [];
let WHITE_COLOR;
let flowerPetal;
let aFlower;
let flowers = [];
let stemHeight = [];
let flowerScale = [];
let growthSpeed = [];
let accumulatedSound = [];
let img1, img2, img3;
let scaleFactor = 0.5;
let rotationAngle = -25;
let flowerCount = 10;
let showImg4 = false;
let sound2;

let timer = 0;
let spawnInterval = 60;
let maxFlowers = 50;

let firstStart = true;

function preload() {
  img1 = loadImage("./assets/images/base.png");
  img2 = loadImage("./assets/images/on.png");
  img3 = loadImage("./assets/images/disc.png");
  img4 = loadImage("./assets/images/disc2.png");
  sound2 = loadSound("./assets/music/ImogenHeap_HideAndSeek_Edited.mp3");
  urbanistFont = loadFont("./assets/font//Urbanist-Bold.ttf");
}
function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  noStroke();
  ellipseMode(CORNER);
  mic = new p5.AudioIn();

  fft = new p5.FFT();
  fft.setInput(mic);

  PALETTE = [
    color(255, 69, 58, 150), // deep fiery red with more alpha for vibrancy
    color(255, 117, 56, 130), // dynamic orange-red with softer opacity
    //color(255, 187, 60, 140), // golden orange with a bright yet softened look
    color(255, 220, 170, 120), // warm peachy-orange with added depth

    color(255, 163, 72, 140),
  ];

  WHITE_COLOR = color(255, 255, 255, 0);

  for (let i = 0, offset = 0; i < flowerCount; i++) {
    offset += random(width / flowerCount - 250, width / flowerCount + 200);
    flowers.push(new AFlower(int(random(2, 4)), offset));
    stemHeight.push(0);
    flowerScale.push(0);
    growthSpeed.push(random(0.005, 0.05));
    accumulatedSound.push(0);
  }
}

function startMic() {
  mic.start();
}

function addSomeFlowers() {
  let count = random(3, 8);
  flowerCount += count;
  for (let i = 0, offset = 0; i < count; i++) {
    offset += random(width / count - 250, width / count + 200);
    flowers.push(new AFlower(int(random(4, 6)), offset));
    stemHeight.push(0);
    flowerScale.push(0);
    growthSpeed.push(random(0.005, 0.05));
    accumulatedSound.push(0);
  }
}

setInterval(addSomeFlowers, 1500);

function removeOutOfBoundsFlowers() {
  for (let i = flowers.length - 1; i >= 0; i--) {
    let flowerY = height - stemHeight[i];
    if (flowerY < -50) {
      flowers.splice(i, 1);
      stemHeight.splice(i, 1);
      flowerScale.splice(i, 1);
      growthSpeed.splice(i, 1);
      accumulatedSound.splice(i, 1);
    }
  }
}

function draw() {
  let ctx = drawingContext;
  let gradient = ctx.createRadialGradient(
    width / 2,
    height / 2,
    0,
    width / 2,
    height / 2,
    width
  );

  gradient.addColorStop(0, "rgb(255, 240, 153)"); // Inner color (soft pastel red)
  gradient.addColorStop(0.3, "rgb(255, 128, 114)"); // Middle color (soft pastel orange)
  gradient.addColorStop(1, "rgb(255, 178, 102)"); // Outer color (soft pastel peach)

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  noFill();
  for (let i = 0; i < 3000; i++) {
    stroke(255, 255, 255, 15);
    let x = random(width);
    let y = random(height);
    point(x, y);
  }

  let micLevel = mic.getLevel();
  let spectrum = fft.analyze();

  fill(255);
  textSize(16);
  textAlign(LEFT, TOP);
  textFont(urbanistFont);
  text(`Mic Level: ${micLevel.toFixed(4)}`, 20, 20);
  text(`Frequency Spectrum: [${spectrum.slice(0, 5).join(", ")}]`, 20, 40);

  if (micOn && micLevel > 0.0035) {
    for (let i = 0; i < flowers.length; i++) {
      accumulatedSound[i] += micLevel * 1.4;

      stemHeight[i] = lerp(
        stemHeight[i],
        accumulatedSound[i] * height * growthSpeed[i],
        0.05
      );

      flowerScale[i] = (stemHeight[i] / windowHeight) * 3;
    }
  }

  for (let i = 0; i < flowers.length; i++) {
    flowers[i].draw(i);
  }
  removeOutOfBoundsFlowers();

  let imgWidth1 = 507 * scaleFactor;
  let imgHeight1 = 429 * scaleFactor;
  let imgX1 = windowWidth - imgWidth1 / 2 - 200;
  let imgY1 = windowHeight - 500 * scaleFactor;

  let imgWidth3 = 407 * scaleFactor;
  let imgHeight3 = 407 * scaleFactor;
  let imgX3 = windowWidth - imgWidth3 / 2 - 220;
  let imgY3 = windowHeight - 490 * scaleFactor;

  let imgWidth4 = 407 * scaleFactor;
  let imgHeight4 = 407 * scaleFactor;
  let imgX4 = windowWidth - imgWidth3 / 2 - 220;
  let imgY4 = windowHeight - 490 * scaleFactor;

  let imgWidth2 = 232 * scaleFactor;
  let imgHeight2 = 332 * scaleFactor;
  let imgX2 = windowWidth - 205;
  let imgY2 = windowHeight - 480 * scaleFactor;

  image(img1, imgX1, imgY1, imgWidth1, imgHeight1);
  image(img3, imgX3, imgY3, imgWidth3, imgHeight3);

  if (!showImg4) {
    push();
    translate(imgX3 + imgWidth3 / 2, imgY3 + imgHeight3 / 2);
    if (micOn) {
      rotate(frameCount * 0.5);
    }
    image(img3, -imgWidth3 / 2, -imgHeight3 / 2, imgWidth3, imgHeight3);
    pop();
  }

  if (showImg4) {
    push();
    translate(imgX4 + imgWidth4 / 2, imgY4 + imgHeight4 / 2);
    if (micOn) {
      rotate(frameCount * 0.5);
    }
    image(img4, -imgWidth4 / 2, -imgHeight4 / 2, imgWidth4, imgHeight4);
    pop();
  }

  push();
  translate(imgX2 + imgWidth2, imgY2);
  rotate(rotationAngle);
  image(img2, -imgWidth2, 0, imgWidth2, imgHeight2);
  pop();
}

function resetFlowers() {
  flowers = [];
  stemHeight = [];
  flowerScale = [];
  growthSpeed = [];
  accumulatedSound = [];
  console.log("Flowers have been reset!");
}

function toggleMic() {
  micOn = !micOn;
}

document.addEventListener("keydown", (event) => {
  if (firstStart) {
    startMic();
    firstStart = false;
  }
  if (event.key === " ") {
    toggleMic();
  }
  if (event.key === "0") {
    resetFlowers();
  }
});

function mousePressed() {
  if (firstStart) {
    startMic();
    firstStart = false;
  }

  let imgWidth2 = 232 * scaleFactor;
  //let imgHeight2 = 332 * scaleFactor;
  let imgX2 = windowWidth - 210;
  let imgY2 = windowHeight - 480 * scaleFactor;

  if (
    mouseX > imgX2 &&
    mouseX < imgX2 + imgWidth2 &&
    mouseY > imgY2 &&
    mouseY < imgY2 + 50
  ) {
    if (rotationAngle === -25) {
      rotationAngle = 0;
      if (!showImg4) {
        sound2.stop();
        window.startPlayingYouTubeVideo();
      } else if (showImg4) {
        window.stopPlayingYouTubeVideo();
        sound2.loop();
      }
    } else {
      rotationAngle = -25;
      sound2.stop();
      window.stopPlayingYouTubeVideo();
    }
    return;
  }

  let imgWidth3 = 407 * scaleFactor;
  let imgHeight3 = 407 * scaleFactor;
  let imgX3 = windowWidth - imgWidth3 / 2 - 220;
  let imgY3 = windowHeight - 490 * scaleFactor;
  if (
    mouseX > imgX3 &&
    mouseX < imgX3 + imgWidth3 - 10 &&
    mouseY > imgY3 &&
    mouseY < imgY3 + imgHeight3
  ) {
    showImg4 = !showImg4;
    if (rotationAngle === 0) {
      if (!showImg4) {
        sound2.stop();
        window.startPlayingYouTubeVideo();
      } else if (showImg4) {
        window.stopPlayingYouTubeVideo();
        sound2.loop();
      }
    }
  }
}

class AFlower {
  constructor(numPetals, x) {
    this.x = x;
    this.numPetals = numPetals;
    this.controlXOffset = random(-50, 50);
    this.controlYOffset = random(50, 150);
    this.flowerPetal = new FlowerPetal(
      60,
      20,
      80,
      int(random(0, PALETTE.length)),
      int(random(0, PALETTE.length))
    );
  }

  draw(index) {
    push();

    let lowFreq = fft.getEnergy(20, 200);
    let Pos = map(lowFreq, 20, 200, -5, 5);
    noFill();
    stroke(255, 160);
    strokeCap(PROJECT);
    strokeWeight(flowerScale[index] * 10);
    beginShape();
    vertex(this.x, height);
    quadraticVertex(
      this.x + this.controlXOffset * Pos,
      height - (stemHeight[index] / 2) * Pos,
      this.x,
      height - stemHeight[index]
    );
    endShape();
    translate(this.x, height - stemHeight[index]);
    scale(flowerScale[index]);
    let angle = 360 / this.numPetals;

    for (let i = 0; i < this.numPetals; i++) {
      push();
      rotate(i * angle);
      this.flowerPetal.draw();
      pop();
    }
    pop();
    //noLoop();
  }
}

class FlowerPetal {
  constructor(x, y, radius, colorIndex1, colorIndex2) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.colorIndex1 = colorIndex1;
    this.colorIndex2 = colorIndex2;
  }

  draw() {
    push();
    let lowFreq = fft.getEnergy(20, 200);
    let Pos2 = map(lowFreq, 20, 200, -0.6, 1.36);
    translate(this.x * Pos2, this.y);
    let ctx = drawingContext;

    // Create a radial gradient
    let gradient = ctx.createRadialGradient(-50, 0, 30, -40, 0, this.radius);
    gradient.addColorStop(0, PALETTE[this.colorIndex1]);
    gradient.addColorStop(0.8, PALETTE[this.colorIndex2]);
    //gradient.addColorStop(0, PALETTE[0]);
    //gradient.addColorStop(0.8, PALETTE[2]);
    gradient.addColorStop(1, WHITE_COLOR);

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(0, -this.radius);
    ctx.lineTo(this.radius, this.radius);
    ctx.lineTo(-this.radius, this.radius);
    ctx.closePath();
    ctx.fill();
    pop();
  }
}
