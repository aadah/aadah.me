p5.disableFriendlyErrors = true;

var WIDTH;
var HEIGHT;
var SCALE;

const SEED = 42;

const NEGATE = true;

const MAX_ALPHA = 1;
const MIN_ALPHA = 0;

// const NUM_OBJS = 100;
const NUM_OBJS = 1000;

// const dT = 0.005;
const dT = 0.001;

const LORENZ_PARAMS = { sigma: 10, rho: 28, beta: 8 / 3 };
const LORENZ_PARAMS_V2 = { sigma: 11, rho: 20, beta: 7 / 3 };

const ROSSLER_PARAMS = { a: 0.1, b: 0.1, c: 14 };
const ROSSLER_PARAMS_V2 = { a: 0.2, b: 0.2, c: 5.7 };
const ROSSLER_PARAMS_V3 = { a: 0.2, b: 0.2, c: 14 };

const THOMAS_PARAMS = { b: 0.208186 };
const THOMAS_PARAMS_V2 = { b: 0.32899 };

function drawP(c, p) {
    stroke(c);
    strokeWeight(10 / SCALE);
    point(p);
}

class Shape {
    constructor(p1, p2, p3, systemParams) {
        let v = Math.abs(p1.y - p3.y);
        let h = Math.abs(p1.x - p3.x);
        let denom = v + h;

        let v2 = Math.abs(p2.y - p3.y);
        let h2 = Math.abs(p2.x - p3.x);
        let denom2 = v2 + h2;

        this.hue = 100 * v / denom;
        this.lightness = denom2 > 0 ? 100 * v2 / denom2 : 50;

        if (systemParams.colorOn) {
            this.c = NEGATE ?
                color(this.hue, systemParams.brightnessOn ? this.lightness : 100, 100) :
                color(this.hue, 100, systemParams.brightnessOn ? this.lightness : 100);
        } else {
            this.c = color(NEGATE ? 100 : 0);
        }
    }

    draw(a) {
        noFill();

        this.c.setAlpha(a);
        stroke(this.c);
        strokeWeight(0.1 / SCALE);

        this.drawShape();
    }

    drawShape() {
        throw new Error("drawShape() method must be implemented in child class");
    }
}

class Point extends Shape {
    constructor(p1, p2, p3, systemParams) {
        super(p1, p2, p3, systemParams);
        this.point = p1;
    }

    drawShape() {
        strokeWeight(2 / SCALE);
        point(this.point.x, this.point.y);
    }
}

class Circle extends Shape {
    constructor(p1, p2, p3, systemParams) {
        super(p1, p2, p3, systemParams);
        this.center = p1;
        let d = dist(p1.x, p1.y, p2.x, p2.y);
        this.diameter = 2 * d;
    }

    drawShape() {
        circle(this.center.x, this.center.y, this.diameter);
    }
}

class Triangle extends Shape {
    static ANGLE = (2 * Math.PI) / 3;

    constructor(p1, p2, p3, systemParams) {
        super(p1, p2, p3, systemParams);
        let d = dist(p1.x, p1.y, p2.x, p2.y);
        let baseAngle = atan2(p2.y - p1.y, p2.x - p1.x);

        this.c1 = p2;
        this.c2 = createVector(p1.x + d * Math.cos(baseAngle + Triangle.ANGLE), p1.y + d * Math.sin(baseAngle + Triangle.ANGLE));
        this.c3 = createVector(p1.x + d * Math.cos(baseAngle - Triangle.ANGLE), p1.y + d * Math.sin(baseAngle - Triangle.ANGLE));
    }

    drawShape() {
        triangle(
            this.c1.x, this.c1.y,
            this.c2.x, this.c2.y,
            this.c3.x, this.c3.y
        );
    }
}

class Square extends Shape {
    constructor(p1, p2, p3, systemParams) {
        super(p1, p2, p3, systemParams);
        let dx = p2.x - p1.x;
        let dy = p2.y - p1.y;

        this.c1 = p2;
        this.c2 = createVector(p1.x - dy, p1.y + dx);
        this.c3 = createVector(p1.x - dx, p1.y - dy);
        this.c4 = createVector(p1.x + dy, p1.y - dx);
    }

