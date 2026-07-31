// =====================================================
// LOVE HEART
// Bölüm 1
// =====================================================

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const yu = document.getElementById("yu");

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener("resize", () => {
    resize();
    createHeart();
});

resize();

const WORD = "I love you";
const TOTAL = 5000;

let points = [];
let time = 0;
let start = performance.now();
let yuVisible = false;
// =====================================================
// LOVE HEART
// Bölüm 2
// =====================================================

function heartPoint(t){

    return{

        x:16*Math.pow(Math.sin(t),3),

        y:
            13*Math.cos(t)
            -5*Math.cos(2*t)
            -2*Math.cos(3*t)
            -Math.cos(4*t)

    };

}

function createHeart(){

    points=[];

    const scale=Math.min(canvas.width,canvas.height)/42;

    for(let i=0;i<TOTAL;i++){

        const t=Math.random()*Math.PI*2;

        const p=heartPoint(t);

        const depth=0.3+Math.random()*0.7;

        points.push({

            x:canvas.width/2+p.x*scale*depth,

            y:canvas.height/2-p.y*scale*depth,

            visible:false,

            alpha:0,

            targetAlpha:0.45+Math.random()*0.55,

            size:9+Math.random()*3,

            twinkle:Math.random()*Math.PI*2,

            // Rastgele görünme zamanı
            delay:Math.random()*3

        });

    }

}

createHeart(); 
// =====================================================
// LOVE HEART
// Bölüm 3
// =====================================================

let revealed = 0;

function update(){

    const elapsed=(performance.now()-start)/1000;
    
    // =====================================================
// YUMUŞAK GEÇİŞ
// =====================================================

if (elapsed > 20 && !window.transitionStarted) {

    window.transitionStarted = true;

    // Kalp ve yu yavaşça kaybolsun
    canvas.style.transition = "opacity 2.5s ease";
    yu.style.transition =
        "opacity 1.8s ease, transform 1.8s ease";

    canvas.style.opacity = "0";

    yu.style.opacity = "0";

    yu.style.transform =
        "translate(-50%, -50%) scale(0.9)";

}


// Kalp kaybolduktan sonra son ekran gelsin

if (
    elapsed > 22.5
    &&
    !window.endShown
) {

    window.endShown = true;

    canvas.style.display = "none";

    yu.style.display = "none";

    const endScreen =
        document.getElementById("endScreen");

    endScreen.style.display = "flex";

    endScreen.style.opacity = "0";

    endScreen.style.transition =
        "opacity 1.5s ease";

    requestAnimationFrame(() => {

        endScreen.style.opacity = "1";

    });

}

    // İlk başta yavaş, sonra hızlanır
    const speed=Math.min(8+elapsed*elapsed*18,120);

    revealed+=speed/60;

    const chance=Math.min(revealed/points.length,1);

    for(const p of points){

        if(!p.visible){

            if(Math.random()<chance*0.015 && elapsed>p.delay){

                p.visible=true;

            }

        }

        if(p.visible){

            p.alpha+=(p.targetAlpha-p.alpha)*0.06;

        }

    }

    // Kalbin %75'i oluşunca yu yazısı gelsin
    const visibleCount=points.filter(p=>p.visible).length;

    if(!yuVisible && visibleCount>points.length*0.75){

        yuVisible=true;

        yu.style.opacity=1;

    }

} 
// =====================================================
// LOVE HEART
// Bölüm 4
// =====================================================

function draw(){

    requestAnimationFrame(draw);

    update();

    time+=0.03;

    ctx.clearRect(0,0,canvas.width,canvas.height);

    ctx.textAlign="center";
    ctx.textBaseline="middle";

    const pulse=1+Math.sin(time)*0.035;

    for(const p of points){

        if(!p.visible) continue;

        const glow=0.75+Math.sin(time*2+p.twinkle)*0.25;

        const x=
            canvas.width/2+
            (p.x-canvas.width/2)*pulse;

        const y=
            canvas.height/2+
            (p.y-canvas.height/2)*pulse;

        ctx.globalAlpha=p.alpha*glow;

        ctx.fillStyle="#ff4d6d";

        ctx.font=`${p.size}px Arial`;

        ctx.fillText(
            WORD,
            x,
            y
        );

    }

    ctx.globalAlpha=1;

}

draw();
