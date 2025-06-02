let canvas
let flowerList = []
let backgroundSystem
let rainSystem
let snowSystem
let defaultTime = 0.0001
let deltaTime = defaultTime
let bgMusic
let musicStarted = false
let isMuted = false
let thunderSound1
let thunderSound2
let rainSound

function preload() {
    // music from https://soundcloud.com/royaltyfreemusic-nocopyrightmusic/sets/3-creative-commons-music
    // https://editor.p5js.org/p5/sketches/Sound:_Load_and_Play_Sound
    //bgMusic = loadSound('./src/asset/bg-music.wav')
    // https://www.chosic.com/download-audio/27281/
    bgMusic = loadSound('./src/asset/bg-music2.mp3')
    // https://pixabay.com/sound-effects/thunder-rumble-313211/
    thunderSound1 = loadSound('./src/asset/thunder1.mp3')
    // https://pixabay.com/sound-effects/thunder-sound-45992/
    thunderSound2 = loadSound('./src/asset/thunder2.mp3')
    // https://pixabay.com/sound-effects/rain-sounds-ambience-351115/
    rainSound = loadSound('./src/asset/rain-sounds.mp3')
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

function setup() {
    canvas = createCanvas(windowWidth, windowHeight)
    canvas.parent('canvas-container') // Attach canvas to the correct div

    backgroundSystem = new Background()
    rainSystem = new Rain(thunderSound1, thunderSound2, rainSound)
    snowSystem = new Snow()
    populateFlowerList()
}

function draw() {
    backgroundSystem.draw()
    backgroundSystem.updateTime(deltaTime)
    if (!musicStarted) {
        startBackgroundMusic()
    }

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
    text(`Time: ${backgroundSystem.getFormattedTime()}`, 10, 25)
    text(
        `Press 'D' for day, 'N' for night, 'S' for sunset, 'R' for sunrise`,
        10,
        45
    )
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
            1,
            [255, 0, 0],
            4,
            20
        ),
        new Plant(
            500,
            windowHeight * 0.85,
            1.5,
            PI / 2,
            1,
            windowHeight * 0.2,
            PI / 2,
            2,
            [255, 0, 0],
            4,
            20
        ),
        new Plant(
            750,
            windowHeight * 0.85,
            1,
            PI / 2,
            2,
            windowHeight * 0.3,
            PI / 2,
            1,
            [255, 0, 0],
            4,
            20
        ),
        new Plant(
            1000,
            windowHeight * 0.85,
            1.5,
            PI / 2,
            1,
            windowHeight * 0.07,
            PI / 2,
            0,
            [255, 0, 0],
            4,
            20
        ),
    ]
}

//"cuts" flower with click-> starts the growth process over
function mousePressed() {
    // start background music on first click
    startBackgroundMusic()
    // for (let flower of flowerList) {
    //     //if (flower.isClicked(mouseX, mouseY)) {
    //     //    flower.hide() // or flower.x = -1000, etc.
    //     //}
    // }
}

// Add keyboard controls to test background system
function keyPressed() {
    // start background music on first key press
    //startBackgroundMusic()

    if (key === 'd' || key === 'D') {
        // Set to day time (noon)
        backgroundSystem.setTimeOfDay(12.0)
        console.log('Background set to day time')
    } else if (key === 'n' || key === 'N') {
        // Set to night time (midnight)
        backgroundSystem.setTimeOfDay(0.0)
        console.log('Background set to night time')
    } else if (key === 's' || key === 'S') {
        // Set to sunset
        backgroundSystem.setTimeOfDay(18.0)
        console.log('Background set to sunset')
    } else if (key === 'r' || key === 'R') {
        // Set to sunrise
        backgroundSystem.setTimeOfDay(6.0)
        console.log('Background set to sunrise')
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

// from ChatGPT
window.mute = function () {
    const VOLUME_BTN = document.getElementById('volume-btn')
    if (isMuted) {
        if (bgMusic && musicStarted) {
            bgMusic.setVolume(0.3)
            rainSound.setVolume(0.01)
            thunderSound1.setVolume(0.1)
            thunderSound2.setVolume(0.1)
        }
        VOLUME_BTN.textContent = '🔈'
        isMuted = false
        console.log('Music unmuted')
    } else {
        if (bgMusic && musicStarted) {
            bgMusic.setVolume(0)
            rainSound.setVolume(0)
            thunderSound1.setVolume(0)
            thunderSound2.setVolume(0)
        }
        VOLUME_BTN.textContent = '🔇'
        isMuted = true
        console.log('Music muted')
    }
}

window.Raining = function () {
    const RAIN_BTN = document.getElementById('rain-btn')
    const SNOW_BTN = document.getElementById('snow-btn')
    if (rainSystem.isActive) {
        // Stop rain
        rainSystem.stop()
        RAIN_BTN.classList.remove('active')
        console.log('Rain stopped')
    } else {
        // Start rain and stop snow if active
        if (snowSystem.isActive) {
            snowSystem.stop()
            SNOW_BTN.classList.remove('active')
        }
        rainSystem.start()
        RAIN_BTN.classList.add('active')
        console.log('Rain started')
    }
}

window.Snowing = function () {
    const SNOW_BTN = document.getElementById('snow-btn')
    const RAIN_BTN = document.getElementById('rain-btn')
    if (snowSystem.isActive) {
        // Stop snow
        snowSystem.stop()
        SNOW_BTN.classList.remove('active')
        console.log('Snow stopped')
    } else {
        // Start snow and stop rain if active
        if (rainSystem.isActive) {
            rainSystem.stop()
            RAIN_BTN.classList.remove('active')
        }
        snowSystem.start()
        SNOW_BTN.classList.add('active')
        console.log('Snow started')
    }
}