    drawShape() {
        quad(
            this.c1.x, this.c1.y,
            this.c2.x, this.c2.y,
            this.c3.x, this.c3.y,
            this.c4.x, this.c4.y
        );
    }
}

class StringTheory extends Shape {
    static NUM_POINTS = 11;
    static WOBBLE = 0.01;

    constructor(p1, p2, p3, systemParams) {
        super(p1, p2, p3, systemParams);

        let diff = p5.Vector.sub(p2, p1);

        let angle = (2 * Math.PI) / StringTheory.NUM_POINTS;
        this.ps = Array.from({ length: StringTheory.NUM_POINTS }, (_, i) => {
            diff.rotate(angle);
            let amount = noise(StringTheory.WOBBLE * frameCount + i * 100);
            let p = p5.Vector.mult(diff, amount);
            p.add(p1);
            return p;
        });
    }

    drawShape() {
        beginShape();
        // first controlpoint
        curveVertex(this.ps[StringTheory.NUM_POINTS - 1].x, this.ps[StringTheory.NUM_POINTS - 1].y);

        // only these points are drawn
        this.ps.forEach(p => curveVertex(p.x, p.y));
        curveVertex(this.ps[0].x, this.ps[0].y);

        // end controlpoint
        curveVertex(this.ps[1].x, this.ps[1].y);
        endShape();
    }
}

class Attractor {
    constructor(params, scale = 1, speedUp = 1, xShift = 0, yShift = 0, zShift = 0) {
        this.params = params;
        this.scale = scale;
        this._dt = dT * speedUp;
        this.xShift = xShift / SCALE;
        this.yShift = yShift / SCALE;
        this.zShift = zShift / SCALE;

        this._fc = frameCount;
    }

    start(x, y, z) {
        this._v = createVector(x, y, z);
    }

    dvdt() {
        throw new Error("dvdt() method must be implemented in child class");
    }

    step() {
        if (frameCount == this._fc) return;

        let dvdt = this.dvdt();
        dvdt.mult(this.dT());
        this._v.add(dvdt);
        this._fc = frameCount;
    }

    dT() {
        return this._dt;
    }

    V() {
        let v = p5.Vector.mult(this._v, this.scale);
        v.add(this.xShift, this.yShift, this.zShift);
        return v;
    }

    X() {
        return this._v.x * this.scale + this.xShift;
    }

    Y() {
        return this._v.y * this.scale + this.yShift;
    }

    Z() {
        return this._v.z * this.scale + this.zShift;
    }

    pointXY() {
        return createVector(this.X(), this.Y());
    }

    pointYZ() {
        return createVector(this.Y(), this.Z());
    }

    pointZX() {
        return createVector(this.Z(), this.X());
    }
}

class Noise extends Attractor {
    constructor(scale, speedUp = dT) {
        super(undefined, scale, speedUp);
        this.speedUp = speedUp;

        this._v = createVector(
            2 * random() - 1,
            2 * random() - 1,
            2 * random() - 1
        );
    }

    step() {
        if (frameCount == this._fc) return;

        this._v = createVector(
            2 * noise(this.speedUp * frameCount) - 1,
            2 * noise(this.speedUp * frameCount + 100) - 1,
            2 * noise(this.speedUp * frameCount + 1000) - 1
        )

        this._fc = frameCount;
    }
}

class Lorenz extends Attractor {
    constructor(params, scale, speedUp, xShift, yShift, zShift) {
        super(params, scale, speedUp, xShift, yShift, zShift);
    }

    dvdt() {
        const dxdt = this.params.sigma * (this._v.y - this._v.x);
        const dydt = this._v.x * (this.params.rho - this._v.z) - this._v.y;
        const dzdt = this._v.x * this._v.y - this.params.beta * this._v.z;
        return createVector(dxdt, dydt, dzdt);
    }
}

