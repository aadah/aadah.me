/*global $*/

var ctx;

window.requestAnimationFrame =
	window.requestAnimationFrame || // Chrome
	window.mozRequestAnimationFrame || // Firefox
	window.oRequestAnimationFrame || // Newer versions of Opera
	window.webkitRequestAnimationFrame || // Safari
	window.msRequestAnimationFrame || // IE
	function (callback) { // Older versions of Opera
		'use strict';

		setInterval(function () {
			callback();
		}, 1000 / 60);
	};

function print() {
	'use strict';

	window.console.log.apply(window.console, arguments);
}

function clamp(num, min, max) {
	'use strict';

	if (num < min) {
		return min;
	} else if (num > max) {
		return max;
	}

	return num;
}

function clampInt(num, min, max) {
	'use strict';

	if (num < min) {
		return min;
	} else if (num > max) {
		return max;
	}

	return Math.round(num);
}

function rand(lower, upper) {
	'use strict';

	var diff = upper - lower,
		delta = Math.random() * diff;

	return lower + delta;
}

function randInt(lower, upper) {
	'use strict';

	var diff = upper - lower,
		delta = Math.random() * diff;

	return Math.round(lower + delta);
}

function getWindowWidth() {
	'use strict';

	return window.innerWidth;
}

function getWindowHeight() {
	'use strict';

	return window.innerHeight;
}

function getCanvasWidth() {
	'use strict';

	return $('#cloud')[0].width;
}

function getCanvasHeight() {
	'use strict';

	return $('#cloud')[0].height;
}

function resize() {
	'use strict';

	ctx.canvas.width = getWindowWidth();
	ctx.canvas.height = getWindowHeight();
}

function repaint(hex) {
	'use strict';

	ctx.clearRect(0, 0, getCanvasWidth(), getCanvasHeight());
	ctx.fillStyle = hex || '#ffffff';
	ctx.fillRect(0, 0, getCanvasWidth(), getCanvasHeight());
}

/*
	Class: Color

	A simple color class. The representation is through standard RGB values
	where each channel is represented by an interger in the range [0,255],
	inclusive. A new Color with no parameters passed will automatically
	assign random RGB values.

	param red: An integer. If a Number is given, it will be clamped to the
		range [0,255]. Anything else will cause a random integer assignment.
	param green: An integer. If a Number is given, it will be clamped to the
		range [0,255]. Anything else will cause a random integer assignment.
	param blue: An integer. If a Number is given, it will be clamped to the
		range [0,255]. Anything else will cause a random integer assignment.
*/
function Color(red, green, blue) {
	'use strict';

	var r = red,
		g = green,
		b = blue;

	this.getRed = function () {
		return r;
	};

	this.getGreen = function () {
		return g;
	};

	this.getBlue = function () {
		return b;
	};

	this.setRed = function (red) {
		if (typeof red === 'number') {
			r = clampInt(red, 0, 255);
			return true;
		} else {
			r = randInt(0, 255);
			return false;
		}
	};

	this.setGreen = function (green) {
		if (typeof green === 'number') {
			g = clampInt(green, 0, 255);
			return true;
		} else {
			g = randInt(0, 255);
			return false;
		}
	};

	this.setBlue = function (blue) {
		if (typeof blue === 'number') {
			b = clampInt(blue, 0, 255);
			return true;
		} else {
			b = randInt(0, 255);
			return false;
		}
	};

	this.setColor = function (red, green, blue) {
		var r_bool = this.setRed(red),
			g_bool = this.setGreen(green),
			b_bool = this.setBlue(blue);

		return r_bool && g_bool && b_bool;
	};

	this.toRGB = function () {
		var rgb = 'rgb(' + this.getRed() + ',' + this.getGreen() + ',' + this.getBlue() + ')';

		return rgb;
	};

	this.toHex = function () {
		var rhex = this.getRed().toString(16),
			ghex = this.getGreen().toString(16),
			bhex = this.getBlue().toString(16),
			hex;

		rhex = rhex.length === 1 ? '0' + rhex : rhex;
		ghex = ghex.length === 1 ? '0' + ghex : ghex;
		bhex = bhex.length === 1 ? '0' + bhex : bhex;
		hex = '#' + rhex + ghex + bhex;

		return hex;
	};

	this.setColor(red, green, blue);
}

