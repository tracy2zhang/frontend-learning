function getUrlParam(name){
  var reg = new RegExp("(^|&)"+name+"=([^&]*)(&|$)");
  var r =  window.location.search.substr(1).match(reg);
  var strValue = "";
  if (r!=null){
   strValue= unescape(r[2]);
  }
  return strValue
}

const count = +getUrlParam('count') || 100

const canvas = document.getElementById('bouncing-balls-dom')

window.addEventListener('resize', () => {
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

const balls = []

function getRandomBallAttr () {
  const radius = randomBetween(10, 15);
  const x = randomBetween(0 + radius, window.innerWidth - radius);
  const y = randomBetween(0 + radius, window.innerHeight - radius);
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
  return new Ball({
    x,
    y,
    vx,
    vy,
    radius,
    color
  })
}

for (let i = 0; i < count; i++) {
  const ball = getBall();
  balls.push(ball);
}

let animation = null;
balls.forEach((ball, i) => {
  ball.draw();
});
function animate () {
  balls.forEach((ball, i) => {
    ball.update();
  });
  animation = requestAnimationFrame(animate);
}

animate();
