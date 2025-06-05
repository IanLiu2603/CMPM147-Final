/* Root.js
 * Author: Nhat Thai
 * Date: 5/25/2025
 * Description: Root class for the flower growth system.
 * Starts from a point given by the flower class, it grows downwards then branches out at an angle until MAX_DEPTH is reached
 */

// global variables
const MAX_DEPTH = 4 // Maximum depth of the root system

class Root {
    constructor(initialY, x, y, plantHeight, growthRate = 1, angle = PI / 2, depth = 0) {
        this.initialY = initialY; // the max height in which the root cannot go below(above the ground on canvas)
        this.x = x
        this.y = y
        this.plantHeight = plantHeight;
        this.growth_rate = growthRate
        this.angle = angle
        this.length = 0
        this.depth = depth
        this.hasBranched = false
        this.branches = []
        this.maxLength = depth <= 1 ? random(5, 10) : random(20, 40)
    }

    grow() {
        let predictedY = this.y + sin(this.angle) * this.length;
        if (predictedY < this.initialY) {
            return;
        }
        if (this.length < this.maxLength) {
            this.length += 1 * this.growth_rate
        } else if (!this.hasBranched && this.depth < MAX_DEPTH) {
            this.hasBranched = true
            const NUM_BRANCHES = floor(random(2, 5))
            const END_X = this.x + cos(this.angle) * this.length
            const END_Y = this.y + sin(this.angle) * this.length
            for (let i = 0; i < NUM_BRANCHES; i++) {
                const NEW_ANGLE = this.angle + random(-PI / 6, PI / 6)
                this.branches.push(
                    new Root(
                        this.initialY,
                        END_X,
                        END_Y,
                        this.plantHeight,
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
        strokeWeight(map(MAX_DEPTH - this.depth, 0, 4, 0.5, 2))
        line(this.x, this.y, END_X, END_Y)

        for (let branch of this.branches) {
            branch.draw()
        }
    }
}
