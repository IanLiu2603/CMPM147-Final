const FLOWER_TYPES = ['circle'];
let canvas;
let flowerList = [];
let growthRate = 5;

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
            circle(flower.x, flower.y, flower.size)
            flowerGrow(flower, growthRate);
        }
    }
}

//generates a list of flowers and stores it in global
function populateFlowerList() {
    flowerList = [
        { type: 'circle', x: 250, y: 500, size: 0 },
        { type: 'circle', x: 500, y: 500, size: 0 },
        { type: 'circle', x: 750, y: 500, size: 0 },
        { type: 'circle', x: 1000, y: 500, size: 0 },
    ]
}

//controls the growth of the flower buds (forward and backward)
function flowerGrow(flowerType, growthRate) {
    if(flowerType.size <= 200) {
        flowerType.size += growthRate;
    }
}

//"cuts" flower with click-> starts the growth process over
function mousePressed() {
    for (let flower of flowerList) {
        let d = dist(mouseX, mouseY, flower.x, flower.y);
        if (d < flower.size/2) {
            flower.size = 0;
        }
    }
}
