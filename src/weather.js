//Author: Chengkun Li
//Date: 5/29/2025
//This file is used to create a class for rain and snow.
//These are used to draw a background with a day/night cycle, clouds, stars, and a ground

class Rain {
    constructor() {
        this.raindrops = []
        this.intensity = 100 // number of raindrops
        this.isActive = false
        this.windStrength = 0.5
        this.initializeRaindrops()
    }

    initializeRaindrops() {
        this.raindrops = []
        for (let i = 0; i < this.intensity; i++) {
            this.raindrops.push({
                x: random(-50, width + 50),
                y: random(-500, -50),
                speed: random(5, 12),
                length: random(10, 25),
                opacity: random(150, 255),
                wind: random(-this.windStrength, this.windStrength),
                isEmoji: random() < 0.01, // 1% chance to be an emoji
            })
        }
    }

    update() {
        if (!this.isActive) return

        for (let drop of this.raindrops) {
            // rain drops fall
            drop.y += drop.speed
            drop.x += drop.wind

            // reset rain drops that are off screen
            if (drop.y > height + 50) {
                drop.y = random(-200, -50)
                drop.x = random(-50, width + 50)
            }

            // horizontal boundary check
            if (drop.x < -100) {
                drop.x = width + 50
            } else if (drop.x > width + 100) {
                drop.x = -50
            }
        }
    }

    draw() {
        if (!this.isActive) return

        for (let drop of this.raindrops) {
            if (drop.isEmoji) {
                // draw umbrella emoji
                fill(255, 255, 255, drop.opacity)
                noStroke()
                textAlign(CENTER, CENTER)
                textSize(40)
                text('☂️', drop.x, drop.y)
            } else {
                // draw normal raindrop
                stroke(150, 150, 255, drop.opacity)
                strokeWeight(1.5)
                line(
                    drop.x,
                    drop.y,
                    drop.x + drop.wind * 2,
                    drop.y + drop.length
                )
            }
        }

        // reset text settings to avoid affecting other text
        textAlign(LEFT, BASELINE)
        textSize(12)
    }

    start() {
        this.isActive = true
    }

    stop() {
        this.isActive = false
    }
}

class Snow {
    constructor() {
        this.snowflakes = []
        this.intensity = 100 // number of snowflakes
        this.isActive = false
        this.windStrength = 0.3
        this.initializeSnowflakes()
    }

    initializeSnowflakes() {
        this.snowflakes = []
        for (let i = 0; i < this.intensity; i++) {
            this.snowflakes.push({
                x: random(-50, width + 50),
                y: random(-500, -50),
                speed: random(1, 4),
                size: random(3, 8),
                opacity: random(180, 255),
                drift: random(-this.windStrength, this.windStrength),
                isEmoji: random() < 0.01, // 1% chance to be an emoji
            })
        }
    }

    update() {
        if (!this.isActive) return

        for (let flake of this.snowflakes) {
            // snowflakes fall and drift
            flake.y += flake.speed
            flake.x +=
                flake.drift + sin(frameCount * 0.01 + flake.x * 0.01) * 0.5

            // reset snowflakes that are off screen
            if (flake.y > height + 50) {
                flake.y = random(-200, -50)
                flake.x = random(-50, width + 50)
            }

            // horizontal boundary check
            if (flake.x < -100) {
                flake.x = width + 50
            } else if (flake.x > width + 100) {
                flake.x = -50
            }
        }
    }

    draw() {
        if (!this.isActive) return

        for (let flake of this.snowflakes) {
            if (flake.isEmoji) {
                // draw snowman emoji
                fill(255, 255, 255, flake.opacity)
                noStroke()
                textAlign(CENTER, CENTER)
                textSize(40)
                text('⛄️', flake.x, flake.y)
            } else {
                // draw normal snowflake
                noStroke()
                fill(255, 255, 255, flake.opacity)
                // Simple ellipse snowflake
                ellipse(flake.x, flake.y, flake.size, flake.size * 0.8)
            }
        }

        // reset text settings to avoid affecting other text
        textAlign(LEFT, BASELINE)
        textSize(12)
    }

    start() {
        this.isActive = true
    }

    stop() {
        this.isActive = false
    }
}
