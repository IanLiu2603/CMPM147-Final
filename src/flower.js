//Author: Jackie Sanchez
//Date: 5/28/2025
//flower class takes in parameters to dictate the position, flower type, petal number, health, color, health, and total growth.
//These are used to draw a flower onto a canvas to show the flower "growing" in sketch.js

class Flower {
    constructor(
        x,
        y,
        size = 20,
        petals = 4,
        color = [0, 0, 0],
        type = 'circle'
    ) {
        this.x = x
        this.y = y
        this.size = size
        this.type = type
        this.petals = petals
        this.health = 100
        this.total_growth = 0
        this.growth_rate = 1
        this.color = color
    }

    grow() {
        if (this.total_growth <= 300) {
            this.total_growth += this.growth_rate
        }
    }

    isClicked(mouseX, mouseY) {
        const D = dist(mouseX, mouseY, this.x, this.y)
        return D < this.size / 2
    }

    draw() {
        if (this.total_growth < 300) {
            this.y -= 1
            //console.log(this.total_growth);
        } else return
    }

    hide() {
        this.size = 0
    }

    //logic from Kazuki Umeda: https://github.com/Creativeguru97/YouTube_tutorial/tree/master/Play_with_geometry/3DMathFlowers
    //uses polar coordinate system of the flowers origin (x,y) and then uses the sin and cos of this position to create flower's petal design.
    drawFlower() {
        if (this.total_growth < 250) {
            return
        }
        fill(this.color)
        stroke(this.color)
        strokeWeight(3)

        let outlinePoints = []

        beginShape(POINTS)
        for (let phi = 0; phi < 360; phi += 1) {
            let r =
                this.size *
                    Math.pow(Math.abs(Math.sin((phi * this.petals) / 2)), 1) +
                5
            let x = this.x + r * Math.cos(phi)
            let y = this.y + r * Math.sin(phi)
            vertex(x, y, 0)
            outlinePoints.push([x, y])
        }
        endShape()
        for (let point of outlinePoints) {
            line(this.x, this.y, point[0], point[1])
        }

        if (this.size < 50) {
            this.size += 0.01
        }
    }
}
