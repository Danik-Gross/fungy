let branches = [];
let numBranches = 40;
let branchLength = 150;

let palettes = [];
let currentPalette = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(RADIANS);
  noFill();

  palettes = [
    [[0, 255, 255], [255, 0, 255]],    // циан → пурпур
    [[255, 200, 0], [255, 50, 50]],    // золотой → красный
    [[100, 255, 100], [0, 150, 255]]   // зелёный → синий
  ];

  for (let i = 0; i < numBranches; i++) {
    let angle = TWO_PI * i / numBranches;
    branches.push({ angle: angle, offset: random(1000) });
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function getGradientColor(t, offset) {
  const [c1, c2] = palettes[currentPalette];
  const phase = (sin(frameCount * 0.01 + (offset || 0)) + 1) / 2;
  const col1 = color(c1[0], c1[1], c1[2]);
  const col2 = color(c2[0], c2[1], c2[2]);
  return lerpColor(col1, col2, 0.25 * t + 0.75 * phase);
}

function draw() {
  background(0);

  let targetX = mouseX >= 0 ? mouseX : width / 2;
  let targetY = mouseY >= 0 ? mouseY : height / 2;
  if (touches && touches.length > 0) {
    targetX = touches[0].x;
    targetY = touches[0].y;
  }
  translate(targetX, targetY);

  const globalPhase = frameCount * 0.01;
  const breath = 1 + 0.2 * sin(globalPhase);

  for (let b of branches) {
    const baseAngle = b.angle;
    const wiggle = sin(globalPhase + b.offset) * PI / 20;
    const finalAngle = baseAngle + wiggle;

    // общий фазовый параметр для щупальца
    const tentaclePhase = globalPhase + b.offset;

    const x1 = cos(finalAngle + sin(tentaclePhase) * 0.3) * branchLength * 0.3 * breath;
    const y1 = sin(finalAngle + sin(tentaclePhase) * 0.3) * branchLength * 0.3 * breath;

    const x2 = cos(finalAngle + sin(tentaclePhase) * 0.5) * branchLength * 0.6 * breath;
    const y2 = sin(finalAngle + sin(tentaclePhase) * 0.5) * branchLength * 0.6 * breath;

    const x3 = cos(finalAngle) * branchLength * breath;
    const y3 = sin(finalAngle) * branchLength * breath;

    stroke(getGradientColor(0.0, b.offset));
    strokeWeight(1.5);
    beginShape();
    vertex(0, 0);
    bezierVertex(x1, y1, x2, y2, x3, y3);
    endShape();

    // отростки первого порядка — синхронизированы
    const subCount = int(random(2, 4));
    for (let i = 0; i < subCount; i++) {
      const subAngle = finalAngle + random(-0.8, 0.8);
      const subLen = branchLength * random(0.3, 0.7);

      const sx1 = x3 + cos(subAngle + sin(tentaclePhase) * 0.3) * subLen * 0.3 * breath;
      const sy1 = y3 + sin(subAngle + sin(tentaclePhase) * 0.3) * subLen * 0.3 * breath;

      const sx2 = x3 + cos(subAngle + sin(tentaclePhase) * 0.5) * subLen * 0.6 * breath;
      const sy2 = y3 + sin(subAngle + sin(tentaclePhase) * 0.5) * subLen * 0.6 * breath;

      const sx3 = x3 + cos(subAngle) * subLen * breath;
      const sy3 = y3 + sin(subAngle) * subLen * breath;

      stroke(getGradientColor(1.0, b.offset));
      strokeWeight(1.5);
      beginShape();
      vertex(x3, y3);
      bezierVertex(sx1, sy1, sx2, sy2, sx3, sy3);
      endShape();

      // дочерние отростки второго порядка — тоже синхронизированы, но с затуханием
      const childCount = int(random(1, 3));
      for (let j = 0; j < childCount; j++) {
        const childAngle = subAngle + random(-0.5, 0.5);
        const childLen = subLen * random(0.45, 0.65);
        const decay = 1 - j * 0.4;

        const cx1 = sx3 + cos(childAngle + sin(tentaclePhase) * 0.3 * decay) * childLen * 0.3 * breath;
        const cy1 = sy3 + sin(childAngle + sin(tentaclePhase) * 0.3 * decay) * childLen * 0.3 * breath;

        const cx2 = sx3 + cos(childAngle + sin(tentaclePhase) * 0.5 * decay) * childLen * 0.6 * breath;
        const cy2 = sy3 + sin(childAngle + sin(tentaclePhase) * 0.5 * decay) * childLen * 0.6 * breath;

        const cx3 = sx3 + cos(childAngle) * childLen * breath;
        const cy3 = sy3 + sin(childAngle) * childLen * breath;

        stroke(getGradientColor(0.5, b.offset));
        strokeWeight(1.5);
        beginShape();
        vertex(sx3, sy3);
        bezierVertex(cx1, cy1, cx2, cy2, cx3, cy3);
        endShape();
      }
    }
  }
}

function mousePressed() {
  currentPalette = (currentPalette + 1) % palettes.length;
}
function touchStarted() {
  currentPalette = (currentPalette + 1) % palettes.length;
  return false;
}
