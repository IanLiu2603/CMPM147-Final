let canvas
let flowerList = []
let backgroundSystem

function setup() {
    canvas = createCanvas(windowWidth, windowHeight)
    canvas.parent('canvas-container') // Attach canvas to the correct div

    // Initialize the background system
    backgroundSystem = new Background()

    populateFlowerList()
}

function draw() {
    backgroundSystem.draw()
    backgroundSystem.updateTime(0.0001)

    fill(0)

    //draws a circle as placeholder for flower bud/ bloom
    for (let flower of flowerList) {
        flower.draw()
        flower.grow()
        if (flower.type === 'circle') {
            flower.draw()
            flower.drawFlower()
            flower.grow()
        }
    }

    // Display current time of day for testing (top-left corner)
    fill(255)
    stroke(0)
    strokeWeight(1)
    textSize(16)
    text(`Time of Day: ${backgroundSystem.getTimeOfDay().toFixed(3)}`, 10, 25) // from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toFixed
    text(
        `Press 'D' or 'd' for day, 'N' or 'n' for night, 'S' or 's' for sunset`,
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
    for (let flower of flowerList) {
        if (flower.isClicked(mouseX, mouseY)) {
            flower.hide() // or flower.x = -1000, etc.
        }
    }
}

// Add keyboard controls to test background system
function keyPressed() {
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
    }
}

window.pause = function() {
    console.log("pause")
}

window.resume = function () {
    console.log("resume")
}

window.fastforward = function () {
    console.log("ff")
}

window.rewind = function () {
    console.log("rewind")
}
