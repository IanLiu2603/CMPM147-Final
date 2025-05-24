//Author: Jackie Sanchez
//Date: 5/20/2025
//flower class stores position, size and type of flower
//This is then used to draw growing flowers onto a canvas in sketch.js

class Flower {
    constructor(x, y, size = 20, type = 'circle') {
        this.x = x
        this.y = y
        this.size = size
        this.type = type
    }

    grow(rate) {
        if (this.size <= 200) {
            this.size += rate
        }
    }

    isClicked(mouseX, mouseY) {
        const D = dist(mouseX, mouseY, this.x, this.y)
        return D < this.size / 2
    }

    draw() {
        if (this.size > 0 && this.type === 'circle') {
            fill(0)
            circle(this.x, this.y, this.size)
        }
    }

    hide() {
        this.size = 0
    }
}
