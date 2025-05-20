const FLOWER_TYPES = ["circle"];
let canvas;
let flowerList = []
let growthRate;

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('canvas-container'); // Attach canvas to the correct div
  populateFlowerList();
  
}

function draw() {
    background(220); // Simple gray background for testing
    fill(0);
    for (let flower of flowerList) {
        if (flower.type === 'circle'){
            circle(flower.x, flower.y, flower.size);
            flower.size
        }
        
    }

}

//generates a list of flowers and stores it in global 
function populateFlowerList() {
    flowerList = [
    { type: "circle", x: 50, y: 100, size: 20 },
    { type: "circle", x: 100, y: 100, size: 20 },
    { type: "circle", x: 150, y: 100, size: 20 },
    { type: "circle", x: 200, y: 100, size: 20 }
  ];
}

//controls the growth of the flower buds (forward and backward)
function flowerGrow(flowerAsset, growthRate) {

}