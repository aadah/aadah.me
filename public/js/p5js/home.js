p5.disableFriendlyErrors = true;

var WIDTH;
var HEIGHT;
var IMAGE;

class Transform {
    constructor() { }

    setup() {
        throw new Error("not implemented");
    }

    draw() {
        throw new Error("not implemented");
    }
}

class JustThePicture extends Transform {
    constructor() {
        super();
    }

    setup() {}

    draw() {
        image(IMAGE, 0, 0);
        noLoop();
    }
}

class Inverter extends Transform {
    static FPS = 3;

    constructor() {
        super();
    }

    setup() {
        frameRate(Inverter.FPS);
    }

    draw() {
        (frameCount - 1) % Inverter.FPS == 0 ? image(IMAGE, 0, 0) : undefined;

        let dx = random(0.2, 0.8) * WIDTH;
        let dy = random(0.2, 0.8) * HEIGHT;
        let x = random(0, WIDTH - dx);
        let y = random(0, HEIGHT - dy);

        let piece = get(x, y, dx, dy);
        piece.filter(INVERT);

        image(piece, x, y)
    }
}

class Glitcher extends Transform {
    constructor() {
        super();
        this.glitch = new Glitch();
    }

    setup() {
        frameRate(24);
        this.glitch.loadImage(IMAGE);
    }

    draw() {
        this.glitch.resetBytes();
        this.glitch.randomBytes(1);
        this.glitch.buildImage();
        image(this.glitch.image, 0, 0)
    }
}

class BasePixelator extends Transform {
    constructor(f) {
        super();
        this.glitch = new Glitch();
        this.f = f;
    }

    setup() {
        frameRate(24);
        this.glitch.loadImage(IMAGE);
    }

    draw() {
        this.glitch.pixelate(this.f());
        image(this.glitch.image, 0, 0)
    }
}

class Pixelator extends BasePixelator {
    constructor() {
        super(() => noise(0.0005 * frameCount) * 0.2 + 0.05);
    }
}


class PixelOscillator extends BasePixelator {
    constructor() {
        super(() => (Math.cos(frameCount * 0.1) + 1 + 0.01) / 2);
    }
}


function circularShiftPixels(numPixels) {
    const n = pixels.length;

    // Normalize shiftBy to be within array bounds
    numPixels *= 4;
    numPixels = numPixels % n;
    if (numPixels < 0) numPixels += n;

    // Reverse the entire array
    reversePixels(0, n - 1);

    // Reverse the first shiftBy elements
    reversePixels(0, numPixels - 1);

    // Reverse the remaining elements
    reversePixels(numPixels, n - 1);
}

function reversePixels(start, end) {
    while (start < end) {
        [pixels[start], pixels[end]] = [pixels[end], pixels[start]];
        start++;
        end--;
    }
}

class FourCorners extends Transform {
    constructor() {
        super();
    }

    setup() {
        frameRate(0.5);
    }

    draw() {
        loadPixels();
        circularShiftPixels(random([1000003, 3000017, 5000011, 7000003]));
        updatePixels();
    }
}

class ChromaFlipper extends Transform {
    constructor() {
        super();
        this.prev = random([0, 1, 2]);
    }

    setup() {
        frameRate(0.5);
    }

    draw() {
        loadPixels();
        let colorIdx = random([0, 1, 2]);
        colorIdx = colorIdx == this.prev ? (colorIdx + random([1, 2])) % 3 : colorIdx;
        for (let i = 0; i < pixels.length; i += 4) {
            pixels[colorIdx + i] = 255 - pixels[colorIdx + i];
        }
        print(colorIdx);
        updatePixels();
        this.prev = colorIdx;
    }
}

class ChromaWalker extends Transform {
    static SECONDS = 2;
    static FPS = 30;

    constructor() {
        super();
        this.colorIdx = random([0, 1, 2]);
        this.tickerMax = Math.round(ChromaWalker.FPS * ChromaWalker.SECONDS);
    }

    setup() {
        frameRate(ChromaWalker.FPS);

        loadPixels();
        this.starts = new Array(pixels.length / 4).fill(undefined);
        this.starts.forEach((_, i) => this.starts[i] = pixels[this.colorIdx + 4 * i]);
    }

    draw() {
        loadPixels();

        let ticker = (frameCount - 1) % this.tickerMax + 1;
        let pos = ticker / this.tickerMax;

        for (let i = 0; i < pixels.length; i += 4) {
            let s = this.starts[i / 4];
            let e = 255 - s;
            pixels[this.colorIdx + i] = lerp(s, e, pos);
        }

        if (ticker == this.tickerMax) {
            let colorIdx = random([0, 1, 2]);
            this.colorIdx = colorIdx == this.colorIdx ? (colorIdx + random([1, 2])) % 3 : colorIdx;
            this.starts.forEach((_, i) => this.starts[i] = pixels[this.colorIdx + 4 * i]);
        }

        updatePixels();
    }
}

class Hoops extends Transform {
    static FPS = 30;
    static SECONDS = 3;
    static PIXEL_SPACING = 10;
    static FREQ = 2 * Math.PI / (this.FPS * this.SECONDS);

    constructor() {
        super();

        this.is = [];
        this.js = [];
        this.colors = [];
        this.idxs = [];

        for (let i = Math.round(Hoops.PIXEL_SPACING / 2); i < width + Hoops.PIXEL_SPACING; i += Hoops.PIXEL_SPACING) {
            for (let j = Math.round(Hoops.PIXEL_SPACING / 2); j < height + Hoops.PIXEL_SPACING; j += Hoops.PIXEL_SPACING) {
                this.is.push(i);
                this.js.push(j);
                this.colors.push(color(IMAGE.get(i, j)));
                this.idxs.push(this.idxs.length);
            }
        }

        this.idxs = shuffle(this.idxs);
    }

