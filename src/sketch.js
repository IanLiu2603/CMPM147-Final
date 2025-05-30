let canvas
let flowerList = []
let backgroundSystem
let rainSystem
let snowSystem
let defaultTime = 0.0001
let deltaTime = defaultTime
let bgMusic
let musicStarted = false // track if music has started

function preload() {
    // music from https://soundcloud.com/royaltyfreemusic-nocopyrightmusic/sets/3-creative-commons-music
    // https://editor.p5js.org/p5/sketches/Sound:_Load_and_Play_Sound
    bgMusic = loadSound('./src/asset/bg-music.wav')
}

function setup() {
    canvas = createCanvas(windowWidth, windowHeight)
    canvas.parent('canvas-container') // Attach canvas to the correct div

    backgroundSystem = new Background()
    rainSystem = new Rain()
    snowSystem = new Snow()

    populateFlowerList()
}

// function to start background music
function startBackgroundMusic() {
    if (bgMusic && !musicStarted) {
        bgMusic.loop()
        bgMusic.setVolume(0.3)
        musicStarted = true
        console.log('background music started')
    }
}

function draw() {
    backgroundSystem.draw()
    backgroundSystem.updateTime(deltaTime)

    fill(0)

    //draws a circle as placeholder for flower bud/ bloom
    for (let flower of flowerList) {
        flower.draw()
        if (!paused) {
            flower.grow()
        }
        if (flower.type === 'circle') {
            flower.draw()
            flower.drawFlower()
            flower.grow()
        }
    }

    // Update and draw weather effects
    if (!paused) {
        rainSystem.update()
        snowSystem.update()
    }
    rainSystem.draw()
    snowSystem.draw()

    // Display current time of day for testing (top-left corner)
    fill(255)
    stroke(0)
    strokeWeight(1)
    textSize(16)
    // from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toFixed
    text(`Time of Day: ${backgroundSystem.getTimeOfDay().toFixed(3)}`, 10, 25)
    text(`Press 'D' for day, 'N' for night, 'S' for sunset`, 10, 45)
    text(`Weather: 'Q' for rain, 'W' for snow`, 10, 65)
}

//generates a list of flowers and stores it in global
function populateFlowerList() {
    //parameters: x,y, growthRate, Root angle, Root depth, height, stem angle, stem depth,
    flowerList = [
        new Plant(
            250,
            windowHeight * 0.85,
            1,
            PI / 2,
            3,
            windowHeight * 0.21,
            PI / 2,
            1
        ),
        new Plant(
            500,
            windowHeight * 0.85,
            1.5,
            PI / 2,
            1,
            windowHeight * 0.2,
            PI / 2,
            2
        ),
        new Plant(
            750,
            windowHeight * 0.85,
            1,
            PI / 2,
            2,
            windowHeight * 0.3,
            PI / 2,
            1
        ),
        new Plant(
            1000,
            windowHeight * 0.85,
            1.5,
            PI / 2,
            1,
            windowHeight * 0.07,
            PI / 2,
            0
        ),
    ]
}

//"cuts" flower with click-> starts the growth process over
function mousePressed() {
    // start background music on first click
    startBackgroundMusic()

    for (let flower of flowerList) {
        if (flower.isClicked(mouseX, mouseY)) {
            flower.hide() // or flower.x = -1000, etc.
        }
    }
}

// Add keyboard controls to test background system
function keyPressed() {
    // start background music on first key press
    startBackgroundMusic()

    if (key === 'd' || key === 'D') {
        // Set to day time (noon)
        backgroundSystem.setTimeOfDay(0.7)
        console.log('Background set to day time')
    } else if (key === 'n' || key === 'N') {
        // Set to night time (midnight)
        backgroundSystem.setTimeOfDay(0.0)
        console.log('Background set to night time')
    } else if (key === 's' || key === 'S') {
        // Set to sunset
        backgroundSystem.setTimeOfDay(0.9)
        console.log('Background set to sunset')
    } else if (key === 'r' || key === 'R') {
        // Set to sunrise
        backgroundSystem.setTimeOfDay(0.4)
        console.log('Background set to sunrise')
    } else if (key === 'q' || key === 'Q') {
        // Toggle rain
        if (rainSystem.isActive) {
            rainSystem.stop()
            console.log('Rain stopped')
        } else {
            snowSystem.stop() // Stop snow if active
            rainSystem.start()
            console.log('Rain started')
        }
    } else if (key === 'w' || key === 'W') {
        // Toggle snow
        if (snowSystem.isActive) {
            snowSystem.stop()
            console.log('Snow stopped')
        } else {
            rainSystem.stop() // Stop rain if active
            snowSystem.start()
            console.log('Snow started')
        }
    }
}

//Controls the plant
let paused = false

//Function should stop background movement, flower growth, and stem progression

window.pause = function () {
    //Background
    console.log('pausing')
    backgroundSystem.pause()

    //Plant
    paused = true
}

window.resume = function () {
    console.log('resume')
    //Background
    backgroundSystem.resume()

    //Plant
    paused = false
}

window.fastforward = function () {
    console.log('ff')
}

window.rewind = function () {
    console.log('rewind')
}
