/* global $ */

var ctx

window.requestAnimationFrame =
window.requestAnimationFrame || // Chrome
window.mozRequestAnimationFrame || // Firefox
window.oRequestAnimationFrame || // Newer versions of Opera
window.webkitRequestAnimationFrame || // Safari
window.msRequestAnimationFrame || // IE
function (callback) { // Older versions of Opera
  setInterval(function () {
    callback()
  }, 1000 / 60)
}

function print () {
  window.console.log.apply(window.console, arguments)
}

function clamp (num, min, max) {
  if (num < min) {
    return min
  } else if (num > max) {
    return max
  }

  return num
}

function clampInt (num, min, max) {
  if (num < min) {
    return min
  } else if (num > max) {
    return max
  }

  return Math.round(num)
}

function rand (lower, upper) {
  var diff = upper - lower
  var delta = Math.random() * diff

  return lower + delta
}

function randInt (lower, upper) {
  var diff = upper - lower
  var delta = Math.random() * diff

  return Math.round(lower + delta)
}

function getWindowWidth () {
  return window.innerWidth
}

function getWindowHeight () {
  return window.innerHeight
}

function getCanvasWidth () {
  return $('#cloud')[0].width
}

function getCanvasHeight () {
  return $('#cloud')[0].height
}

function resize () {
  ctx.canvas.width = getWindowWidth()
  ctx.canvas.height = getWindowHeight()
}

