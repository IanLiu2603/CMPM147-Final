let canvas
let flowerList = []
let growthRate = 5
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
        if (flower.type === 'circle') {
            flower.draw()
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
    flowerList = [
        new Flower(250, windowHeight),
        new Flower(500, windowHeight),
        new Flower(750, windowHeight),
        new Flower(1000, windowHeight),
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
        backgroundSystem.setTimeOfDay(0.5)
        console.log('Background set to day time')
    } else if (key === 'n' || key === 'N') {
        // Set to night time (midnight)
        backgroundSystem.setTimeOfDay(0.0)
        console.log('Background set to night time')
    } else if (key === 's' || key === 'S') {
        // Set to sunset
        backgroundSystem.setTimeOfDay(0.75)
        console.log('Background set to sunset')
    } else if (key === 'r' || key === 'R') {
        // Set to sunrise
        backgroundSystem.setTimeOfDay(0.25)
        console.log('Background set to sunrise')
    } else if (key === ' ') {
        // Spacebar: toggle automatic time progression
        // This is a simple way to pause/resume the day/night cycle
        console.log('Current time of day:', backgroundSystem.getTimeOfDay())
    }
}
