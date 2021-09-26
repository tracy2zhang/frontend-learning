const canvas = document.getElementById('bouncing-balls')

canvas.width = window.innerWidth
canvas.height = window.innerHeight

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  cancelAnimationFrame(animation);
  animate();
})

const colors = [
  '#4CBF88',
  '#F2B134',
  '#6F4A70',
  '#FF6275',
  '#00B5C4'
]

const mouse = {
  x: -100,
  y: -100
}

canvas.addEventListener('mousemove', e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
})

const ctx = canvas.getContext('2d');

const balls = []

function getRandomBallAttr () {
  const radius = randomBetween(10, 15);
  const x = randomBetween(0 + radius, canvas.width - radius);
  const y = randomBetween(0 + radius, canvas.height - radius);
  return { x, y, radius };
}

function getBall () {
  let { x, y, radius } = getRandomBallAttr();
  let overlap = balls.some(
    ball => getDistance(x, y, ball.x, ball.y) <= (radius + ball.radius)
  )
  while (overlap) {
    const { x: _x, y: _y, radius: _r } = getRandomBallAttr();
    x = _x;
    y = _y;
    radius = _r;
    overlap = balls.some(
      ball => getDistance(x, y, ball.x, ball.y) <= (radius + ball.radius)
    )
  }
  const vx = randomBetween(-2, 2) || 2;
  const vy = randomBetween(-2, 2) || 2;
  const color = colors[randomBetween(0, 4)];
  return new Ball(ctx, {
    mouse,
    x,
    y,
    vx,
    vy,
    radius,
    color
  })
}

for (let i = 0; i < 200; i++) {
  const ball = getBall();
  balls.push(ball);
}

let animation = null;
balls.forEach((ball, i) => {
  ball.draw();
});
function animate () {
  // ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'rgba(255,255,255,0.3)'
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  balls.forEach((ball, i) => {
    ball.update();
  });
  animation = requestAnimationFrame(animate);
}

// animate();