function repaint (hex) {
  ctx.clearRect(0, 0, getCanvasWidth(), getCanvasHeight())
  ctx.fillStyle = hex || '#ffffff'
  ctx.fillRect(0, 0, getCanvasWidth(), getCanvasHeight())
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
function Color (red, green, blue) {
  var r = red
  var g = green
  var b = blue

  this.getRed = function () {
    return r
  }

  this.getGreen = function () {
    return g
  }

  this.getBlue = function () {
    return b
  }

  this.setRed = function (red) {
    if (typeof red === 'number') {
      r = clampInt(red, 0, 255)
      return true
    } else {
      r = randInt(0, 255)
      return false
    }
  }

  this.setGreen = function (green) {
    if (typeof green === 'number') {
      g = clampInt(green, 0, 255)
      return true
    } else {
      g = randInt(0, 255)
      return false
    }
  }

  this.setBlue = function (blue) {
    if (typeof blue === 'number') {
      b = clampInt(blue, 0, 255)
      return true
    } else {
      b = randInt(0, 255)
      return false
    }
  }

  this.setColor = function (red, green, blue) {
    var rBool = this.setRed(red)
    var gBool = this.setGreen(green)
    var bBool = this.setBlue(blue)

    return rBool && gBool && bBool
  }

  this.toRGB = function () {
    var rgb = 'rgb(' + this.getRed() + ',' + this.getGreen() + ',' + this.getBlue() + ')'

    return rgb
  }

  this.toHex = function () {
    var rHex = this.getRed().toString(16)
    var gHex = this.getGreen().toString(16)
    var bHex = this.getBlue().toString(16)
    var hex

    rHex = rHex.length === 1 ? '0' + rHex : rHex
    gHex = gHex.length === 1 ? '0' + gHex : gHex
    bHex = bHex.length === 1 ? '0' + bHex : bHex
    hex = '#' + rHex + gHex + bHex

    return hex
  }

  this.setColor(red, green, blue)
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
function Vector (x, y) {
  var xCoor
  var yCoor

  this.getXCoor = function () {
    return xCoor
  }

  this.getYCoor = function () {
    return yCoor
  }

  this.setXCoor = function (x) {
    if (typeof x === 'number') {
      xCoor = x
    } else {
      xCoor = rand(0, getCanvasWidth())
    }
  }

  this.setYCoor = function (y) {
    if (typeof y === 'number') {
      yCoor = y
    } else {
      yCoor = rand(0, getCanvasHeight())
    }
  }

  this.setCoor = function (x, y) {
    this.setXCoor(x)
    this.setYCoor(y)
  }

  this.setCoor(x, y)
}

function Particle () {
  var MIN_SPEED = 0
  var MAX_SPEED = 20
  var MIN_ABS_ACCEL = 0.1
  var MAX_ABS_ACCEL = 1

  var MIN_ABS_OMEGA = Math.PI / 180
  var MAX_ABS_OMEGA = Math.PI / 18

  var MIN_RADIUS = 1
  var MAX_RADIUS = 5
  var MIN_ABS_BREATH = 0.01
  var MAX_ABS_BREATH = 1.0

  var speed = rand(MIN_SPEED, MAX_SPEED)
  var accel = rand(MIN_ABS_ACCEL, MAX_ABS_ACCEL)

  var theta = rand(-Math.PI, Math.PI)
  var omega = rand(MIN_ABS_OMEGA, MAX_ABS_OMEGA)

  var radius = rand(MIN_RADIUS, MAX_RADIUS)
  var breath = rand(MIN_ABS_BREATH, MAX_ABS_BREATH)

  var pos = new Vector(rand(radius, getCanvasWidth() - radius), rand(radius, getCanvasHeight()) - radius)
  var vel = new Vector(speed * Math.cos(theta), speed * Math.sin(theta))

  var color = new Color(speed / MAX_SPEED * 255, randInt(0, 255), randInt(0, 255))

  var attracted = false
  var repelled = false
  var alive = true

  // getters
  this.getSpeed = function () {
    return speed
  }

  this.getAccel = function () {
    return accel
  }

  this.getTheta = function () {
    return theta
  }

  this.getOmega = function () {
    return omega
  }

  this.getRadius = function () {
    return radius
  }

  this.getBreath = function () {
    return breath
  }

  this.getX = function () {
    return pos.getXCoor()
  }

  this.getY = function () {
    return pos.getYCoor()
  }

  this.getColor = function () {
    return color
  }

  this.isAttracted = function () {
    return attracted
  }

  this.isRepelled = function () {
    return repelled
  }

  this.isAlive = function () {
    return alive
  }

  // setters
  this.setSpeed = function (newSpeed) {
    if (typeof newSpeed === 'number') {
      speed = clamp(newSpeed, MIN_SPEED, MAX_SPEED)
      vel.setXCoor(speed * Math.cos(theta))
      vel.setYCoor(speed * Math.sin(theta))
      return true
    } else {
      return false
    }
  }

  this.setAccel = function (newAccel) {
    if (typeof newAccel === 'number') {
      speed = clamp(newAccel, MIN_ABS_ACCEL, MAX_ABS_ACCEL)
      return true
    } else {
      return false
    }
  }

  this.setTheta = function (newTheta) {
    if (typeof newTheta === 'number') {
      while (newTheta > Math.PI) {
        newTheta -= 2 * Math.PI
      }
      while (newTheta < -Math.PI) {
        newTheta += 2 * Math.PI
      }
      theta = newTheta
      this.setSpeed(this.getSpeed())
      return true
    } else {
      return false
    }
  }

  this.setOmega = function (newOmega) {
    if (typeof newOmega === 'number') {
      omega = clamp(newOmega, MIN_ABS_OMEGA, MAX_ABS_OMEGA)
      return true
    } else {
      return false
    }
  }

  this.setRadius = function (newRadius) {
    if (typeof newRadius === 'number') {
      radius = clamp(newRadius, MIN_RADIUS, MAX_RADIUS)
      return true
    } else {
      return false
    }
  }

  this.setBreath = function (newBreath) {
    if (typeof newBreath === 'number') {
      breath = clamp(newBreath, MIN_ABS_BREATH, MAX_ABS_BREATH)
      return true
    } else {
      return false
    }
  }

  this.setX = function (x) {
    if (typeof x === 'number') {
      pos.setXCoor(clamp(x, radius, getCanvasWidth() - radius))
      return true
    } else {
      return false
    }
  }

  this.setY = function (y) {
    if (typeof y === 'number') {
      pos.setYCoor(clamp(y, radius, getCanvasHeight() - radius))
      return true
    } else {
      return false
    }
  }

  this.setColor = function (r, g, b) {
    return color.setColor(r, g, b)
  }

  this.setAttracted = function (newAttracted) {
    if (typeof newAttracted === 'boolean') {
      attracted = newAttracted
      return true
    } else {
      return false
    }
  }

  this.setRepelled = function (newRepelled) {
    if (typeof newRepelled === 'boolean') {
      repelled = newRepelled
      return true
    } else {
      return false
    }
  }

  this.setAlive = function (newAlive) {
    if (typeof newAlive === 'boolean') {
      alive = newAlive
      return true
    } else {
      return false
    }
  }

  // special functions
  this.update = function (mouseX, mouseY) {
    var r

    this.interaction(mouseX, mouseY)

    if (this.isAlive()) {
      this.setTheta(theta + omega * rand(-1, 1))
      this.setSpeed(speed + accel * rand(-1, 1))
      this.setRadius(radius + breath * rand(-1, 1))
    }

    if (this.getX() > getCanvasWidth() - radius || this.getX() < radius) {
      this.setTheta(-theta + Math.PI)
    }
    if (this.getY() > getCanvasHeight() - radius || this.getY() < radius) {
      this.setTheta(-theta)
    }

    pos.setXCoor(pos.getXCoor() + vel.getXCoor())
    pos.setYCoor(pos.getYCoor() + vel.getYCoor())

    r = speed / MAX_SPEED * 255
    color.setRed(r)
  }

  this.interaction = function (mouseX, mouseY) {
    var dx,
      dy,
      desired,
      angdiff,
      atan2

    dx = mouseX - this.getX()
    dy = mouseY - this.getY()
    atan2 = Math.atan2(dy, dx)
    if (this.isAttracted() && !this.isRepelled()) {
      desired = atan2
      angdiff = desired - this.getTheta()
      this.adjustAngle(angdiff)
    } else if (!this.isAttracted() && this.isRepelled()) {
      desired = atan2 > 0 ? atan2 - Math.PI : atan2 + Math.PI
      angdiff = desired - this.getTheta()
      this.adjustAngle(angdiff)
    } else if (this.isAttracted() && this.isRepelled()) {
      this.setSpeed(this.getSpeed() - rand(0, 1) * this.getAccel())
    }
  }

  this.adjustAngle = function (angdiff) {
    if ((angdiff > 0 && Math.abs(angdiff) <= Math.PI) || (angdiff < 0 && Math.abs(angdiff) > Math.PI)) {
      this.setTheta(this.getTheta() + this.getOmega())
    } else if ((angdiff > 0 && Math.abs(angdiff) > Math.PI) || (angdiff < 0 && Math.abs(angdiff) <= Math.PI)) {
      this.setTheta(this.getTheta() - this.getOmega())
    }
  }

  this.draw = function () {
    ctx.beginPath()
    ctx.fillStyle = color.toHex()
    ctx.arc(pos.getXCoor(), pos.getYCoor(), radius, 0, 2 * Math.PI)
    ctx.fill()
  }

  this.reset = function () {
    speed = rand(MIN_SPEED, MAX_SPEED)
    accel = rand(MIN_ABS_ACCEL, MAX_ABS_ACCEL)

    theta = rand(-Math.PI, Math.PI)
    omega = rand(MIN_ABS_OMEGA, MAX_ABS_OMEGA)

    radius = rand(MIN_RADIUS, MAX_RADIUS)
    breath = rand(MIN_ABS_BREATH, MAX_ABS_BREATH)

    pos = new Vector(rand(radius, getCanvasWidth() - radius), rand(radius, getCanvasHeight()) - radius)
    vel = new Vector(speed * Math.cos(theta), speed * Math.sin(theta))

    color = new Color(speed / MAX_SPEED * 255, randInt(0, 255), randInt(0, 255))

    attracted = false
    repelled = false
    alive = true
  }

  this.printInfo = function () {
    print('\n')
    print('Speed:\t', speed.toFixed(3), '\t', 'Accel:\t', accel.toFixed(3))
    print('Theta:\t', theta.toFixed(3), '\t', 'Omega:\t', omega.toFixed(3))
    print('Radius:\t', radius.toFixed(3), '\t', 'Breath:\t', breath.toFixed(3))
    print('Position:\t', this.getX().toFixed(3), '\t', this.getY().toFixed(3))
    print('Color:\t', color.toRGB())
  }
}

function App () {
  var inView = false
  var numParticles = 500
  var particles = []
  var mouseX = getCanvasWidth() / 2
  var mouseY = getCanvasHeight() / 2

  // main three
  this.setup = function () {
    $(document).resize(this.resize)
    $(document).keypress(this.keyPress)
    $('#cloud').mousemove(this.mousemove)

    resize()
    repaint()

    var i
    for (i = 0; i < numParticles; i += 1) {
      particles[i] = new Particle()
    }
  }

  this.update = function () {
    var i
    for (i = 0; i < particles.length; i += 1) {
      particles[i].update(mouseX, mouseY)
    }
  }

  this.draw = function () {
    repaint()

    var i
    for (i = 0; i < particles.length; i += 1) {
      particles[i].draw()
    }
  }

  this.run = function () {
    var app = this
    function _run () {
      app.update()
      app.draw()
      window.requestAnimationFrame(_run)
    }
    _run()
  }

  // event handlers
  this.keyPress = function (event) {
    var i
    switch (event.charCode) {
      case 97: // a[live]
        for (i = 0; i < particles.length; i += 1) {
          particles[i].setAlive(!particles[i].isAlive())
        }
        break

      case 114: // r[eset]
        for (i = 0; i < particles.length; i += 1) {
          particles[i].reset()
        }
        break

      case 118: // v[iew]
        if (inView) {
          $('#cloud').animate({
            opacity: 0
          }, 500, function () {
            $('#cloud').css('display', 'none')
          })
        } else {
          $('#cloud').css('display', 'block')
          $('#cloud').animate({
            opacity: 1
          }, 500)
        }
        inView = !inView
        break

      case 49: // [1] attract
        for (i = 0; i < particles.length; i += 1) {
          var attracted = particles[i].isAttracted()
          particles[i].setAttracted(!attracted)
        }
        break

      case 50: // [2] repel
        for (i = 0; i < particles.length; i += 1) {
          var repelled = particles[i].isRepelled()
          particles[i].setRepelled(!repelled)
        }
        break
    }
  }

  this.resize = function () {
    resize()

    var i
    for (i = 0; i < particles.length; i += 1) {
      particles[i].reset()
    }
  }

  this.mousemove = function (event) {
    mouseX = event.pageX
    mouseY = event.pageY
  }
}

$(function () {
  ctx = $('#cloud')[0].getContext('2d')

  var app = new App()

  app.setup()
  app.run()
})
