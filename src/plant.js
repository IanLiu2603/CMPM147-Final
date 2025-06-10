//Author: Jackie Sanchez
//Date: 5/28/2025
//flower class takes in parameters to dictate the position, flower type, petal number, health, color, health, and total growth.
//These are used to draw a flower onto a canvas to show the flower "growing" in sketch.js

class Plant {
    constructor(
        x,
        y,
        growthRate,
        rootAngle,
        rootDepth,
        height,
        stemAngle,
        stemDepth,
        flowerColor,
        numPetals,
        flowerSize
    ) {
        this.x = x
        this.y = y
        this.growth_rate = growthRate
        this.root_angle = rootAngle
        this.root_depth = rootDepth
        this.height = height
        this.stem_angle = stemAngle
        this.stem_depth = stemDepth
        this.flower_color = flowerColor
        this.num_petals = numPetals
        this.flower_size = flowerSize
        this.total_growth = 0
        this.root = new Root(
            this.y,
            this.x,
            this.y,
            this.height,
            this.growth_rate,
            this.root_angle,
            this.root_depth
        )
        this.stem = new Stem(
            this.x,
            this.y,
            this.growth_rate,
            this.height,
            this.flower_color,
            this.num_petals,
            this.flower_size,
            this.stem_angle,
            this.stem_depth
        )
    }

    grow() {
        if (this.total_growth <= 300) {
            this.total_growth += this.growth_rate
            if (this.stem) {
                this.stem.grow()
            }
            if (this.root) {
                this.root.grow()
            }
        }
        if (this.total_growth > 300 && this.total_growth < 600) {
            this.total_growth += this.growth_rate
            if (this.stem) {
                this.stem.grow()
            }
        }
    }

    reverseGrow() {
        if (this.stem) {
            this.stem.reverseGrow()
        }
        if (this.root) {
            this.root.reverseGrow()
        }
    }

    resume() {
        if (this.stem) {
            this.stem.resume()
        }
        if (this.root) {
            this.root.resume()
        }
    }

    fastForward() {
        if (this.stem) {
            this.stem.fastForward()
        }
        if (this.root) {
            this.root.fastForward()
        }
    }

    draw() {
        if (this.root) {
            this.root.draw()
        }
        if (this.stem) {
            this.stem.draw()
        }
    }
}
