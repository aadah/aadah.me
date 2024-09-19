var WIDTH;
var HEIGHT;
var SCALE;
var SHIFT_X;
var SHIFT_Y;

const FONT_SIZE = 300;
const SPACE_WIDTH = 150;

var AMBIENT_VOLUME = 0;

const FPS = 60;

const WORD = "SCREAM";
const NUM_COPIES = 20;

var SAMPLED_VOLS = Array(3 * FPS).fill(1);
var SAMPLED_VOLS_IDX = 0;

var font;
var COPIES;
var fontPath;

var ANALYZER;

function initAnalyzer() {
    navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
            const audio = stream.getAudioTracks()[0];
            console.log("got audio", audio);
            stream.onremovetrack = () => {
                console.log("audio removed");
            };

            const context = new AudioContext();
            const source = context.createMediaStreamSource(stream);

            ANALYZER = context.createAnalyser();
            source.connect(ANALYZER);
            ANALYZER.fftSize = 256;
        })
        .catch((error) => {
            console.error("Error getting audio", error);
        });
}

function getVolume() {
    if (ANALYZER) {
        const bufferLength = ANALYZER.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        ANALYZER.getByteFrequencyData(dataArray);

        let totalEnergy = 0;
        for (let i = 0; i < bufferLength; i++) {
            totalEnergy += dataArray[i];
        }

        let maxEnergy = bufferLength * 255 / 2;

        return min(1.0, totalEnergy / maxEnergy);
    }

    return 0;
}

function setupCanvas() {
    WIDTH = window.innerWidth || document.documentElement.clientWidth;
    HEIGHT = window.innerHeight || document.documentElement.clientHeight;
    let scaleX = WIDTH / 1280;
    let scaleY = HEIGHT / 720;
    SCALE = Math.min(scaleX, scaleY);
    SHIFT_X = (WIDTH - (SPACE_WIDTH * SCALE * 6.35)) / 2;
    SHIFT_Y = SPACE_WIDTH * 0.5 * SCALE + HEIGHT / 2;
    createCanvas(WIDTH, HEIGHT);
}

function setup() {
    setupCanvas();
    frameRate(FPS);

    noLoop();

    opentype.load('/fonts/CoveredByYourGrace-Regular.otf', function (err, f) {
        if (err) {
            print(err);
        } else {
            font = f;
            letters = getLetters();
            COPIES = Array(NUM_COPIES).fill(letters);
            loop();
        }
    });

    initAnalyzer();
}

function orientCanvas() {
    translate(SHIFT_X, SHIFT_Y);
    scale(SCALE, SCALE, SCALE);
    background(0);
}

function draw() {
    if (!font) return;

    orientCanvas();

    let vol = getVolume();
    SAMPLED_VOLS[SAMPLED_VOLS_IDX] = vol;
    SAMPLED_VOLS_IDX += 1;
    SAMPLED_VOLS_IDX %= SAMPLED_VOLS.length;
    let avg_vol = SAMPLED_VOLS.reduce((acc, cur) => acc + cur, 0) / SAMPLED_VOLS.length;
    let factor = vol / avg_vol;

    noFill();
    strokeWeight(1);
    for (var j = 0; j < COPIES.length; j++) {
        push();
        let cpy = COPIES[j];
        for (var i = 0; i < cpy.length; i++) {
            drawLetter(cpy[i], factor);
            translate(SPACE_WIDTH, 0);
        }
        pop();
    }
}

function getPoints(c) {
    fontPath = font.getPath(c, 0, 0, FONT_SIZE);
    let path = new g.Path(fontPath.commands);
    path = g.resampleByLength(path, 25);
    // remove all commands without a coordinate
    for (let i = path.commands.length - 1; i >= 0; i--) {
        if (path.commands[i].x == undefined) {
            path.commands.splice(i, 1);
        }
    }
    return path.commands;
}

function drawLetter(pnts, factor) {
    let minFactor = 1.5;
    let factorDiff = factor - minFactor;

    let wiggle = factor * 5;
    let c = factor > minFactor ? factorDiff * 255 : 0;

    stroke(255, 255 - c, 255 - c);
    beginShape();
    for (let i = 0; i < pnts.length; i++) {
        let dx = random(-wiggle, wiggle);
        let dy = random(-wiggle, wiggle);
        vertex(pnts[i].x + dx, pnts[i].y + dy);
    }
    vertex(
        pnts[0].x + random(-wiggle, wiggle),
        pnts[0].y + random(-wiggle, wiggle)
    );
    endShape();
}

function getLetters() {
    let letters = WORD.split('');
    return letters.map(getPoints)
}
