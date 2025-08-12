// --- animacja nieba ---
const canvas = document.getElementById("sky");
const ctx = canvas.getContext("2d");
let w, h;

function resize() {
  w = canvas.width = canvas.offsetWidth;
  h = canvas.height = canvas.offsetHeight;
}
window.addEventListener("resize", resize);
resize();

// Gwiazdy tła
const stars = [];
for (let i = 0; i < 200; i++) {
  stars.push({
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * 1.5 + 0.5,
    o: Math.random() * 0.5 + 0.5,
  });
}

let shootingStar = null;
function createShootingStar() {
  const minX = w * 0.1;
  const maxX = w * 0.9;
  const startX = Math.random() * (maxX - minX) + minX;
  const startY = Math.random() * h * 0.3;
  const length = 150;
  const speed = 10;
  const angle = Math.PI / 4;
  shootingStar = { x: startX, y: startY, len: length, speed, angle, life: 0 };
}

function drawStars() {
  ctx.fillStyle = "#050811";
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "white";
  for (let s of stars) {
    ctx.globalAlpha = s.o + Math.sin(Date.now() / 500 + s.x) * 0.3;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function drawShootingStar() {
  if (!shootingStar) return;
  const { x, y, len, angle } = shootingStar;
  const tailX = x - Math.cos(angle) * len;
  const tailY = y - Math.sin(angle) * len;
  const grad = ctx.createLinearGradient(x, y, tailX, tailY);
  grad.addColorStop(0, "white");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  ctx.strokeStyle = grad;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(tailX, tailY);
  ctx.stroke();
}

function updateShootingStar() {
  if (!shootingStar) return;
  shootingStar.x += Math.cos(shootingStar.angle) * shootingStar.speed;
  shootingStar.y += Math.sin(shootingStar.angle) * shootingStar.speed;
  shootingStar.life++;
  if (shootingStar.life > 80) {
    shootingStar = null;
  }
}

function loop() {
  drawStars();
  if (shootingStar) {
    drawShootingStar();
    updateShootingStar();
  }
  requestAnimationFrame(loop);
}
loop();
createShootingStar();
setInterval(createShootingStar, 3500);

// --- animacja pojawiania kafelków ---
const tiles = document.querySelectorAll(".tile");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

tiles.forEach((tile) => observer.observe(tile));

// --- animacja odwracania kart ---
document.querySelectorAll(".card").forEach((card) => {
  card.addEventListener("click", () => {
    card.classList.toggle("flipped");
  });
});
