/* Root.js
 * Author: Nhat Thai
 * Date: 5/25/2025
 * Description: Root class for the flower growth system.
 * Starts from a point given by the flower class, it grows downwards then branches out at an angle until MAX_DEPTH is reached
 */

// Global constants for settings/tweaks
// const MAX_DEPTH = 5 // number of iterations before root stops branching
// const ANGLE = PI / 4 // angle of branching from -ANGLE to ANGLE for new branches

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
        this.maxLength = depth <= 2 ? random(5, 10) : random(20, 30)
    }

    grow() {
        if (this.length < this.maxLength) {
            this.length += 0.5 * this.growth_rate
        } else if (!this.hasBranched && this.depth < 5) {
            this.hasBranched = true
            const NUM_BRANCHES = floor(random(2, 5))
            const END_X = this.x + cos(this.angle) * this.length
            const END_Y = this.y + sin(this.angle) * this.length
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
        strokeWeight(map(4 - this.depth, 0, 4, 0.5, 2))
        line(this.x, this.y, END_X, END_Y)

        for (let branch of this.branches) {
            branch.draw()
        }
    }
}
