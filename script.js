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
gsap.from("h2", {duration: 1, y: -50, opacity: 0});
gsap.from("#typing", {duration: 1, delay: 0.5, y: 50, opacity: 0});
gsap.from("nav", {duration: 1, y: -100, opacity: 0});

// Scroll animations
gsap.from("#about", {scrollTrigger: "#about", duration: 1, opacity: 0, y: 50});
gsap.from("#skills div", {scrollTrigger: "#skills", duration: 1, opacity: 0, scale: 0.5, stagger: 0.2});

// Animated Counters
function counter(id
