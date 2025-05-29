/* Root.js
 * Author: Nhat Thai and Jackie Sanchez
 * Date: 5/28/2025
 * Description: Stem class system to make the stems for each flower plant
 * Creates branching stems that a flower.js object will then grow from
 */

const MAX_STEM = 2

class Stem {
    constructor(x, y, growthRate, height, angle = PI / 2, depth = 0) {
        ;(this.x = x),
            (this.y = y),
            (this.growth_rate = growthRate),
            (this.angle = angle)
        this.depth = depth
        this.hadBranched = false
        this.branches = []
        this.length = 0
        this.height = height
        this.maxLength =
            depth <= 1
                ? (this.height * 0.75, this.height)
                : random(this.height * 0.25, this.height * 0.5) //(longer stem to smaller stems)
    }

    growStem() {
        if (this.length < this.maxLength) {
            this.length += 1 * this.growth_rate
            console.log(this.length)
        } else if (!this.hasBranched && this.depth < MAX_STEM) {
            console.log('else if')
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
                        this.height / 2,
                        NEW_ANGLE,
                        this.depth + 1
                    )
                )
            }
        }
        for (let branch of this.branches) {
            branch.growStem()
        }
    }

    draw() {
        const END_X = this.x + cos(this.angle) * this.length
        const END_Y = this.y - sin(this.angle) * this.length
        stroke(0, 255, 0)
        strokeWeight(map(this.depth, 0, MAX_STEM, 5, 1))
        line(this.x, this.y, END_X, END_Y)

        for (let branch of this.branches) {
            branch.draw()
        }
    }
}