/*
	Class: Vector

	An abstract class for representing vectors. Representation is through
	the use of an x coordinate and a y coordinate.

	param x: A number. If something other than a Number is passed in (including
		nothing at all), a random number in the range [0,getCanvasWidth()]
		will be assigned.
	param y: A number. If something other than a Number is passed in (including
		nothing at all), a random number in the range [0,getCanvasHeight()]
		will be assigned.
*/
function Vector(x, y) {
	'use strict';

	var x_coor,
		y_coor;

	this.getXCoor = function () {
		return x_coor;
	};

	this.getYCoor = function () {
		return y_coor;
	};

	this.setXCoor = function (x) {
		if (typeof x === 'number') {
			x_coor = x;
		} else {
			x_coor = rand(0, getCanvasWidth());
		}
	};

	this.setYCoor = function (y) {
		if (typeof y === 'number') {
			y_coor = y;
		} else {
			y_coor = rand(0, getCanvasHeight());
		}
	};

	this.setCoor = function (x, y) {
		this.setXCoor(x);
		this.setYCoor(y);
	};

	this.setCoor(x, y);
}

function Particle() {
	'use strict';

	var	MIN_SPEED = 0,
		MAX_SPEED = 20,
		MIN_ABS_ACCEL = 0.1,
		MAX_ABS_ACCEL = 1,

		MIN_ABS_OMEGA = Math.PI / 180,
		MAX_ABS_OMEGA = Math.PI / 18,

		MIN_RADIUS = 1,
		MAX_RADIUS = 5,
		MIN_ABS_BREATH = 0.01,
		MAX_ABS_BREATH = 1.0,

		speed = rand(MIN_SPEED, MAX_SPEED),
		accel = rand(MIN_ABS_ACCEL, MAX_ABS_ACCEL),

		theta = rand(-Math.PI, Math.PI),
		omega = rand(MIN_ABS_OMEGA, MAX_ABS_OMEGA),

		radius = rand(MIN_RADIUS, MAX_RADIUS),
		breath = rand(MIN_ABS_BREATH, MAX_ABS_BREATH),

		pos = new Vector(rand(radius, getCanvasWidth() - radius), rand(radius, getCanvasHeight()) - radius),
		vel = new Vector(speed * Math.cos(theta), speed * Math.sin(theta)),

		color = new Color(speed / MAX_SPEED * 255, randInt(0, 255), randInt(0, 255)),

		attracted = false,
		repelled = false,
		alive = true;

	// getters
	this.getSpeed = function () {
		return speed;
	};

	this.getAccel = function () {
		return accel;
	};

	this.getTheta = function () {
		return theta;
	};

	this.getOmega = function () {
		return omega;
	};

	this.getRadius = function () {
		return radius;
	};

	this.getBreath = function () {
		return breath;
	};

	this.getX = function () {
		return pos.getXCoor();
	};

	this.getY = function () {
		return pos.getYCoor();
	};

	this.getColor = function () {
		return color;
	};

	this.isAttracted = function () {
		return attracted;
	};

	this.isRepelled = function () {
		return repelled;
	};

	this.isAlive = function () {
		return alive;
	};

	// setters
	this.setSpeed = function (new_speed) {
		if (typeof new_speed === 'number') {
			speed = clamp(new_speed, MIN_SPEED, MAX_SPEED);
			vel.setXCoor(speed * Math.cos(theta));
			vel.setYCoor(speed * Math.sin(theta));
			return true;
		} else {
			return false;
		}
	};

	this.setAccel = function (new_accel) {
		if (typeof new_accel === 'number') {
			speed = clamp(new_accel, MIN_ABS_ACCEL, MAX_ABS_ACCEL);
			return true;
		} else {
			return false;
		}
	};

	this.setTheta = function (new_theta) {
		if (typeof new_theta === 'number') {
			while (new_theta > Math.PI) {
				new_theta -= 2 * Math.PI;
			}
			while (new_theta < -Math.PI) {
				new_theta += 2 * Math.PI;
			}
			theta = new_theta;
			this.setSpeed(this.getSpeed());
			return true;
		} else {
			return false;
		}
	};

	this.setOmega = function (new_omega) {
		if (typeof new_omega === 'number') {
			omega = clamp(new_omega, MIN_ABS_OMEGA, MAX_ABS_OMEGA);
			return true;
		} else {
			return false;
		}
	};

	this.setRadius = function (new_radius) {
		if (typeof new_radius === 'number') {
			radius = clamp(new_radius, MIN_RADIUS, MAX_RADIUS);
			return true;
		} else {
			return false;
		}
	};

	this.setBreath = function (new_breath) {
		if (typeof new_breath === 'number') {
			breath = clamp(new_breath, MIN_ABS_BREATH, MAX_ABS_BREATH);
			return true;
		} else {
			return false;
		}
	};

	this.setX = function (x) {
		if (typeof x === 'number') {
			pos.setXCoor(clamp(x, radius, getCanvasWidth() - radius));
			return true;
		} else {
			return false;
		}
	};

	this.setY = function (y) {
		if (typeof y === 'number') {
			pos.setYCoor(clamp(y, radius, getCanvasHeight() - radius));
			return true;
		} else {
			return false;
		}
	};

	this.setColor = function (r, g, b) {
		return color.setColor(r, g, b);
	};

	this.setAttracted = function (new_attracted) {
		if (typeof new_attracted === 'boolean') {
			attracted = new_attracted;
			return true;
		} else {
			return false;
		}
	};

	this.setRepelled = function (new_repelled) {
		if (typeof new_repelled === 'boolean') {
			repelled = new_repelled;
			return true;
		} else {
			return false;
		}
	};

	this.setAlive = function (new_alive) {
		if (typeof new_alive === 'boolean') {
			alive = new_alive;
			return true;
		} else {
			return false;
		}
	};

	// special functions
	this.update = function (mouse_x, mouse_y) {
		var r,
			g,
			b;

		this.interaction(mouse_x, mouse_y);

		if (this.isAlive()) {
			this.setTheta(theta + omega * rand(-1, 1));
			this.setSpeed(speed + accel * rand(-1, 1));
			this.setRadius(radius + breath * rand(-1, 1));
		}

		if (this.getX() > getCanvasWidth() - radius || this.getX() < radius) {
			this.setTheta(-theta + Math.PI);
		}
		if (this.getY() > getCanvasHeight() - radius || this.getY() < radius) {
			this.setTheta(-theta);
		}

		pos.setXCoor(pos.getXCoor() + vel.getXCoor());
		pos.setYCoor(pos.getYCoor() + vel.getYCoor());

		r = speed / MAX_SPEED * 255;
		color.setRed(r);
	};

	this.interaction = function (mouse_x, mouse_y) {
		var dx,
			dy,
			desired,
			angdiff,
			atan2;

		dx = mouse_x - this.getX();
		dy = mouse_y - this.getY();
		atan2 = Math.atan2(dy, dx);
		if (this.isAttracted() && !this.isRepelled()) {
			desired = atan2;
			angdiff = desired - this.getTheta();
			this.adjustAngle(angdiff);
		} else if (!this.isAttracted() && this.isRepelled()) {
			desired = atan2 > 0 ? atan2 - Math.PI : atan2 + Math.PI;
			angdiff = desired - this.getTheta();
			this.adjustAngle(angdiff);
		} else if (this.isAttracted() && this.isRepelled()) {
			this.setSpeed(this.getSpeed() - rand(0,1)*this.getAccel());
		}
	};

	this.adjustAngle = function (angdiff) {
		if ((angdiff > 0 && Math.abs(angdiff) <= Math.PI) || (angdiff < 0 && Math.abs(angdiff) > Math.PI)) {
			this.setTheta(this.getTheta() + this.getOmega());
		} else if ((angdiff > 0 && Math.abs(angdiff) > Math.PI) || (angdiff < 0 && Math.abs(angdiff) <= Math.PI)){
			this.setTheta(this.getTheta() - this.getOmega());
		}
	};

	this.draw = function () {
		ctx.beginPath();
		ctx.fillStyle = color.toHex();
		ctx.arc(pos.getXCoor(), pos.getYCoor(), radius, 0, 2 * Math.PI);
		ctx.fill();
	};

	this.reset = function () {
		speed = rand(MIN_SPEED, MAX_SPEED);
		accel = rand(MIN_ABS_ACCEL, MAX_ABS_ACCEL);

		theta = rand(-Math.PI, Math.PI);
		omega = rand(MIN_ABS_OMEGA, MAX_ABS_OMEGA);

		radius = rand(MIN_RADIUS, MAX_RADIUS);
		breath = rand(MIN_ABS_BREATH, MAX_ABS_BREATH);

		pos = new Vector(rand(radius, getCanvasWidth() - radius), rand(radius, getCanvasHeight()) - radius);
		vel = new Vector(speed * Math.cos(theta), speed * Math.sin(theta));

		color = new Color(speed / MAX_SPEED * 255, randInt(0, 255), randInt(0, 255));

		attracted = false;
		repelled = false;
		alive = true;
	};

	this.printInfo = function () {
		print('\n');
		print('Speed:\t', speed.toFixed(3), '\t', 'Accel:\t', accel.toFixed(3));
		print('Theta:\t', theta.toFixed(3), '\t', 'Omega:\t', omega.toFixed(3));
		print('Radius:\t', radius.toFixed(3), '\t', 'Breath:\t', breath.toFixed(3));
		print('Position:\t', this.getX().toFixed(3), '\t', this.getY().toFixed(3));
		print('Color:\t', color.toRGB());
	};
}