    setup() {
        frameRate(Hoops.FPS);
        noFill();
        strokeWeight(1);
    }

    draw() {
        clear();
        this.colors.forEach((c, n) => {
            stroke(c);
            let x = frameCount + this.idxs[n];
            circle(this.is[n], this.js[n], (Hoops.PIXEL_SPACING - 1) * (1 + Math.sin(x * Hoops.FREQ)) / 2);
        });
    }
}

class DiscoFloor extends Transform {
    static FPS = 30;
    static SECONDS = 3;
    static SPACING = 20;
    static FREQ = 2 * Math.PI / (this.FPS * this.SECONDS);
    static FADE = 2;
    static BORDER = 3;

    constructor() {
        super();

        this.is = [];
        this.js = [];
        this.colors = [];
        this.idxs = [];

        for (let i = Math.round(DiscoFloor.SPACING / 2); i < width + DiscoFloor.SPACING; i += DiscoFloor.SPACING) {
            for (let j = Math.round(DiscoFloor.SPACING / 2); j < height + DiscoFloor.SPACING; j += DiscoFloor.SPACING) {
                this.is.push(i);
                this.js.push(j);
                this.colors.push(color(IMAGE.get(i, j)));
                this.idxs.push(this.idxs.length);
            }
        }

        this.idxs = shuffle(this.idxs);
    }

    setup() {
        frameRate(DiscoFloor.FPS);
        rectMode(CENTER);
        noStroke();
    }

    draw() {
        clear();
        this.colors.forEach((c, n) => {
            let x = frameCount + this.idxs[n];
            let opacityFrac = (1 + Math.sin(x * DiscoFloor.FREQ)) / 2;
            c.setAlpha(opacityFrac * 255);
            fill(c);
            square(this.is[n], this.js[n], DiscoFloor.SPACING - DiscoFloor.BORDER);
        });
        filter(BLUR, DiscoFloor.FADE);
    }
}

class Cartograph extends Transform {
    static FPS = 10;
    static SECONDS = 10;
    static PIXEL_SPACING = 30;
    static FREQ = 2 * Math.PI / (this.FPS * this.SECONDS);
    static EFFECT = 25;

    constructor() {
        super();

        this.is = [];
        this.js = [];
        this.colors = [];
        this.idxs = [];

        for (let i = Math.round(Cartograph.PIXEL_SPACING / 2); i < width + Cartograph.PIXEL_SPACING; i += Cartograph.PIXEL_SPACING) {
            for (let j = Math.round(Cartograph.PIXEL_SPACING / 2); j < height + Cartograph.PIXEL_SPACING; j += Cartograph.PIXEL_SPACING) {
                this.is.push(i);
                this.js.push(j);
                this.colors.push(color(IMAGE.get(i, j)));
                this.idxs.push(this.idxs.length);
            }
        }

        this.idxs = shuffle(this.idxs);
    }

    setup() {
        frameRate(Cartograph.FPS);
        noStroke();
    }

    draw() {
        clear();
        this.idxs.forEach((idx, n) => {
            fill(this.colors[idx]);
            let x = frameCount + n;
            circle(
                this.is[idx], this.js[idx],
                Cartograph.PIXEL_SPACING + (Cartograph.PIXEL_SPACING - 1) * (1 + Math.sin(x * Cartograph.FREQ)) / 2
            );
        });
        filter(BLUR, Math.round(Cartograph.EFFECT / 2));
        filter(POSTERIZE, Cartograph.EFFECT);
    }
}

function getImageData() {
    const img = document.querySelector('figure img');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = img.width;
    canvas.height = img.height;

    ctx.drawImage(
        img,
        0, 0, img.naturalWidth, img.naturalHeight, // src
        0, 0, canvas.width, canvas.height, // dst
    );

    return canvas.toDataURL();
}

function preload() {
    const imageData = getImageData();
    loadImage(imageData, (img) => {
        IMAGE = img;
        $('figure').toggle(false);
    });
}

function setupCanvas() {
    WIDTH = IMAGE.width;
    HEIGHT = IMAGE.height;
    createCanvas(WIDTH, HEIGHT);
    image(IMAGE, 0, 0);

    let selector = 'figure, .p5Canvas';
    $(selector).off();
    $(selector).on('click', () => {
        $(selector).toggle();
        // cycleEffect();
    }).on('touchstart', (event) => {
        event.preventDefault();
        $(selector).toggle();
        // cycleEffect();
    });
}

const EFFECTS = [
    // JustThePicture,
    // Inverter,
    Pixelator,
    Glitcher,
    // FourCorners,
    // ChromaFlipper,
    ChromaWalker,
    PixelOscillator,
    Hoops,
    DiscoFloor,
    Cartograph,
];

var EFFECT_IDX = Math.floor(Math.random() * EFFECTS.length);
var SYSTEM;

function setup() {
    setupCanvas();
    SYSTEM = new EFFECTS[EFFECT_IDX]();
    SYSTEM.setup();
}

function draw() {
    SYSTEM.draw();
}

function cycleEffect() {
    noLoop();
    
    EFFECT_IDX++;
    EFFECT_IDX %= EFFECTS.length;
    setup();

    loop();
}

// -----------------------------------------------------------------------------

window.addEventListener('resize', () => {
    preload();
    setup();
});

function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

window.addEventListener('load', () => {
  if (isMobileDevice()) {
    $('footer > p')[0].innerText = 'Tap visual to toggle.';
  }
});

setTimeout(() => {
  $('footer > *').toggle(1000, () => {
    setTimeout(() => {
      $('footer > *').toggle(1000);
    }, 3000);
  });
}, 5000);
