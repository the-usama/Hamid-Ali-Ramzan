// Confetti Engine
const canvas = document.getElementById('confetti-canvas');
const ctx = canvas.getContext('2d');

let w, h;
let particles = [];
const PARTICLE_COUNT = 80; // Reduced from 150 for performance
const GRAVITY = 0.5;
const COLORS = ['#FFD700', '#00FFFF', '#FF69B4', '#FFFFFF', '#4C1D95'];

function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

class Particle {
    constructor() {
        this.x = w / 2;
        this.y = h / 2;
        this.vx = (Math.random() - 0.5) * 15; // Slightly slower
        this.vy = (Math.random() - 0.5) * 15;
        this.size = Math.random() * 6 + 3; // Slightly smaller
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.2;
        this.dampening = 0.96;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += GRAVITY * 0.1;
        this.vx *= this.dampening;
        this.vy *= this.dampening;
        this.rotation += this.rotationSpeed;
        this.size *= 0.98; // Shrink slightly faster
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        ctx.restore();
    }
}

function createBurst(x, y) {
    if (!x || !y) {
        x = w / 2;
        y = h / 2;
    }
    for (let i = 0; i < 40; i++) { // Reduced limits
        const p = new Particle();
        p.x = x;
        p.y = y;
        particles.push(p);
    }
}

function animate() {
    ctx.clearRect(0, 0, w, h);

    // Remove small particles
    particles = particles.filter(p => p.size > 0.5);

    particles.forEach(p => {
        p.update();
        p.draw();
    });

    requestAnimationFrame(animate);
}

// Start Animation Loop
animate();


// Interactivity
const celebrateBtn = document.getElementById('celebrate-btn');
const musicBtn = document.getElementById('music-btn');
const audio = document.getElementById('bg-music');
const giftContainer = document.getElementById('gift-container');
const mainContent = document.getElementById('main-content');

let isPlaying = false;

// Gift Box Interaction
giftContainer.addEventListener('click', () => {
    // 1. Animate Gift Opening
    giftContainer.classList.add('gift-open');
    document.querySelector('.click-hint').style.display = 'none';

    // 2. Play Audio (Try to auto-play since user interacted)
    audio.play().then(() => {
        isPlaying = true;
        musicBtn.innerHTML = "⏸";
        musicBtn.style.animation = "spin 4s linear infinite";
    }).catch(e => console.log("Audio play prevented (optional)", e));

    // 3. Show Main Content after delay
    setTimeout(() => {
        giftContainer.style.display = 'none';
        mainContent.classList.remove('hidden');
        mainContent.classList.add('visible');

        // 4. Trigger HUGE confetti
        createBurst(w / 2, h / 2);
        setTimeout(() => createBurst(w / 4, h / 4), 300);
        setTimeout(() => createBurst(3 * w / 4, h / 4), 600);

        // Start recurring small bursts
        setInterval(() => {
            if (Math.random() > 0.8) { // Reduced frequency
                createBurst(Math.random() * w, Math.random() * h);
            }
        }, 3000); // Slower interval

    }, 800); // 800ms matches gift animation roughly
});

// Removed auto-celebrate on load because we want it on gift open now
// But we can keep a small "ready" sparkle if desired, or just clean it up.



celebrateBtn.addEventListener('click', (e) => {
    // Burst from button position
    const rect = celebrateBtn.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    createBurst(x, y);
    // Also random bursts
    setTimeout(() => createBurst(Math.random() * w, Math.random() * h), 200);

    // Add temporary button animation
    celebrateBtn.innerHTML = "🎈 Woohoo! 🎈";
    setTimeout(() => {
        celebrateBtn.innerHTML = "🎉 Reform The Celebration! 🎉";
    }, 1500);
});

// Music Toggle - Removed
// musicBtn.addEventListener('click', () => { ... });

// Add spin animation dynamically for music button (kept for safety or remove)
// const styleSheet = document.createElement("style"); ...

// Add spin animation dynamically for music button
const styleSheet = document.createElement("style");
styleSheet.innerText = `
@keyframes spin {
    100% { transform: rotate(360deg); }
}`;
document.head.appendChild(styleSheet);




// --- Floating Balloons ---
function createBalloon() {
    const balloon = document.createElement('div');
    balloon.className = 'balloon';

    // Random Position
    balloon.style.left = Math.random() * 100 + 'vw';

    // Random Color
    const colors = ['#FFD700', '#00FFFF', '#FF69B4', '#ff4d4d', '#a855f7'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    balloon.style.background = color;

    // Pseudo-elements need specific handling if we want to color the tail match,
    // but for simplicity we kept the CSS generic or we can set css var.
    // Let's set a CSS variable for the balloon instance
    balloon.style.setProperty('--gift-color', color);

    // Random Size
    const size = Math.random() * 0.5 + 0.8; // 0.8 to 1.3 scale
    balloon.style.transform = `scale(${size})`;

    // Random Speed
    const duration = Math.random() * 10 + 10; // 10-20s
    balloon.style.animationDuration = duration + 's';

    document.body.appendChild(balloon);

    setTimeout(() => {
        balloon.remove();
    }, duration * 1000);
}

// Start Balloons
setInterval(createBalloon, 2000); // Reduced frequency from 800ms -> 2000ms
