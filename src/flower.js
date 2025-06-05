//Author: Jackie Sanchez
//Date: 5/28/2025
//flower class takes in parameters to dictate the position, flower type, petal number, health, color, health, and total growth.
//These are used to draw a flower at the end of the stems produced in plant.js

class Flower {
    constructor(x, y, size = 20, petals = 4, color = [0, 0, 0]) {
        this.x = x
        this.y = y
        this.size = size
        this.petals = petals
        this.health = 100
        this.total_growth = 0
        this.growth_rate = 8
        this.color = color
    }

    get growth() {
        return this.total_growth
    }

    grow() {
        if (this.total_growth <= 300 && this.growth_rate > 0) {
            this.total_growth += this.growth_rate
        } else if (this.total_growth >= 0 && this.growth_rate < 0){
            this.total_growth += this.growth_rate
        }
    }

    reverseGrowth() {
        if (this.total_growth > 0 && this.growth_rate > 0) {
           this.growth_rate = -this.growth_rate
        }
    }

    isClicked(mouseX, mouseY) {
        const D = dist(mouseX, mouseY, this.x, this.y)
        return D < this.size / 2
    }


    //logic from Kazuki Umeda: https://github.com/Creativeguru97/YouTube_tutorial/tree/master/Play_with_geometry/3DMathFlowers
    //uses polar coordinate system of the flowers origin (x,y) and then uses the sin and cos of this position to create flower's petal design.
    drawFlower() {
        // Use total_growth to scale the size (0 to 1)
        let growthFactor = constrain(this.total_growth / 300, 0, 1)
        let currentSize = this.size * growthFactor

        fill(this.color)
        stroke(this.color)
        strokeWeight(3 * growthFactor) // thinner lines at the beginning

        let outlinePoints = []

        beginShape(POINTS)
        for (let phi = 0; phi < 360; phi += 1) {
            let r =
                currentSize *
                    Math.pow(Math.abs(Math.sin((phi * this.petals) / 2)), 1) +
                2
            let x = this.x + r * Math.cos(phi)
            let y = this.y + r * Math.sin(phi)
            vertex(x, y)
            outlinePoints.push([x, y])
        }
        endShape()

        for (let point of outlinePoints) {
            line(this.x, this.y, point[0], point[1])
        }
    }
}
