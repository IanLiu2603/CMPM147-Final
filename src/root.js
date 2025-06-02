/* Root.js
 * Author: Nhat Thai
 * Date: 5/25/2025
 * Description: Root class for the flower growth system.
 * Starts from a point given by the flower class, it grows downwards then branches out at an angle until MAX_DEPTH is reached
 */

// global variables
const MAX_DEPTH = 6 // Maximum depth of the root system

class Root {
    constructor(x, y, growthRate = 1, angle = PI / 2, depth = 0) {
        this.x = x
        this.y = y
        this.growth_rate = growthRate
        this.angle = angle
        this.length = 0
        this.depth = depth
        this.hasBranched = false
        this.branches = []
        this.maxLength = depth <= 1 ? random(2, 5) : random(20, 40)
    }

    grow() {
        const NEW_LENGTH = this.length + 1 * this.growth_rate
        const NEW_END_POINT = this.y + sin(this.angle) * NEW_LENGTH

        if (NEW_END_POINT < windowHeight * 0.85) {
            return
        }

        if (this.length < this.maxLength) {
            this.length += 1 * this.growth_rate
        } else if (!this.hasBranched && this.depth < MAX_DEPTH) {
            this.hasBranched = true
            const NUM_BRANCHES = floor(random(2, 5))
            const END_X = this.x + cos(this.angle) * this.length
            const END_Y = this.y + sin(this.angle) * this.length
            if (END_Y < windowHeight * 0.85) {
                return
            }
            for (let i = 0; i < NUM_BRANCHES; i++) {
                const NEW_ANGLE = this.angle + random(-PI / 4, PI / 4)
                this.branches.push(
                    new Root(
                        END_X,
                        END_Y,
                        this.growth_rate,
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

    draw() {
        const END_X = this.x + cos(this.angle) * this.length
        const END_Y = this.y + sin(this.angle) * this.length
        stroke(80, 50, 20)
        strokeWeight(map(MAX_DEPTH - this.depth, 0, MAX_DEPTH, 0.5, 2))
        line(this.x, this.y, END_X, END_Y)

        for (let branch of this.branches) {
            branch.draw()
        }
    }
}
