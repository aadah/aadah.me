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
    ]);
    sys.setup();
}

function draw() {
    sys.draw();
}
