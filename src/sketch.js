let canvas
let plantList = []
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
let birdSound
let nightBirdSound
let lastBirdSoundTime = 0
let birdSoundCooldown = 5000
let gameState = 'start'
let playing = 'play'
let startButton = {
    x: 0,
    y: 0,
    width: 200,
    height: 60,
}
let startFont

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
    // https://pixabay.com/sound-effects/bird-327231/
    birdSound = loadSound('./src/asset/bird.mp3')
    // https://pixabay.com/sound-effects/perkutut-bird-of-java-337019/
    nightBirdSound = loadSound('./src/asset/night-bird.mp3')
    // https://www.dafont.com/agreloy.font
    startFont = loadFont('./src/asset/Agreloy.ttf')
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

function worldKeyChanged(key) {
    worldSeed = XXH.h32(key, 0)
    noiseSeed(worldSeed)
    randomSeed(worldSeed)
}

function setup() {
    canvas = createCanvas(windowWidth, windowHeight)
    canvas.parent('canvas-container') // Attach canvas to the correct div

    startButton.x = windowWidth / 2 - startButton.width / 2
    startButton.y = windowHeight / 2 - startButton.height / 2

    backgroundSystem = new Background()
    rainSystem = new Rain(thunderSound1, thunderSound2, rainSound)
    snowSystem = new Snow()
    populateFlowerList()

    //Logic taken from experiment 4
    let label = createP()
    label.html('World key: ')
    label.class('world-key')
    label.parent('canvas-container')

    let input = createInput('xyzzy')
    input.parent(label)
    input.input(() => {
        reflower(input.value())
    })
}

function reflower(key) {
    if (window.worldKeyChanged) {
        window.worldKeyChanged(key)
        console.log('key change')
    }
    populateFlowerList()
}

function draw() {
    if (gameState === 'start') {
        drawStartScreen()
    } else if (gameState === 'playing') {
        drawFlowerScreen()
    }
}

// switch screen : https://editor.p5js.org/msboyles/sketches/nDSJ6Ew2Mc
function drawStartScreen() {
    // gradient background: https://editor.p5js.org/evebdn/sketches/O9G35ueZv
    for (let i = 0; i <= height; i++) {
        let n = map(i, 0, height, 0, 1)
        let gradientColor = lerpColor(color('#9FC87E'), color('#C562AF'), n)
        stroke(gradientColor)
        line(0, i, width, i)
    }

    // Title
    fill(255)
    stroke(0)
    strokeWeight(2)
    textAlign(CENTER, CENTER)
    textFont(startFont)
    textSize(48)
    text('Flower Garden', windowWidth / 2, windowHeight / 2 - 100)

    // Start button
    fill(255)
    stroke(0)
    strokeWeight(2)
    rect(
        startButton.x,
        startButton.y,
        startButton.width,
        startButton.height,
        10
    )
    fill(0)
    noStroke()
    textSize(24)
    text('START', windowWidth / 2, windowHeight / 2)
    fill(255)
    stroke(0)
    strokeWeight(1)
    textSize(16)
    text(
        'Click START to begin your garden journey',
        windowWidth / 2,
        windowHeight / 2 + 100
    )
}

function drawFlowerScreen() {
    backgroundSystem.draw()
    backgroundSystem.updateTime(deltaTime)

    fill(0)

    //draws a circle as placeholder for flower bud/ bloom
    for (let flower of plantList) {
        flower.draw()
        if (!paused) {
            if (playing === 'play') {
                flower.grow()
            } else if (playing === 'rw') {
                flower.reverseGrow()
            }
        }
        // if (flower.type === 'circle') {
        //     flower.draw()
        //     flower.drawFlower()
        //     flower.grow()
        // }
    }

    // Update and draw weather effects
    if (!paused) {
        rainSystem.update()
        snowSystem.update()
    }
    rainSystem.draw()
    snowSystem.draw()

    if (!paused && !isMuted && musicStarted) {
        palyBirdSounds()
    }

    // Display current time of day for testing (top-left corner)
    fill(255)
    stroke(0)
    strokeWeight(1)
    textSize(16)
    textFont('Courier New')
    textAlign(LEFT, TOP)
    // from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toFixed
    text(`Time: ${backgroundSystem.getFormattedTime()}`, 10, 25)
    text(
        `Press 'D' for day, 'N' for night, 'S' for sunset, 'R' for sunrise`,
        10,
        45
    )
}