class Rossler extends Attractor {
    constructor(params, scale, speedUp, xShift, yShift, zShift) {
        super(params, scale, speedUp, xShift, yShift, zShift);
    }

    dvdt() {
        const dxdt = -this._v.y - this._v.z;
        const dydt = this._v.x + this.params.a * this._v.y;
        const dzdt = this.params.b + this._v.z * (this._v.x - this.params.c);
        return createVector(dxdt, dydt, dzdt);
    }
}

class Thomas extends Attractor {
    constructor(params, scale, speedUp, xShift, yShift, zShift) {
        super(params, scale, speedUp, xShift, yShift, zShift);
    }

    dvdt() {
        const dxdt = sin(this._v.y) - this.params.b * this._v.x;
        const dydt = sin(this._v.z) - this.params.b * this._v.y;
        const dzdt = sin(this._v.x) - this.params.b * this._v.z;
        return createVector(dxdt, dydt, dzdt);
    }
}

class Linear extends Attractor {
    constructor(attractor1, attractor2) {
        super();
        this.attractor1 = attractor1;
        this.attractor2 = attractor2;
    }

    step() {
        this.attractor1.step();
        this.attractor2.step();

        this._v = this.applyLinearTransform(this.attractor1.V(), this.attractor2.V());
    }

    applyLinearTransform(v1, v2) {
        throw new Error("applyLinearTransform() method must be implemented in child class");
    }
}

class Additive extends Linear {
    applyLinearTransform(v1, v2) {
        return p5.Vector.add(v1, v2);
    }
}

class AverageArithmetic extends Linear {
    applyLinearTransform(v1, v2) {
        let v = p5.Vector.add(v1, v2);
        v.div(2);
        return v;
    }
}

class Triple extends Attractor {
    constructor(attractor1, attractor2, attractor3) {
        super();
        this.attractor1 = attractor1;
        this.attractor2 = attractor2;
        this.attractor3 = attractor3 ? attractor3 : attractor3;
    }

    step() {
        this.attractor1.step();
        this.attractor2.step();
        this.attractor3 ? this.attractor3.step() : undefined;
    }

    pointXY() {
        return this.attractor1.pointXY();
    }

    pointYZ() {
        return this.attractor2.pointYZ();
    }

    pointZX() {
        return this.attractor3 ? this.attractor3.pointZX() : this.attractor2.pointZX();
    }
}

class __Only extends Attractor {
    constructor(attractor) {
        super();
        this.attractor = attractor;
    }

    step() {
        this.attractor.step();
    }

    V() {
        return this.attractor.V();
    }

    X() {
        return this.attractor.X();
    }

    Y() {
        return this.attractor.Y();
    }

    Z() {
        return this.attractor.Z();
    }
}

class XYOnly extends __Only {
    constructor(attractor) {
        super(attractor);
    }

    pointYZ() {
        return this.pointXY();
    }

    pointZX() {
        return this.pointXY();
    }
}

class YZOnly extends __Only {
    constructor(attractor) {
        super(attractor);
    }

    pointXY() {
        return this.pointYZ();
    }

    pointZX() {
        return this.pointYZ();
    }
}

class ZXOnly extends __Only {
    constructor(attractor) {
        super(attractor);
    }

    pointXY() {
        return this.pointZX();
    }

    pointYZ() {
        return this.pointZX();
    }
}

class System {
    constructor(attractor, systemParams) {
        this.attractor = attractor;
        this.systemParams = systemParams;

        this.shapes = [];
        this.shift = 0;

        this.loc_p = undefined;
        this.dist_p = undefined;
        this.col_p = undefined;
    }

    step() {
        this.attractor.step();

        this.loc_p = this.attractor.pointXY();
        this.dist_p = this.attractor.pointYZ();
        this.col_p = this.attractor.pointZX();

        var c = new this.systemParams.shapeClass(
            this.loc_p,
            this.dist_p,
            this.col_p,
            this.systemParams
        );
        this.push(c);

        return this;
    }

