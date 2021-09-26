function randomBetween (a, b) {
  return Math.round(a + Math.random() * (b - a))
}

function getDistance (x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
}

function rotateVector (v, angle) {
  return {
    vx: v.vx * Math.cos(angle) - v.vy * Math.sin(angle),
    vy: v.vy * Math.cos(angle) + v.vx * Math.sin(angle)
  }
}

function resolveCollision (p1, p2) {
  const angle = -Math.atan2(p1.y - p2.y, p1.x - p2.x);
  // 旋转速度
  const v1Rotated = rotateVector(p1, angle)
  const v2Rotated = rotateVector(p2, angle)
  // 完全碰撞公式求碰撞后的速度
  const v1RotatedAfterCollision = {
    vx: (v1Rotated.vx * (p1.mass - p2.mass) + 2 * p2.mass * v2Rotated.vx) / (p1.mass + p2.mass),
    vy: v1Rotated.vy
  }
  const v2RotatedAfterCollision = {
    vx: (v2Rotated.vx * (p2.mass - p1.mass) + 2 * p1.mass * v1Rotated.vx) / (p1.mass + p2.mass),
    vy: v2Rotated.vy
  }
  // 再旋转回来
  const v1AfterCollision = rotateVector(v1RotatedAfterCollision, -angle);
  const v2AfterCollision = rotateVector(v2RotatedAfterCollision, -angle);

  p1.vx = v1AfterCollision.vx;
  p1.vy = v1AfterCollision.vy;
  p2.vx = v2AfterCollision.vx;
  p2.vy = v2AfterCollision.vy;
}

function Ball ({ x, y, vx, vy, radius, color, mouse }) {
  this.x = x;
  this.y = y;
  this.vx = vx;
  this.vy = vy;
  this.radius = radius;
  this.offset = radius * Math.sqrt(2) / 2
  this.mass = radius * radius;
  this.color = color;
  const ballEle = document.createElement('div');
  ballEle.style.width = `${this.radius * 2}px`
  ballEle.style.height = `${this.radius * 2}px`
  ballEle.style.backgroundColor = this.color;
  ballEle.classList.add('ball');
  this.ele = ballEle;
  document.body.appendChild(ballEle);
}

Ball.prototype.draw = function () {
  const left = this.x - this.offset;
  const top = this.y - this.offset;
  this.ele.style.transform = `translate(${left}px, ${top}px)`;
}
Ball.prototype.update = function () {
  const width = window.innerWidth;
  const height = window.innerHeight;
  for (let b of balls) {
    if (this !== b && getDistance(this.x, this.y, b.x, b.y) <= this.radius + b.radius) {
      const xVDiff = b.vx - this.vx;
      const yVDiff = b.vy - this.vy;
      const xDiff = b.x - this.x;
      const yDiff = b.y - this.y;
      if (xVDiff * xDiff + yVDiff * yDiff < 0) {
        resolveCollision(this, b);
      }
    }
  }
  if (
    (this.x + this.radius >= width && this.vx > 0) ||
    (this.x - this.radius <= 0 && this.vx < 0)
  ) {
    this.vx = -this.vx;
  }
  if (
    (this.y + this.radius >= height && this.vy > 0) ||
    (this.y - this.radius <= 0 && this.vy < 0)
  ) {
    this.vy = -this.vy;
  }
  this.x += this.vx;
  this.y += this.vy;

  this.draw();
}