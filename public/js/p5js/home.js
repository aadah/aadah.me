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
    constructor() {
        super();
        this.step = 0
    }

    setup() {
        frameRate(1);
    }

    draw() {
        frameCount % 10 == 0 ? image(IMAGE, 0, 0) : undefined;

        let dx = random(0.25, 0.75) * WIDTH;
        let dy = random(0.25, 0.75) * HEIGHT;
        let x = random(0, WIDTH - dx);
        let y = random(0, HEIGHT - dy);

        let piece = get(x, y, dx, dy);
        piece.filter(INVERT);

        set(x, y, piece);
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

class Pixelator extends Transform {
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
    static SECONDS = 3;
    static FPS = 30;
    static HALFPI = Math.PI / 2;

    constructor() {
        super();
        this.colorIdx = random([0, 1, 2]);
        this.denom = ChromaWalker.FPS * ChromaWalker.SECONDS;
    }

    setup() {
        frameRate(ChromaWalker.FPS);

        loadPixels();
        this.starts = new Array(pixels.length / 4).fill(undefined);
        this.starts.forEach((_, i) => this.starts[i] = pixels[this.colorIdx + 4 * i]);
    }

    draw() {
        loadPixels();

        let ticker = (frameCount - 1) % (ChromaWalker.FPS * ChromaWalker.SECONDS) + 1;
        let pos = ticker / this.denom;
        pos = (Math.sin(map(pos, 0, 1, -ChromaWalker.HALFPI, ChromaWalker.HALFPI)) + 1) / 2;

        for (let i = 0; i < pixels.length; i += 4) {
            let start = this.starts[i / 4];
            pixels[this.colorIdx + i] = lerp(start, 255 - start, pos);
        }

        if (ticker == this.denom) {
            let colorIdx = random([0, 1, 2]);
            this.colorIdx = colorIdx == this.colorIdx ? (colorIdx + random([1, 2])) % 3 : colorIdx;
            this.starts.forEach((_, i) => this.starts[i] = pixels[this.colorIdx + 4 * i]);
        }

        updatePixels();
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
    });
}

function setupCanvas() {
    WIDTH = IMAGE.width;
    HEIGHT = IMAGE.height;
    createCanvas(WIDTH, HEIGHT);
    image(IMAGE, 0, 0);
}

function setup() {
    setupCanvas();
    sys = random([
        new Pixelator(() => noise(0.0005 * frameCount) * 0.2 + 0.05),
        new Pixelator(() => (Math.cos(frameCount * 0.05) + 1 + 0.01) / 2),
        new Glitcher(),
        new FourCorners(),
        new ChromaFlipper(),
        new ChromaWalker(),
    ]);
    sys.setup();
}

function draw() {
    sys.draw();
}
