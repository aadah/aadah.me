const RATIO = 5.4 / 3.2; // reference: https://www.britannica.com/topic/hanafuda
const SPEED = 0.002;
const END_FRAC = 0.99;
const NUM_SITES = 2500;
const MIN_DIST = 5;

// reference: https://www.shecodes.io/palettes/322
const EARTH_LIGHT = '#414141';
const EARTH_MEDIUM = '#313131';
const EARTH_DARK = '#101010';

// reference: https://www.shecodes.io/palettes/346
const SKY_LIGHT = '#c22828';
const SKY_MEDIUM = '#8a0f0f';
const SKY_DARK = '#3c0303';

// reference: https://www.shecodes.io/palettes/1667
const MOON_LIGHT = '#fffdf6';
const MOON_MEDIUM = '#faf6e9';
const MOON_DARK = '#ece8d9';

var WIDTH;
var HEIGHT;
var MOON_DIAMETER_START;
var MOON_DIAMETER_END;
var EARTH_HORIZON_START;
var EARTH_HORIZON_END;
var VORONOI;
var COLORS = {};

p5.prototype.voronoiGetColor = function (cellId) {
    return COLORS[cellId];
}

function drawSky(frac) {
    let c = paletteLerp([
        // [SKY_LIGHT, 0],
        // [SKY_MEDIUM, 0.8],
        // [SKY_DARK, END_FRAC],
        [SKY_LIGHT, 0],
        [SKY_MEDIUM, END_FRAC],
    ], frac);
    background(c);
}

function drawMoon(frac) {
    let c = paletteLerp([
        [MOON_DARK, 0],
        [MOON_MEDIUM, 0.8],
        [MOON_LIGHT, END_FRAC],
    ], frac);
    fill(c);

    let x = lerp(4 * width / 5, width / 3, frac);
    let y = lerp(3 * height / 5, height / 3, frac);

    let diameter = lerp(MOON_DIAMETER_START, MOON_DIAMETER_END, frac);
    circle(x, y, diameter);
}

function moonInfo(frac) {
    let x = lerp(4 * width / 5, width / 3, frac);
    let y = lerp(3 * height / 5, height / 3, frac);
    let r = lerp(MOON_DIAMETER_START, MOON_DIAMETER_END, frac) / 2;
    return { x: x, y: y, r: r };
}

function drawEarth(frac) {
    let c = paletteLerp([
        [EARTH_LIGHT, 0],
        [EARTH_MEDIUM, 0.5],
        [EARTH_DARK, END_FRAC],
    ], frac);
    fill(c);

    let pointCount = 100;
    let amplitude = height / 20;
    let freq = (2 / 3) * TAU / width;

    beginShape();
    for (var i = 0; i <= pointCount; i++) {
        let x = map(i, 0, pointCount, 0, width);
        let y = sin((x + (frameCount * (1 - frac))) * freq);
        y *= amplitude;
        y += lerp(EARTH_HORIZON_START, EARTH_HORIZON_END, frac);
        vertex(x, y);
    }
    vertex(width, height);
    vertex(0, height);
    endShape();
}

function setup() {
    let canvas = document.getElementById("canvas");

    // remove any element-specific width so that it defaults to dynamic one
    canvas.style.width = null;

    WIDTH = canvas.clientWidth;
    HEIGHT = WIDTH * RATIO;

    MOON_DIAMETER_START = WIDTH / 5;
    MOON_DIAMETER_END = WIDTH / 2;

    EARTH_HORIZON_START = HEIGHT / 2;
    EARTH_HORIZON_END = 2 * HEIGHT / 3

    frameRate(60);

    createCanvas(WIDTH, HEIGHT, canvas);

    noStroke();

    // setupVoronoi();
}

function draw() {
    let frac = 1 - Math.exp(-SPEED * frameCount);

    drawSky(frac);
    drawMoon(frac);
    drawEarth(frac);

    if (frac > END_FRAC) {
        noLoop();
    }

    // drawVoronoi(frac);
    // noLoop();
}


function setupVoronoi() {
    //Settings for drawing(these are the default values)

    //Set Cell Stroke Weight
    voronoiCellStrokeWeight(0);
    //Set Site Stroke Weight
    voronoiSiteStrokeWeight(0);
    //Set Cell Stroke
    // voronoiCellStroke(0);

    voronoiRndSites(NUM_SITES, MIN_DIST); // create sites

    voronoi(width, height, true); // build diagram
    VORONOI = voronoiGetDiagram(); // get raw structure
}

function drawVoronoi(frac) {
    // frac = 0.99

    info = moonInfo(frac);

    VORONOI.cells.forEach((cell) => {
        var c;
        if (dist(cell.site.x, cell.site.y, info.x, info.y) <= info.r) {
            c = random([MOON_LIGHT, MOON_MEDIUM, MOON_DARK]);
        } else {
            c = random([SKY_LIGHT, SKY_MEDIUM, SKY_DARK]);
        }
        COLORS[cell.site.voronoiId] = c;
        voronoiDrawCell(
            cell.site.x,
            cell.site.y,
            cell.site.voronoiId,
            VOR_CELLDRAW_SITE,
            // true, false);
            true, false);
    });
}

function redraw() {
    setup();
    draw();
}
