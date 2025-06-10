/* Root.js
 * Author: Nhat Thai and Jackie Sanchez
 * Date: 5/28/2025
 * Description: Stem class system to make the stems for each flower plant
 * Creates branching stems that a flower.js object will then grow from
 */

const MAX_STEM = 2
const STEM_COLORS = [[34, 139, 34],[50, 205, 50],[128, 128, 0],[46, 139, 87],[127, 255, 0]]

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
        this.original_growth_rate = this.growth_rate
        this.angle = angle
        this.depth = depth
        this.hasBranched = false
        this.branches = []
        this.length = 0
        this.height = height
        this.flower_color = flowerColor
        this.num_petals = numPetals
        this.flower_size = flowerSize
        this.stem_color = random(STEM_COLORS)
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
        //console.log(this.growth_rate)
        if (this.length < this.maxLength) {
            this.length += this.growth_rate
            if (this.length > this.maxLength) {
                this.length = this.maxLength
            }
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
        if (this.length >= this.maxLength) {
            for (let branch of this.branches) {
                branch.grow()
            }

            // Regenerate flower only on max-depth stems
            if (
                this.depth === MAX_STEM &&
                this.flower === null &&
                this.length >= this.maxLength
            ) {
                const END_X = this.x + cos(this.angle) * this.length
                const END_Y = this.y - sin(this.angle) * this.length
                this.flower = new Flower(
                    END_X,
                    END_Y,
                    this.flower_size,
                    this.num_petals,
                    this.flower_color
                )
            }
        }
    }

    reverseGrow() {
        // Reverse flower growth if it exists
        if (this.flower) {
            this.flower.reverseGrowth()
            if (this.flower.growth <= 0) {
                this.flower = null
            }
        }

        // Reverse-grow any child branches
        for (let branch of this.branches) {
            branch.reverseGrow()
        }

        // Check if all branches are fully retracted and gone
        let allBranchesGone = true
        for (let branch of this.branches) {
            if (
                branch.length > 0 ||
                branch.flower ||
                branch.branches.length > 0
            ) {
                allBranchesGone = false
                break
            }
        }

        if (
            !this.flower &&
            allBranchesGone &&
            this.length > 0 &&
            this.growth_rate >= 0
        ) {
            this.growth_rate = -this.original_growth_rate
        }

        // If length has fully retracted, remove branches and flower
        // Apply retraction
        if (!this.flower && allBranchesGone) {
            this.length += this.growth_rate
        }

        if (this.length <= 0) {
            this.length = 0
            this.branches = []
            this.hasBranched = false
        }
    }

    resume() {
        if (this.growth_rate !== this.original_growth_rate) {
            this.growth_rate = abs(this.original_growth_rate)
        }

        if (this.flower) {
            this.flower.resume()
        }

        for (let branch of this.branches) {
            branch.resume()
        }
    }

    fastForward() {
        if (this.growth_rate === this.original_growth_rate) {
            this.growth_rate *= 1.25
        }

        if (this.flower) {
            this.flower.fastForward()
        }
    }

    draw() {
        const END_X = this.x + cos(this.angle) * this.length
        const END_Y = this.y - sin(this.angle) * this.length
        stroke(this.stem_color[0], this.stem_color[1], this.stem_color[2]);
        // stroke(0, 255, 0)
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
    }
}
