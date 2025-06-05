/* Root.js
 * Author: Nhat Thai and Jackie Sanchez
 * Date: 5/28/2025
 * Description: Stem class system to make the stems for each flower plant
 * Creates branching stems that a flower.js object will then grow from
 */

const MAX_STEM = 2

class Stem {
    constructor(
        x,
        y,
        growthRate,
        height,
        flowerColor,
        numPetals,
        flowerSize,
        angle = PI / 2,
        depth = 0
    ) {
        this.x = x
        this.y = y
        this.growth_rate = growthRate
        this.angle = angle
        this.depth = depth
        this.hasBranched = false
        this.branches = []
        this.length = 0
        this.height = height
        this.flower_color = flowerColor
        this.num_petals = numPetals
        this.flower_size = flowerSize
        if (this.depth === MAX_STEM) {
            this.flower = new Flower(
                x,
                y,
                this.flower_size,
                this.num_petals,
                this.flower_color
            )
        } else {
            this.flower = null
        }
        this.maxLength =
            depth <= 0
                ? (this.height * 0.75, this.height)
                : random(this.height * 0.25, this.height * 0.5) //(longer stem to smaller stems)
    }

    grow() {
        if (this.length < this.maxLength) {
            this.length += 1 * this.growth_rate
        } else if (!this.hasBranched && this.depth < MAX_STEM) {
            //console.log('I am branching')
            this.hasBranched = true
            const NUM_BRANCHES = floor(random(2, 5))
            const END_X = this.x + cos(this.angle) * this.length
            const END_Y = this.y - sin(this.angle) * this.length
            for (let i = 0; i < NUM_BRANCHES; i++) {
                const NEW_ANGLE = this.angle - random(-PI / 4, PI / 4)
                this.branches.push(
                    new Stem(
                        END_X,
                        END_Y,
                        this.growth_rate,
                        this.height,
                        this.flower_color,
                        this.num_petals,
                        this.flower_size,
                        NEW_ANGLE,
                        this.depth + 1
                    )
                )
            }
        }
        for (let branch of this.branches) {
            branch.grow()
        }
    }

    reverseGrow() {
        // Reverse flower growth if it exists
        if (this.flower) {
            //console.log("checking flowers")
            this.flower.reverseGrowth()
            if (this.flower.growth === 0) {
                //this.flower = null
            }
            return
        }


        // Reverse-grow any child branches
        if (this.branches) {
            for (let branch of this.branches) {
                branch.reverseGrow()    
            }
        }

        if (!this.flower && this.length > 0) {
            this.lenght -= this.growth_rate
        }

        // If length has fully retracted, remove branches and flower
        if (this.length <= 0) {
            this.branches = []
            this.hasBranched = false
            this.flower = null
        }
    }

    draw() {
        const END_X = this.x + cos(this.angle) * this.length
        const END_Y = this.y - sin(this.angle) * this.length
        stroke(0, 255, 0)
        strokeWeight(map(this.depth, 0, MAX_STEM, 5, 2))
        line(this.x, this.y, END_X, END_Y)

        for (let branch of this.branches) {
            branch.draw()
        }

        if (this.flower && this.length >= this.maxLength) {
            this.flower.x = END_X
            this.flower.y = END_Y
            this.flower.grow()
            this.flower.drawFlower()
        }

        // if (this.flower.growth === 0) {
        //     this.flower = null
        // }
    }
}
