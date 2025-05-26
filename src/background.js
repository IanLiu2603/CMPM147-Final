// Background system for the digital garden
class Background {
    constructor() {
        this.timeOfDay = 0.5 // 0 = midnight, 0.5 = noon, 1 = midnight again
        this.clouds = []
        this.stars = []
        this.initializeClouds()
        this.initializeStars()
    }

    // Initialize cloud positions
    initializeClouds() {
        for (let i = 0; i < 5; i++) {
            this.clouds.push({
                x: random(width),
                y: random(50, 200),
                size: random(60, 120),
                speed: random(0.2, 0.8),
            })
        }
    }

    // Initialize star positions
    initializeStars() {
        for (let i = 0; i < 100; i++) {
            this.stars.push({
                x: random(width),
                y: random(0, height * 0.6),
                brightness: random(100, 255),
                twinkleSpeed: random(0.02, 0.05),
            })
        }
    }

    // Update time of day (can be controlled by time control system)
    updateTime(deltaTime) {
        this.timeOfDay += deltaTime
        if (this.timeOfDay > 1) this.timeOfDay = 0
        if (this.timeOfDay < 0) this.timeOfDay = 1
    }

    // Draw the complete background
    draw() {
        this.drawSky()
        this.drawCelestialBodies()
        this.drawClouds()
        this.drawStars()
        this.drawGround()
    }

    // Draw sky gradient based on time of day
    drawSky() {
        // Define colors for different times
        let dayColor = color(135, 206, 235) // Sky blue
        let sunsetColor = color(255, 165, 0) // Orange
        let nightColor = color(25, 25, 112) // Midnight blue

        let skyColor

        if (this.timeOfDay < 0.2) {
            // Night to dawn
            skyColor = lerpColor(nightColor, sunsetColor, this.timeOfDay * 5)
        } else if (this.timeOfDay < 0.3) {
            // Dawn to day
            skyColor = lerpColor(
                sunsetColor,
                dayColor,
                (this.timeOfDay - 0.2) * 10
            )
        } else if (this.timeOfDay < 0.7) {
            // Day
            skyColor = dayColor
        } else if (this.timeOfDay < 0.8) {
            // Day to sunset
            skyColor = lerpColor(
                dayColor,
                sunsetColor,
                (this.timeOfDay - 0.7) * 10
            )
        } else {
            // Sunset to night
            skyColor = lerpColor(
                sunsetColor,
                nightColor,
                (this.timeOfDay - 0.8) * 5
            )
        }

        // Draw gradient sky
        for (let i = 0; i <= height; i++) {
            let inter = map(i, 0, height, 0, 1)
            let gradientColor = lerpColor(
                skyColor,
                color(
                    red(skyColor) * 0.7,
                    green(skyColor) * 0.7,
                    blue(skyColor) * 0.7
                ),
                inter
            )
            stroke(gradientColor)
            line(0, i, width, i)
        }
    }

    // Draw sun or moon based on time of day
    drawCelestialBodies() {
        let celestialX = map(this.timeOfDay, 0, 1, -100, width + 100)
        let celestialY = map(sin(this.timeOfDay * PI), 0, 1, height * 0.8, 50)

        if (this.timeOfDay > 0.2 && this.timeOfDay < 0.8) {
            // Draw sun
            fill(255, 255, 0, 200)
            noStroke()
            ellipse(celestialX, celestialY, 80, 80)

            // Sun rays
            stroke(255, 255, 0, 100)
            strokeWeight(2)
            for (let i = 0; i < 8; i++) {
                let angle = (i * PI) / 4
                let x1 = celestialX + cos(angle) * 50
                let y1 = celestialY + sin(angle) * 50
                let x2 = celestialX + cos(angle) * 70
                let y2 = celestialY + sin(angle) * 70
                line(x1, y1, x2, y2)
            }
        } else {
            // Draw moon
            fill(220, 220, 220, 180)
            noStroke()
            ellipse(celestialX, celestialY, 60, 60)

            // Moon craters
            fill(200, 200, 200, 100)
            ellipse(celestialX - 10, celestialY - 5, 8, 8)
            ellipse(celestialX + 8, celestialY + 8, 6, 6)
            ellipse(celestialX - 5, celestialY + 12, 4, 4)
        }
    }

    // Draw animated clouds
    drawClouds() {
        fill(255, 255, 255, 150)
        noStroke()

        for (let cloud of this.clouds) {
            // Move clouds
            cloud.x += cloud.speed
            if (cloud.x > width + cloud.size) {
                cloud.x = -cloud.size
            }

            // Draw cloud (multiple circles)
            ellipse(cloud.x, cloud.y, cloud.size, cloud.size * 0.6)
            ellipse(
                cloud.x + cloud.size * 0.3,
                cloud.y,
                cloud.size * 0.8,
                cloud.size * 0.5
            )
            ellipse(
                cloud.x - cloud.size * 0.3,
                cloud.y,
                cloud.size * 0.8,
                cloud.size * 0.5
            )
            ellipse(
                cloud.x + cloud.size * 0.6,
                cloud.y + cloud.size * 0.1,
                cloud.size * 0.6,
                cloud.size * 0.4
            )
            ellipse(
                cloud.x - cloud.size * 0.6,
                cloud.y + cloud.size * 0.1,
                cloud.size * 0.6,
                cloud.size * 0.4
            )
        }
    }

    // Draw twinkling stars (only visible at night)
    drawStars() {
        if (this.timeOfDay < 0.2 || this.timeOfDay > 0.8) {
            noStroke()

            for (let star of this.stars) {
                // Twinkling effect
                star.brightness += sin(frameCount * star.twinkleSpeed) * 20
                star.brightness = constrain(star.brightness, 100, 255)

                fill(255, 255, 255, star.brightness)
                ellipse(star.x, star.y, 2, 2)
            }
        }
    }

    // Draw ground/grass
    drawGround() {
        // Ground
        fill(34, 139, 34) // Forest green
        noStroke()
        rect(0, height * 0.85, width, height * 0.15)
    }

    // Method to set time of day (for time control system)
    setTimeOfDay(time) {
        this.timeOfDay = constrain(time, 0, 1)
    }

    // Get current time of day
    getTimeOfDay() {
        return this.timeOfDay
    }
}
