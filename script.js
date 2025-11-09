// ===== PÁGINA 1: REGALO =====
document.addEventListener('DOMContentLoaded', function() {
    const giftBox = document.getElementById('giftBox');
    
    if (giftBox) {
        // Evento click en el regalo para ir a la página 2
        giftBox.addEventListener('click', function() {
            // Animación de apertura antes de cambiar de página
            giftBox.style.transform = 'scale(1.2) rotateY(360deg)';
            giftBox.style.transition = 'transform 0.8s ease';
            
            setTimeout(function() {
                window.location.href = 'page2.html';
            }, 800);
        });
    }
});

// ===== PÁGINA 2 Y 3: CIELO NOCTURNO =====
function initNightSky() {
    const container = document.querySelector('.page2-container');
    
    if (!container) return;
    
    // Crear estrellas
    const starsContainer = document.createElement('div');
    starsContainer.className = 'stars';
    container.appendChild(starsContainer);
    
    // Detectar si es móvil
    const isMobile = window.innerWidth < 768;
    const starCount = isMobile ? 50 : 150; // Menos estrellas en móvil
    
    // Generar estrellas aleatorias
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.width = Math.random() * 3 + 'px';
        star.style.height = star.style.width;
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 3 + 's';
        starsContainer.appendChild(star);
    }
    
    // Crear luna
    const moon = document.createElement('div');
    moon.className = 'moon';
    container.appendChild(moon);
    
    // Crear estrellas fugaces (solo si no es móvil)
    if (!isMobile) {
        function createShootingStar() {
            const shootingStar = document.createElement('div');
            shootingStar.className = 'shooting-star';
            shootingStar.style.left = Math.random() * 100 + '%';
            shootingStar.style.top = Math.random() * 50 + '%';
            shootingStar.style.animationDuration = (Math.random() * 2 + 2) + 's';
            container.appendChild(shootingStar);
            
            setTimeout(function() {
                shootingStar.remove();
            }, 5000);
        }
        
        // Crear estrella fugaz cada 5 segundos (antes era 3)
        setInterval(createShootingStar, 5000);
        createShootingStar();
    }
}

// ===== PÁGINA 2: MÚSICA Y NAVEGACIÓN =====
function initPage2() {
    initNightSky();
    initFireworks();
    
    // Función para reproducir música
    function playMusic() {
        const audio = document.getElementById('backgroundMusic');
        if (audio) {
            audio.play().catch(function(error) {
                console.log('No se pudo reproducir la música automáticamente:', error);
                document.body.addEventListener('click', function() {
                    audio.play();
                }, { once: true });
            });
        }
    }
    
    // Reproducir música al cargar
    playMusic();
    
    // Reproducir música cuando vuelves atrás con el navegador
    window.addEventListener('pageshow', function(event) {
        if (event.persisted) {
            playMusic();
        }
    });
    
    // Botón siguiente a página 3
    const nextButton = document.getElementById('nextButton');
    if (nextButton) {
        nextButton.addEventListener('click', function() {
            window.location.href = 'page3.html';
        });
    }
}

// ===== FUEGOS ARTIFICIALES OPTIMIZADOS =====
function initFireworks() {
    const canvas = document.getElementById('fireworksCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Detectar si es móvil
    const isMobile = window.innerWidth < 768;
    
    // Redimensionar canvas
    window.addEventListener('resize', function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
    
    const fireworks = [];
    const particles = [];
    
    // LÍMITE DE FUEGOS ARTIFICIALES TOTALES
    let fireworkCount = 0;
    const MAX_FIREWORKS = 10;
    
    // LÍMITE DE PARTÍCULAS para no saturar el móvil
    const MAX_PARTICLES = isMobile ? 150 : 800;
    
    // Clase Fuego Artificial
    function Firework(x, y) {
        this.x = x;
        this.y = canvas.height;
        this.targetY = y;
        this.speed = 3;
        this.angle = Math.PI / 2;
        this.velocity = this.speed;
        this.opacity = 1;
        this.hue = Math.random() * 360;
    }
    
    Firework.prototype.update = function() {
        const dy = this.targetY - this.y;
        this.y -= this.velocity;
        
        if (this.y <= this.targetY) {
            return true; // Explota
        }
        return false;
    };
    
    Firework.prototype.draw = function() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = 'hsl(' + this.hue + ', 100%, 60%)';
        ctx.fill();
    };
    
    // Clase Partícula
    function Particle(x, y, hue) {
        this.x = x;
        this.y = y;
        this.hue = hue;
        this.speed = Math.random() * 5 + 2;
        this.angle = Math.random() * Math.PI * 2;
        this.velocity = {
            x: Math.cos(this.angle) * this.speed,
            y: Math.sin(this.angle) * this.speed
        };
        this.opacity = 1;
        this.decay = Math.random() * 0.03 + 0.02; // Desaparecen MÁS rápido
        this.size = Math.random() * 2 + 1; // Partículas más pequeñas
    }
    
    Particle.prototype.update = function() {
        this.velocity.y += 0.1; // Gravedad
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.opacity -= this.decay;
        
        return this.opacity > 0;
    };
    
    Particle.prototype.draw = function() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = 'hsl(' + this.hue + ', 100%, 60%)';
        ctx.fill();
        ctx.restore();
    };
    
    // Crear fuego artificial
    function createFirework() {
        // Detener si ya se crearon 10 fuegos artificiales
        if (fireworkCount >= MAX_FIREWORKS) return;
        
        // No crear si hay demasiadas partículas
        if (particles.length > MAX_PARTICLES) return;
        
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height * 0.4 + 50;
        fireworks.push(new Firework(x, y));
        fireworkCount++;
    }
    
    // Crear explosión de partículas (REDUCIDO)
    function createParticles(x, y, hue) {
        // Mucho menos partículas: 12 en móvil, 30 en desktop
        const particleCount = isMobile ? 12 : 30;
        
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle(x, y, hue));
        }
    }
    
    // Animar
    function animate() {
        ctx.fillStyle = 'rgba(12, 12, 30, 0.15)'; // Rastro más marcado
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Actualizar y dibujar fuegos artificiales
        for (let i = fireworks.length - 1; i >= 0; i--) {
            const firework = fireworks[i];
            firework.draw();
            
            if (firework.update()) {
                createParticles(firework.x, firework.y, firework.hue);
                fireworks.splice(i, 1);
            }
        }
        
        // Actualizar y dibujar partículas
        for (let i = particles.length - 1; i >= 0; i--) {
            const particle = particles[i];
            particle.draw();
            
            if (!particle.update()) {
                particles.splice(i, 1);
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    // Crear fuegos artificiales periódicamente
    // Cada 5 segundos, máximo 10 fuegos artificiales
    const fireworkInterval = 5000;
    
    // Crear el primer fuego artificial INMEDIATAMENTE
    createFirework();
    
    // Luego continuar cada 5 segundos
    setInterval(createFirework, fireworkInterval);
    
    // Iniciar animación
    animate();
}

// ===== PÁGINA 3: SEGUNDA MÚSICA =====
function initPage3() {
    initNightSky();
    
    // Reproducir segunda música automáticamente
    const audio = document.getElementById('backgroundMusic2');
    if (audio) {
        audio.play().catch(function(error) {
            console.log('No se pudo reproducir la música automáticamente:', error);
            document.body.addEventListener('click', function() {
                audio.play();
            }, { once: true });
        });
    }
}

// Detectar en qué página estamos y ejecutar la función correspondiente
if (document.getElementById('page2')) {
    initPage2();
} else if (document.getElementById('page3')) {
    initPage3();
}

