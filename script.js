// Typing Effect
const text = "Aspiring Software Developer | Web Developer | Problem Solver";
let i = 0;
function typingEffect() {
  if (i < text.length) {
    document.getElementById("typing").innerHTML += text.charAt(i);
    i++;
    setTimeout(typingEffect, 100);
  }
}
typingEffect();

// GSAP Animations
gsap.registerPlugin(ScrollTrigger);

// Hero animations
gsap.from("h2", {duration: 1.2, y: -80, opacity: 0, ease: "power4.out"});
gsap.from("#typing", {duration: 1.2, delay: 0.5, y: 50, opacity: 0, ease: "back.out(1.7)"});
gsap.from("nav", {duration: 1, y: -100, opacity: 0, ease: "expo.out"});

// Section animations
gsap.utils.toArray("section").forEach(section => {
  gsap.from(section, {
    scrollTrigger: section,
    duration: 1,
    opacity: 0,
    y: 50,
    ease: "power2.out"
  });
});

// Animated Counters
function counter(id, target) {
  let count = 0;
  const interval = setInterval(() => {
    if (count < target) {
      count++;
      document.getElementById(id).innerText = count + "+";
    } else {
      clearInterval(interval);
    }
  }, 50);
}
ScrollTrigger.create({
  trigger: "#stats",
  start: "top center",
  onEnter: () => {
    counter("projectsCount", 10);
    counter("certCount", 5);
    counter("yearsCount", 3);
    counter("githubCount", 100);
  }
});

// Popup Toast
setTimeout(() => {
  const popup = document.getElementById("popup");
  popup.classList.remove("hidden");
  gsap.from("#popup", {duration: 1, y: 50, opacity: 0, ease: "elastic.out(1, 0.5)"});
}, 2000);

// Back to Top Button
const backToTop = document.getElementById("backToTop");
window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    backToTop.classList.remove("hidden");
    gsap.to(backToTop, {duration: 0.5, opacity: 1, scale: 1});
  } else {
    backToTop.classList.add("hidden");
  }
});
backToTop.addEventListener("click", () => {
  window.scrollTo({top: 0, behavior: "smooth"});
});

// Flip Card Hover Animation
document.querySelectorAll(".flip-card").forEach(card => {
  card.addEventListener("mouseenter", () => {
    gsap.to(card.querySelector(".flip-card-inner"), {rotateY: 180, duration: 0.8, ease: "power2.inOut"});
  });
  card.addEventListener("mouseleave", () => {
    gsap.to(card.querySelector(".flip-card-inner"), {rotateY: 0, duration: 0.8, ease: "power2.inOut"});
  });
});

// Random Skills Pop-up Effect
const skills = ["React.js", "Tailwind CSS", "GSAP", "Node.js", "MongoDB", "TypeScript", "Next.js", "Firebase"];
const skillsContainer = document.getElementById("skillsCards");

skills.forEach(skill => {
  const card = document.createElement("div");
  card.className = "p-6 bg-gray-800 rounded-lg hover:scale-105 transition shadow-lg cursor-pointer";
  card.innerHTML = `<i class="fas fa-star text-yellow-400"></i> ${skill}`;
  card.addEventListener("click", () => {
    const popup = document.getElementById("popup");
    popup.innerText = `🔥 You clicked on ${skill}!`;
    popup.classList.remove("hidden");
    gsap.from("#popup", {duration: 1, y: 50, opacity: 0, ease: "bounce.out"});
  });
  skillsContainer.appendChild(card);
});

// 🌌 Starfield Background Effect
const canvas = document.createElement("canvas");
canvas.id = "starfield";
canvas.style.position = "fixed";
canvas.style.top = "0";
canvas.style.left = "0";
canvas.style.width = "100%";
canvas.style.height = "100%";
canvas.style.zIndex = "-1";
document.body.appendChild(canvas);

const ctx = canvas.getContext("2d");
let stars = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  stars = [];
  for (let i = 0; i < 150; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 2,
      speed: Math.random() * 0.5 + 0.2
    });
  }
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function animateStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  stars.forEach(star => {
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fill();
    star.y += star.speed;
    if (star.y > canvas.height) {
      star.y = 0;
      star.x = Math.random() * canvas.width;
    }
  });
  requestAnimationFrame(animateStars);
}
animateStars();

// 🌈 Neon Gradient Pulse Effect
function animateGradient(selector) {
  gsap.to(selector, {
    backgroundImage: "linear-gradient(90deg, #ff00ff, #00ffff, #ffff00)",
    duration: 3,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
  });
}

// Apply gradient pulse to headings and buttons
animateGradient("h2");
animateGradient("nav a");
animateGradient("a.px-6");
