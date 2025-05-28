//Author: Jackie Sanchez
//Date: 5/20/2025
//flower class stores position, size and type of flower
//This is then used to draw growing flowers onto a canvas in sketch.js

class Flower {
    constructor(x, y, size = 20, petals = 4, type = 'circle') {
        this.x = x
        this.y = y
        this.size = size
        this.type = type
        this.petals = petals
        this.health = 100
        this.total_growth = 0
        this.growth_rate = 1
        this.color = [0, 0, 0]
        this.root = new Root(this.x, this.y, this.growth_rate)
    }

    grow() {
        if (this.total_growth <= 300) {
            this.total_growth += this.growth_rate
            console.log(this.total_growth)

            this.root.grow()
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
        }
        this.root.draw()
    }

    hide() {
        this.size = 0
    }

    //logic from Kazuki Umeda: https://github.com/Creativeguru97/YouTube_tutorial/tree/master/Play_with_geometry/3DMathFlowers
    drawFlower() {
        if (this.total_growth < 250) {
            return
        }
        fill(0)
        stroke(0)
        strokeWeight(3)

        beginShape(POINTS)
        for (let phi = 0; phi < 360; phi += 0.5) {
            let r = this.size * Math.sin(phi * this.petals)
            let x = this.x + r * Math.cos(phi)
            let y = this.y + r * Math.sin(phi)
            vertex(x, y)
        }
        endShape()
        if (this.size < 50) {
            this.size += 0.1
        }
        console.log(this.size)
    }
}