function palyBirdSounds() {
    let currentTime = millis()
    let timeOfDay = backgroundSystem.getTimeOfDay()

    // Check if enough time has passed since last bird sound
    if (currentTime - lastBirdSoundTime > birdSoundCooldown) {
        if (random() < 0.003) {
            // Determine which bird sound to play based on time of day
            if (timeOfDay >= 6.0 && timeOfDay < 18.0) {
                if (birdSound && !birdSound.isPlaying()) {
                    birdSound.setVolume(isMuted ? 0 : 0.15)
                    birdSound.play()
                    lastBirdSoundTime = currentTime
                    console.log(
                        'Day bird sound played at time:',
                        timeOfDay.toFixed(2)
                    )
                }
            } else {
                // Nighttime (6 PM to 6 AM) - play night bird sound
                if (nightBirdSound && !nightBirdSound.isPlaying()) {
                    nightBirdSound.setVolume(isMuted ? 0 : 0.12)
                    nightBirdSound.play()
                    lastBirdSoundTime = currentTime
                    console.log(
                        'Night bird sound played at time:',
                        timeOfDay.toFixed(2)
                    )
                }
            }
        }
    }
}

//generates a list of flowers and stores it in global
function populateFlowerList() {
    //parameters: x,y, growthRate, Root angle, Root depth, height, stem angle, stem depth,
    colorList = [
        [255, 100, 100], // soft red
        [100, 100, 255], // cool blue
        [255, 150, 80], // orange
        [100, 255, 200], // aqua (but not green)
        [200, 100, 255], // purple
        [255, 100, 200], // pinkish
        [150, 100, 255], // violet
        [100, 255, 255], // cyan
        [255, 100, 150], // rose
        [255, 200, 100], // golden
        [255, 70, 100], // cherry red
        [150, 255, 150], // pastel mint (still not light green)
        [100, 150, 255], // light indigo
        [255, 150, 200], // soft pink
        [200, 150, 255], // lilac
        [255, 100, 255], // magenta
        [255, 255, 100], // yellow (but not greenish)
        [100, 200, 255], // sky blue
        [255, 120, 180], // watermelon
        [255, 150, 150], // salmon
    ]

    plantList = [
        new Plant(
            250,
            windowHeight * 0.85,
            random(.5, 2),
            PI / 2,
            0,
            windowHeight * random(0.05, 0.25),
            PI / 2,
            0,
            random(colorList),
            random(4, 15),
            20
        ),
        new Plant(
            500,
            windowHeight * 0.85,
            random(.5, 2),
            PI / 2,
            0,
            windowHeight * random(0.05, 0.25),
            PI / 2,
            0,
            random(colorList),
            random(4, 15),
            20
        ),
        new Plant(
            750,
            windowHeight * 0.85,
            random(.5, 2),
            PI / 2,
            0,
            windowHeight * random(0.05, 0.25),
            PI / 2,
            0,
            random(colorList),
            random(4, 15),
            20
        ),
        new Plant(
            1000,
            windowHeight * 0.85,
            random(.5, 2),
            PI / 2,
            0,
            windowHeight * random(0.05, 0.25),
            PI / 2,
            0,
            random(colorList),
            random(4, 15),
            20
        ),
    ]
}

//"cuts" flower with click-> starts the growth process over
function mousePressed() {
    if (gameState === 'start') {
        // Check if start button was clicked
        if (
            mouseX >= startButton.x &&
            mouseX <= startButton.x + startButton.width &&
            mouseY >= startButton.y &&
            mouseY <= startButton.y + startButton.height
        ) {
            gameState = 'playing'
            startBackgroundMusic()
            console.log('started!')
        }
    } else if (gameState === 'playing') {
        // Don't add a plant if interacting with UI
        const ACTIVE_ELEMENT = document.activeElement
        if (
            ACTIVE_ELEMENT.tagName === 'INPUT' ||
            ACTIVE_ELEMENT.tagName === 'TEXTAREA' ||
            mouseIsOverButton()
        ) {
            return // Ignore click
        }
        let newPlant = new Plant(
            mouseX,
            windowHeight * 0.85,
            random(.5, 2),
            PI / 2,
            0,
            windowHeight * random(0.05, 0.25),
            PI / 2,
            0,
            random(colorList),
            random(4, 15),
            20
        )
        plantList.push(newPlant)
        console.log('New plant added at:', mouseX)
    }
}

