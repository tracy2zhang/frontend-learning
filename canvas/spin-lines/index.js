function randomFloatBetween (a, b) {
  return a + Math.random() * (b - a)
}

function randomIntBetween (a, b) {
  return Math.round(randomFloatBetween(a, b))
}

const canvas = document.getElementById('spin-lines')

canvas.width = window.innerWidth
canvas.height = window.innerHeight

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  cancelAnimationFrame(animation);
  animate();
})

const colors = [
  '#97A7F8',
  '#C957CA',
  '#76E3FE'
]

const mouse = {
  x: canvas.width / 2,
  y: canvas.height / 2
}

canvas.addEventListener('mousemove', e => {
  mouse.x = Math.round(e.clientX);
  mouse.y = Math.round(e.clientY);
})

const ctx = canvas.getContext('2d');

const balls = []

function Ball ({ x, y, radius, distance, color, theta }) {
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.theta = theta;
  this.distance = distance;
  this.color = color;
  this.speed = 0.05;
  this.dragSpeed = 0.05
  this.laseMouse = {
    x, y
  }
}

Ball.prototype.draw = function (lastPosition) {
  ctx.beginPath();
  ctx.strokeStyle = this.color;
  ctx.lineCap = 'round';
  ctx.lineWidth = this.radius;
  ctx.moveTo(lastPosition.x, lastPosition.y);
  ctx.lineTo(this.x, this.y);
  ctx.stroke();
  ctx.closePath();
}
Ball.prototype.update = function () {
  let lastPosition = {
    x: this.x,
    y: this.y
  }

  // 拖拽后的跟随效果
  this.laseMouse.x += (mouse.x - this.laseMouse.x) * this.dragSpeed;
  this.laseMouse.y += (mouse.y - this.laseMouse.y) * this.dragSpeed;

  this.x = this.laseMouse.x + Math.cos(this.theta) * this.distance;
  this.y = this.laseMouse.y + Math.sin(this.theta) * this.distance;
  this.theta += this.speed;
  this.draw(lastPosition);
}

function getBall () {
  const radius = 3;
  const x = mouse.x;
  const y = mouse.y;
  const color = colors[randomIntBetween(0, colors.length)];
  const theta = randomFloatBetween(0, 2 * Math.PI);
  console.log(theta)
  const distance = randomIntBetween(70, 100);
  return new Ball({
    x,
    y,
    radius,
    distance,
    theta,
    color
  })
}

for (let i = 0; i < 100; i++) {
  const ball = getBall();
  balls.push(ball);
}

let animation = null;
let renderCount = 0;
function animate () {
  ctx.fillStyle = 'rgba(255,255,255,0.1)'
  renderCount++
  if (renderCount >= 40) {
    ctx.fillStyle = 'rgba(255,255,255,0.3)'
    renderCount = 0
  }
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  balls.forEach((ball, i) => {
    ball.update();
  });
  animation = requestAnimationFrame(animate);
}

animate();
