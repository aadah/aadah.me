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
        sys.glitch.pixelate(this.f());
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
        super(() => (Math.cos(frameCount * 0.05) + 1 + 0.01) / 2);
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
    static SPACING = 15;
    static FREQ = 2 * Math.PI / (this.FPS * this.SECONDS);
    static FADE = 3;

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
    }

    draw() {
        clear();
        this.colors.forEach((c, n) => {
            fill(c);
            let x = frameCount + this.idxs[n];
            square(this.is[n], this.js[n], DiscoFloor.SPACING * (1 + Math.sin(x * DiscoFloor.FREQ)) / 2);
        });
        filter(BLUR, DiscoFloor.FADE);
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
    loadImage(imageData, (img) => IMAGE = img);
}

function setupCanvas() {
    WIDTH = IMAGE.width;
    HEIGHT = IMAGE.height;
    createCanvas(WIDTH, HEIGHT);
    image(IMAGE, 0, 0);
}

function randomEffect() {
    let effects = [
        // Inverter,
        Pixelator,
        // PixelOscillator,
        Glitcher,
        // FourCorners,
        // ChromaFlipper,
        ChromaWalker,
        Hoops,
        DiscoFloor,
    ];
    return effects[Math.floor(Math.random() * effects.length)];
}

var C = randomEffect();

function setup() {
    setupCanvas();
    sys = new C();
    sys.setup();
}

function draw() {
    sys.draw();
}