function App() {
	'use strict';

	var inView = false,
		num_particles = 500,
		particles = [],
		mouse_x = getCanvasWidth()/2,
		mouse_y = getCanvasHeight()/2;

	// main three
	this.setup = function () {
		$(document).resize(this.resize);
		$(document).keypress(this.keyPress);
		$('#cloud').mousemove(this.mousemove);

		resize();
		repaint();

		var i;
		for (i = 0; i < num_particles; i += 1) {
			particles[i] = new Particle();
		}
	};

	this.update = function () {
		var i;
		for (i = 0; i < particles.length; i += 1) {
			particles[i].update(mouse_x, mouse_y);
		}
	};

	this.draw = function () {
		repaint();

		var i;
		for (i = 0; i < particles.length; i += 1) {
			particles[i].draw();
		}
	};

	// event handlers
	this.keyPress = function (event) {
		var i;
		switch (event.charCode) {
		case 97: // a[live]
			for (i = 0; i < particles.length; i += 1) {
				particles[i].setAlive(!particles[i].isAlive());
			}
			break;

		case 114: // r[eset]
			for (i = 0; i < particles.length; i += 1) {
				particles[i].reset();
			}
			break;

		case 118: // v[iew]
			if (inView) {
				$('#cloud').animate({
					opacity: 0
				}, 500, function () {
					$('#cloud').css('display', 'none');
				});
			} else {
				$('#cloud').css('display', 'block');
				$('#cloud').animate({
					opacity: 1
				}, 500);
			}
			inView = !inView;
			break;

		case 49: // [1] attract
			for (i = 0; i < particles.length; i += 1) {
				var attracted = particles[i].isAttracted();
				particles[i].setAttracted(!attracted);
			}
			break;

		case 50: // [2] repel
			for (i = 0; i < particles.length; i += 1) {
				var repelled = particles[i].isRepelled();
				particles[i].setRepelled(!repelled);
			}
			break;
		}
	};

	this.resize = function () {
		resize();

		var i;
		for (i = 0; i < particles.length; i += 1) {
			particles[i].reset();
		}
	};

	this.mousemove = function (event) {
		mouse_x = event.pageX;
		mouse_y = event.pageY;
	};
}

$(function () {
	'use strict';

	ctx = $('#cloud')[0].getContext('2d');

	var app = new App();

	app.setup();

	function run() {
		app.update();
		app.draw();
		window.requestAnimationFrame(run);
	}

	window.requestAnimationFrame(run);
});
