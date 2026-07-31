// =====================================================
// YU HEART
// PC + iPAD + PHONE RESPONSIVE
// =====================================================

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const yu = document.getElementById("yu");

const WORD = "I love you";
const TOTAL = 5000;

let points = [];
let time = 0;
let start = performance.now();

let yuVisible = false;
let revealed = 0;


// =====================================================
// EKRAN BOYUTU
// =====================================================

function resize(){

    const width = window.innerWidth;
    const height = window.innerHeight;

    // iPad ve telefonlarda daha doğru ekran yüksekliği
    const viewportHeight =
        window.visualViewport
        ? window.visualViewport.height
        : height;


    // Retina / iPad ekranlarında daha net görüntü
    const pixelRatio =
        Math.min(
            window.devicePixelRatio || 1,
            2
        );


    canvas.style.width =
        width + "px";


    canvas.style.height =
        viewportHeight + "px";


    canvas.width =
        Math.floor(width * pixelRatio);


    canvas.height =
        Math.floor(
            viewportHeight * pixelRatio
        );


    // Canvas koordinatlarını CSS pikseline çevir
    ctx.setTransform(
        pixelRatio,
        0,
        0,
        pixelRatio,
        0,
        0
    );


    createHeart();

}


// Bilgisayar ekranı değişince
window.addEventListener(
    "resize",
    resize
);


// iPad / telefon döndürülünce
window.addEventListener(
    "orientationchange",
    () => {

        setTimeout(
            resize,
            250
        );

    }
);


// Mobil tarayıcı yüksekliği değişince
if(window.visualViewport){

    window.visualViewport
    .addEventListener(
        "resize",
        resize
    );

}


resize();


// =====================================================
// KALP ŞEKLİ
// =====================================================

function heartPoint(t){

    return{

        x:
        16 *
        Math.pow(
            Math.sin(t),
            3
        ),

        y:

        13*Math.cos(t)

        -5*Math.cos(2*t)

        -2*Math.cos(3*t)

        -Math.cos(4*t)

    };

}


// =====================================================
// KALBİ OLUŞTUR
// =====================================================

function createHeart(){

    points = [];


    // Telefon, iPad ve bilgisayarda
    // kalbin ekrana dengeli oturması

    const shortestSide =
        Math.min(
            window.innerWidth,
            window.innerHeight
        );


    let scale;


    // Telefon

    if(window.innerWidth <= 600){

        scale =
        shortestSide / 39;

    }


    // iPad

    else if(
        window.innerWidth <= 1180
    ){

        scale =
        shortestSide / 40;

    }


    // Bilgisayar

    else{

        scale =
        shortestSide / 42;

    }



    for(
        let i = 0;
        i < TOTAL;
        i++
    ){

        const t =
        Math.random()
        * Math.PI
        * 2;


        const p =
        heartPoint(t);


        const depth =
        0.3
        +
        Math.random()
        * 0.7;


        points.push({

            x:

            window.innerWidth / 2

            +

            p.x
            *
            scale
            *
            depth,


            y:

            window.innerHeight / 2

            -

            p.y
            *
            scale
            *
            depth,


            visible:false,


            alpha:0,


            targetAlpha:

            0.45

            +

            Math.random()
            * 0.55,


            // Küçük ekranlarda
            // yazılar biraz daha küçük

            size:

            window.innerWidth <= 600

            ?

            6
            +
            Math.random()*2

            :

            9
            +
            Math.random()*3,


            twinkle:

            Math.random()
            *
            Math.PI
            *
            2,


            delay:

            Math.random()
            * 3

        });

    }

}


// =====================================================
// ANİMASYON GÜNCELLE
// =====================================================

function update(){

    const elapsed =

    (
        performance.now()
        -
        start
    )

    / 1000;



    // =================================================
    // KALP VE YU KAYBOLSUN
    // =================================================

    if(

        elapsed > 20

        &&

        !window.transitionStarted

    ){


        window.transitionStarted =
        true;


        canvas.style.transition =

        "opacity 2.5s ease";


        yu.style.transition =

        "opacity 1.8s ease, transform 1.8s ease";


        canvas.style.opacity =
        "0";


        yu.style.opacity =
        "0";


        yu.style.transform =

        "translate(-50%, -50%) scale(0.9)";

    }



    // =================================================
    // SON EKRAN
    // =================================================

    if(

        elapsed > 22.5

        &&

        !window.endShown

    ){


        window.endShown =
        true;


        canvas.style.display =
        "none";


        yu.style.display =
        "none";


        const endScreen =

        document.getElementById(
            "endScreen"
        );


        endScreen.style.display =
        "flex";


        endScreen.style.opacity =
        "0";


        endScreen.style.transition =

        "opacity 1.5s ease";


        requestAnimationFrame(
            () => {

                endScreen.style.opacity =
                "1";

            }
        );

    }



    // =================================================
    // KALP OLUŞUM HIZI
    // =================================================

    const speed =

    Math.min(

        8

        +

        elapsed
        *
        elapsed
        *
        18,

        120

    );


    revealed +=

    speed / 60;


    const chance =

    Math.min(

        revealed
        /
        points.length,

        1

    );



    for(
        const p
        of points
    ){


        if(
            !p.visible
        ){


            if(

                Math.random()

                <

                chance
                *
                0.015

                &&

                elapsed
                >
                p.delay

            ){


                p.visible =
                true;

            }

        }



        if(
            p.visible
        ){


            p.alpha +=

            (
                p.targetAlpha
                -
                p.alpha
            )

            *

            0.06;

        }

    }



    // =================================================
    // YU YAZISI
    // =================================================

    const visibleCount =

    points.filter(
        p => p.visible
    ).length;



    if(

        !yuVisible

        &&

        visibleCount

        >

        points.length
        *
        0.75

    ){


        yuVisible =
        true;


        yu.style.opacity =
        "1";

    }

}


// =====================================================
// ÇİZİM
// =====================================================

function draw(){

    requestAnimationFrame(
        draw
    );


    update();


    time += 0.03;


    // Canvas CSS pikseliyle çiziliyor

    ctx.clearRect(

        0,

        0,

        window.innerWidth,

        window.innerHeight

    );


    ctx.textAlign =
    "center";


    ctx.textBaseline =
    "middle";


    const pulse =

    1

    +

    Math.sin(time)

    *

    0.035;



    for(
        const p
        of points
    ){


        if(
            !p.visible
        )
        continue;



        const glow =

        0.75

        +

        Math.sin(

            time
            *
            2

            +

            p.twinkle

        )

        *

        0.25;



        const x =

        window.innerWidth
        /
        2

        +

        (

            p.x

            -

            window.innerWidth
            /
            2

        )

        *

        pulse;



        const y =

        window.innerHeight
        /
        2

        +

        (

            p.y

            -

            window.innerHeight
            /
            2

        )

        *

        pulse;



        ctx.globalAlpha =

        p.alpha
        *
        glow;


        ctx.fillStyle =
        "#ff4d6d";


        ctx.font =

        `${p.size}px Arial`;


        ctx.fillText(

            WORD,

            x,

            y

        );

    }



    ctx.globalAlpha =
    1;

}


draw();
