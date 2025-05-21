let canvas
let flowerList = []
let growthRate = 5

function setup() {
    canvas = createCanvas(windowWidth, windowHeight)
    canvas.parent('canvas-container') // Attach canvas to the correct div
    populateFlowerList()
}

function draw() {
    background(220)
    fill(0)

    //draws a circle as placeholder for flower bud/ bloom
    for (let flower of flowerList) {
        if (flower.type === 'circle') {
            flower.draw()
            flower.grow(growthRate)
        }
    }
}

//generates a list of flowers and stores it in global
function populateFlowerList() {
    flowerList = [
        new Flower(250, 500),
        new Flower(500, 500),
        new Flower(750, 500),
        new Flower(1000, 500),
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
