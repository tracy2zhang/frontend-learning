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

function Ball (context, { x, y, vx, vy, radius, color, mouse }) {
  this.ctx = context;
  this.x = x;
  this.y = y;
  this.vx = vx;
  this.vy = vy;
  this.radius = radius;
  this.mass = radius * radius;
  this.color = color;
  this.mouse = mouse;
  this.maxRadius = 50;
  this.minRadius = radius;
}

Ball.prototype.draw = function () {
  const context = this.ctx;
  context.beginPath();
  context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false)
  context.fillStyle = this.color;
  context.fill();
}
Ball.prototype.update = function () {
  const width = this.ctx.canvas.width;
  const height = this.ctx.canvas.height;
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
  // 鼠标交互
  if (this.mouse) {
    // if (Math.abs(this.mouse.x - this.x) < 100 && Math.abs(this.mouse.y - this.y) < 100) {
    //   if (this.radius < this.maxRadius) {
    //     this.radius += 1;
    //   }
    // } else if (this.radius > this.minRadius) {
    //   this.radius -= 1;
    // }
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