function mouseIsOverButton() {
    const BUTTONS = document.querySelectorAll('button')
    for (let btn of BUTTONS) {
        let rect = btn.getBoundingClientRect()
        if (
            mouseX >= rect.left &&
            mouseX <= rect.right &&
            mouseY >= rect.top &&
            mouseY <= rect.bottom
        ) {
            return true
        }
    }
    return false
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
    if (gameState === 'start') {
        return
    }
    //Background
    console.log('pausing')
    backgroundSystem.pause()

    //Plant
    paused = true

    // Pause background music
    if (bgMusic && musicStarted && bgMusic.isPlaying()) {
        bgMusic.pause()
        console.log('Background music paused')
    }
}

window.resume = function () {
    if (gameState === 'start') {
        return
    }
    for (let flower of plantList) {
        flower.resume()
    }
    console.log('resume')
    //Background
    backgroundSystem.resume()

    //Plant
    paused = false

    // Resume background music
    if (bgMusic && musicStarted && !bgMusic.isPlaying() && !isMuted) {
        bgMusic.play()
        console.log('Background music resumed')
    }

    playing = 'play'
}

window.fastforward = function () {
    if (gameState === 'start') {
        return
    }
    for (let flower of plantList) {
        flower.fastForward()
    }
    console.log('ff')
    deltaTime = defaultTime * 5 
}

window.rewind = function () {
    if (gameState === 'start') {
        return
    }
    console.log('rewind')
    playing = 'rw'
    deltaTime = -defaultTime 
}

// from ChatGPT
window.mute = function () {
    if (gameState === 'start') {
        return
    }
    const VOLUME_BTN = document.getElementById('volume-btn')
    if (isMuted) {
        if (bgMusic && musicStarted) {
            bgMusic.setVolume(0.3)
            rainSound.setVolume(0.01)
            thunderSound1.setVolume(0.1)
            thunderSound2.setVolume(0.1)
            birdSound.setVolume(0.1)
            nightBirdSound.setVolume(0.15)
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
            birdSound.setVolume(0)
            nightBirdSound.setVolume(0)
        }
        VOLUME_BTN.textContent = '🔇'
        isMuted = true
        console.log('Music muted')
    }
}

window.Raining = function () {
    if (gameState === 'start') {
        return
    }
    const RAIN_BTN = document.getElementById('rain-btn')
    const SNOW_BTN = document.getElementById('snow-btn')
    if (rainSystem.isActive) {
        // Stop rain
        rainSystem.stop()
        backgroundSystem.setWeatherState(false, snowSystem.isActive)
        RAIN_BTN.classList.remove('active')
        console.log('Rain stopped')
    } else {
        // Start rain and stop snow if active
        if (snowSystem.isActive) {
            snowSystem.stop()
            SNOW_BTN.classList.remove('active')
        }
        rainSystem.start()
        backgroundSystem.setWeatherState(true, false)
        RAIN_BTN.classList.add('active')
        console.log('Rain started')
    }
}

window.Snowing = function () {
    if (gameState === 'start') {
        return
    }
    const SNOW_BTN = document.getElementById('snow-btn')
    const RAIN_BTN = document.getElementById('rain-btn')
    if (snowSystem.isActive) {
        // Stop snow
        snowSystem.stop()
        backgroundSystem.setWeatherState(rainSystem.isActive, false)
        SNOW_BTN.classList.remove('active')
        console.log('Snow stopped')
    } else {
        // Start snow and stop rain if active
        if (rainSystem.isActive) {
            rainSystem.stop()
            RAIN_BTN.classList.remove('active')
        }
        snowSystem.start()
        backgroundSystem.setWeatherState(false, true)
        SNOW_BTN.classList.add('active')
        console.log('Snow started')
    }
}