    draw() {
        let n = this.shapes.length
        for (let i = 0; i < n; i++) {
            let a = map((i + 1) / n, 0, 1, MIN_ALPHA, MAX_ALPHA);
            let idx = (i + this.shift) % n;
            this.shapes[idx].draw(a * 255);
        }

        if (this.systemParams.guideOn) {
            drawP('indianred', this.loc_p);
            drawP('cornflowerblue', this.dist_p);
            this.systemParams.colorOn ? drawP('mediumseagreen', this.col_p) : undefined;
        }
    }

    push(shape) {
        if (this.shapes.length > NUM_OBJS) {
            this.shapes[this.shift] = shape;
            this.shift = (this.shift + 1) % NUM_OBJS;
        } else {
            this.shapes.push(shape);
        }
    }
}

function calibrateScreen() {
    WIDTH = window.innerWidth || document.documentElement.clientWidth;
    HEIGHT = window.innerHeight || document.documentElement.clientHeight;
    SCALE = 4 * (Math.min(WIDTH, HEIGHT) / 1000);
    createCanvas(WIDTH, HEIGHT);
}

function setup() {
    calibrateScreen();

    frameRate(60);
    colorMode(HSB, 100, 100, 100, 255);
    randomSeed(SEED);
    noiseSeed(SEED);

    let MIN_DIM = Math.min(WIDTH, HEIGHT);

    noisy = new Noise(MIN_DIM / (2 * SCALE), 0.002);
    noisy_tiny = new Noise(MIN_DIM / (20 * SCALE), 0.002);

    lorenz = new Lorenz(LORENZ_PARAMS, 5, 1, 0, 0, -MIN_DIM / 2); lorenz.start(2, 1, 1);
    lorenz_tiny = new Lorenz(LORENZ_PARAMS, 1, 1, 0, 0, -MIN_DIM / 2); lorenz_tiny.start(2, 1, 1);
    lorenz_v2 = new Lorenz(LORENZ_PARAMS_V2, 5); lorenz_v2.start(2, 1, 1);
    lorenz_fast = new Lorenz(LORENZ_PARAMS, 3, 5); lorenz_fast.start(2, 1, 1);

    rossler = new Rossler(ROSSLER_PARAMS, 5, 3, 0, 0, - MIN_DIM / 3); rossler.start(-10, -10, -10);
    rossler_fast = new Rossler(ROSSLER_PARAMS, 5, 6, 0, 0, - MIN_DIM / 3); rossler_fast.start(-10, -10, -10);
    rossler_tiny = new Rossler(ROSSLER_PARAMS, 2.5, 3, 0, 0, - MIN_DIM / 3); rossler_tiny.start(-10, -10, -10);
    rossler_v2 = new Rossler(ROSSLER_PARAMS_V2, 3); rossler_v2.start(-10, -10, -10);
    // rossler_v3 = new Rossler(ROSSLER_PARAMS_V3, 5, 3, 0, 0, - MIN_DIM / 3); rossler_v3.start(-10, -10, -10);

    thomas = new Thomas(THOMAS_PARAMS, 25, 25); thomas.start(random(-1, 1), random(-1, 1), random(-1, 1));
    // thomas_v2 = new Thomas(THOMAS_PARAMS_V2, 25, 25); thomas_v2.start(10, -2.5, 7.5);
    thomas_fast = new Thomas(THOMAS_PARAMS, 25, 50); thomas_fast.start(random(-1, 1), random(-1, 1), random(-1, 1));
    thomas_tiny = new Thomas(THOMAS_PARAMS, 5, 25); thomas_tiny.start(random(-1, 1), random(-1, 1), random(-1, 1));
    thomas_fast_tiny = new Thomas(THOMAS_PARAMS, 5, 50); thomas_fast_tiny.start(random(-1, 1), random(-1, 1), random(-1, 1));

    lorenz_noisy = new Additive(lorenz, noisy);
    rossler_noisy = new Additive(rossler, noisy);
    thomas_noisy = new Additive(thomas, noisy);

    avga_lorenz_rossler = new AverageArithmetic(lorenz, rossler);
    avga_lorenz_thomas = new AverageArithmetic(lorenz, thomas);
    avga_rossler_thomas = new AverageArithmetic(rossler, thomas);

    // avga_lorenz_rossler_v2 = new AverageArithmetic(lorenz_v2, rossler_v2);
    // avga_lorenz_thomas_v2 = new AverageArithmetic(lorenz_v2, thomas_v2);
    // avga_rossler_thomas_v2 = new AverageArithmetic(rossler_v2, thomas_v2);

    // triple1 = new Triple(lorenz, rossler, thomas);
    // triple2 = new Triple(lorenz, thomas, rossler);
    // triple3 = new Triple(rossler, thomas, lorenz);
    // triple4 = new Triple(rossler, lorenz, thomas);
    // triple5 = new Triple(thomas, lorenz, rossler);
    // triple6 = new Triple(thomas, rossler, lorenz);

    // wut = noisy;

    // wut = lorenz; // 1
    // wut = rossler; // 2
    // wut = thomas; // 3

    // wut = new AverageArithmetic(lorenz, rossler); // 4
    // wut = new Additive(lorenz, rossler_tiny); // 5
    // wut = new YZOnly(rossler); // 6

    // wut = new Triple(lorenz, rossler, thomas); // 7 + 8 + 9 + 10
    // wut = new Triple(lorenz, thomas, rossler);
    // wut = new Triple(rossler, lorenz, thomas);

    // wut = new AverageArithmetic(new AverageArithmetic(lorenz, rossler), thomas);

    // wut = new Triple(rossler, new XYOnly(rossler_tiny), rossler_noisy);

    // wut = new Triple(
    //     rossler,
    //     new XYOnly(new Additive(rossler, thomas_fast_tiny))
    // ); // breathing chromatic worm

    // wut = new Triple(
    //     new Additive(rossler, noisy),
    //     new XYOnly(new Additive(new Additive(rossler, noisy), thomas_fast_tiny))
    // ); // breathing chromatic worm + noisy wandering

    // wut = new Triple(
    //     new Additive(rossler, noisy),
    //     new XYOnly(new Additive(new Additive(rossler, noisy), new Additive(lorenz_tiny, thomas_fast_tiny)))
    // ); // breathing chromatic worm + noisy wandering + a little more twisty

    // wut = new Triple(
    //     lorenz,
    //     new XYOnly(new Additive(lorenz, rossler_tiny))
    // ); // multi-pointed star

    // wut = new Triple(
    //     new Additive(lorenz, rossler_tiny),
    //     new XYOnly(new Additive(lorenz, new Additive(rossler_tiny, thomas_tiny))),
    //     thomas_fast,
    // ); // kinda wormy // 11

    wut = new Triple(
        new Additive(lorenz, rossler_tiny),
        new Additive(lorenz, new Additive(new XYOnly(rossler_fast), thomas_tiny)),
        new XYOnly(rossler),
    ); // kaleidoscope

    // wut = new Triple(
    //     new Additive(lorenz, rossler_tiny),
    //     new XYOnly(new Additive(lorenz, new Additive(rossler_fast, thomas_tiny))),
    //     new XYOnly(rossler),
    // ); // kaleidoscope 2

    systemParams = {
        // shapeClass: Point,
        // shapeClass: Circle,
        // shapeClass: Triangle,
        // shapeClass: Square,
        shapeClass: StringTheory,
        // guideOn: true,
        colorOn: true,
        brightnessOn: true,
    };

    system = new System(wut, systemParams);
}

function canvasSetup() {
    translate(WIDTH / 2, HEIGHT / 2);
    rotate(PI);
    scale(-SCALE, SCALE, SCALE);
    background(NEGATE ? 0 : 100);
}

function draw() {
    canvasSetup();

    system.step().draw();
}
