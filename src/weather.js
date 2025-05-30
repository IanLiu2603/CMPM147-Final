//Author: Chengkun Li
//Date: 5/29/2025
//This file is used to create a class for rain and snow.
//These are used to draw a background with a day/night cycle, clouds, stars, and a ground

// Reference:
// https://editor.p5js.org/monicawen/sketches/HkU-BCJqm
// https://editor.p5js.org/son/sketches/ry8-HnOAQ
// get thunder sound play way from ChatGPT
// get water splash effect from ChatGPT
class Rain {
    constructor(thunder1, thunder2, rainSound) {
        this.raindrops = []
        this.splashes = []
        this.intensity = 120 // number of raindrops
        this.isActive = false
        this.windStrength = 0.5
        this.initializeRaindrops()

        this.thunderSound1 = thunder1
        this.thunderSound2 = thunder2
        this.thunderSound1.setVolume(0.1)
        this.thunderSound2.setVolume(0.1)

        this.rainSound = rainSound
        this.rainSound.setVolume(0.03)
        this.rainSound.setLoop(true)
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

            // reset rain drops when they hit the ground
            if (drop.y > height * 0.85) {
                this.createSplash(drop.x, height * 0.85)
                drop.y = random(-200, -50)
                drop.x = random(-50, width + 50)
            }
        }

        // update splash effects
        for (let i = this.splashes.length - 1; i >= 0; i--) {
            let splash = this.splashes[i]
            splash.age++

            // update splash particles
            for (let particle of splash.particles) {
                particle.x += particle.vx
                particle.y += particle.vy
                particle.vy += 0.07
                particle.opacity -= 3
            }
            // remove splash when it's old enough
            if (splash.age > 30) {
                this.splashes.splice(i, 1)
            }
        }
    }

    // create splash effect when raindrop hits ground
    createSplash(x, y) {
        let splash = {
            x: x,
            y: y,
            age: 0,
            particles: [],
        }

        // create splash particles
        for (let i = 0; i < 6; i++) {
            splash.particles.push({
                x: x,
                y: y,
                vx: random(-2, 2),
                vy: random(-3, -1),
                opacity: 255,
                size: random(2, 4),
            })
        }

        this.splashes.push(splash)
    }

    draw() {
        if (!this.isActive) return
        // draw raindrops
        this.playThunder()
        for (let drop of this.raindrops) {
            if (drop.isEmoji) {
                // draw umbrella emoji
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

        // draw splash effects
        for (let splash of this.splashes) {
            for (let particle of splash.particles) {
                if (particle.opacity > 0) {
                    fill(150, 200, 255, particle.opacity)
                    noStroke()
                    ellipse(
                        particle.x,
                        particle.y,
                        particle.size,
                        particle.size
                    )
                }
            }
        }
        // reset text settings to avoid affecting other text
        textAlign(LEFT, BASELINE)
        textSize(12)
    }

    playThunder() {
        if (random() < 0.003) {
            if (random() < 0.5) {
                this.thunderSound1.play()
            } else {
                this.thunderSound2.play()
            }
        }
    }

    start() {
        this.isActive = true
        this.rainSound.play()
    }
    stop() {
        this.isActive = false
        this.rainSound.stop()
    }
}

class Snow {
    constructor() {
        this.snowflakes = []
        this.intensity = 100 // number of snowflakes
        this.isActive = false
        this.windStrength = 0.3
        this.groundStayTime = 60
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
                isGrounded: false,
                groundTimer: 0, // timer for how long it's been on ground
            })
        }
    }

    update() {
        if (!this.isActive) return

        for (let flake of this.snowflakes) {
            if (!flake.isGrounded) {
                flake.y += flake.speed
                flake.x +=
                    flake.drift + sin(frameCount * 0.01 + flake.x * 0.01) * 0.5
                // check if snowflake hits the ground
                if (flake.y > height * 0.85) {
                    flake.isGrounded = true
                    flake.y = height * 0.85 // position exactly on ground
                    flake.groundTimer = 0
                    flake.speed = 0 // stop falling
                }
            } else {
                flake.groundTimer++
                flake.opacity = map(
                    flake.groundTimer,
                    0,
                    this.groundStayTime,
                    255,
                    50
                )
                // reset snowflake after staying on ground for specified time
                if (flake.groundTimer >= this.groundStayTime) {
                    flake.y = random(-200, -50)
                    flake.x = random(-50, width + 50)
                    flake.speed = random(1, 4)
                    flake.opacity = random(180, 255)
                    flake.isGrounded = false
                    flake.groundTimer = 0
                }
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
