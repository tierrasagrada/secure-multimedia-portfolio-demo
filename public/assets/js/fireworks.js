const isFirefox =
    navigator.userAgent.toLowerCase().includes("firefox");
/* =========================
   ENGINE STATE
========================= */

const FX = {

    canvas:null,
    ctx:null,

    particles:[],

    running:false,
    raf:null,

    bound:false
};

/* =========================
   INIT
========================= */

function initFX(){

    const wrapper = document.querySelector(".fireworks");

    if(!wrapper) return null;

    if(FX.bound) return wrapper;

    FX.canvas = wrapper.querySelector(".fireworks-canvas");

    if(!FX.canvas){

        FX.canvas = document.createElement("canvas");
        FX.canvas.className = "fireworks-canvas";

        wrapper.appendChild(FX.canvas);
    }

    FX.ctx = FX.canvas.getContext("2d");

    FX.bound = true;

    /* replay hover */
    wrapper.addEventListener("pointerenter", () => {

        explodeFX(wrapper);
    });

    return wrapper;
}

/* =========================
   RESIZE
========================= */

function resizeFX(){

    const wrapper = document.querySelector(".fireworks");

    if(!wrapper || !FX.canvas) return;

    const rect = wrapper.getBoundingClientRect();

    FX.canvas.width = rect.width;
    FX.canvas.height = rect.height;
}

/* =========================
   PARTICLE CREATION
========================= */

function explodeFX(wrapper){

    if(FX.running){
        return;
    }
    
    initFX();
    resizeFX();

    const cx = FX.canvas.width / 2;
    const cy = FX.canvas.height / 2;

    const colors = [

        "#ffb703",
        "#fb8500",
        "#ff6b35",
        "#ffd166",

        "#ffffff",
        "#86efac"
    ];

    for(let i=0;i<65;i++){

        const angle = Math.random() * Math.PI * 2;

        const speed = Math.random() * 7 + 3;

        FX.particles.push({

            x:cx,
            y:cy,

            vx:Math.cos(angle) * speed,
            vy:Math.sin(angle) * speed,

            life:140,
            maxLife:140,

            size:Math.random()*2 + 1.8,

            color:colors[
                Math.floor(Math.random()*colors.length)
            ],

            trail:[]
        });
    }

    startFX();
}

/* =========================
   CINEMATIC AAA LOOP
========================= */

function startFX(){

    if(FX.running) return;

    FX.running = true;
    let lastTime = 0;
function loop(timestamp){

    if(timestamp - lastTime < 16){

        FX.raf = requestAnimationFrame(loop);
        return;
    }

    lastTime = timestamp;

        FX.ctx.clearRect(
            0,
            0,
            FX.canvas.width,
            FX.canvas.height
        );

        for(let i=FX.particles.length-1;i>=0;i--){

            const p = FX.particles[i];

            /* =========================
               SAVE TRAIL
            ========================= */

            p.trail.push({
                x:p.x,
                y:p.y
            });

            if(p.trail.length > 7){

                p.trail.shift();
            }

            /* =========================
               PHYSICS
            ========================= */

            p.x += p.vx;
            p.y += p.vy;

            p.vy += 0.025;

            p.life--;

            const alpha = Math.max(
                p.life / p.maxLife,
                0
            );

            /* =========================
               CINEMATIC TRAIL
            ========================= */

            for(let t=0;t<p.trail.length-1;t++){

                const pt1 = p.trail[t];
                const pt2 = p.trail[t+1];

                const trailAlpha =
                    (t / p.trail.length) * alpha;

                FX.ctx.globalAlpha = trailAlpha;



                FX.ctx.beginPath();

       FX.ctx.strokeStyle = p.color;

                FX.ctx.lineWidth = 1.4;

                FX.ctx.shadowBlur = 0;
                FX.ctx.shadowColor = p.color;

                FX.ctx.moveTo(pt1.x, pt1.y);
                FX.ctx.lineTo(pt2.x, pt2.y);

                FX.ctx.stroke();
            }

            /* =========================
               PARTICLE CORE
            ========================= */

            FX.ctx.globalAlpha = alpha;

            FX.ctx.beginPath();

            FX.ctx.fillStyle = p.color;

            FX.ctx.shadowBlur = isFirefox ? 10 : 28;
            FX.ctx.shadowColor = p.color;

            FX.ctx.arc(

                p.x,
                p.y,

                p.size,

                0,
                Math.PI * 2
            );

            FX.ctx.fill();

            /* =========================
               CLEANUP
            ========================= */

            if(p.life <= 0){

                FX.particles.splice(i,1);
            }
        }

        FX.ctx.globalAlpha = 1;

        /* stop loop */
        if(FX.particles.length === 0){

            FX.running = false;

            FX.ctx.clearRect(
                0,
                0,
                FX.canvas.width,
                FX.canvas.height
            );

            return;
        }

        FX.raf = requestAnimationFrame(loop);
    }

    loop();
}

/* =========================
   BACKEND TRIGGER
========================= */

function triggerWanderitoFX(){

    const wrapper = initFX();

    if(!wrapper) return;

    requestAnimationFrame(() => {

        explodeFX(wrapper);
    });
}

function destroyFireworks(){

    if(FX.raf){

        cancelAnimationFrame(
            FX.raf
        );
    }

    FX.particles = [];

    FX.running = false;

    FX.raf = null;

    FX.canvas = null;

    FX.ctx = null;

    FX.bound = false;
}

window.destroyFireworks =
  destroyFireworks;

/* =========================
   GLOBAL EXPORT
========================= */

window.triggerWanderitoFX =
  triggerWanderitoFX;