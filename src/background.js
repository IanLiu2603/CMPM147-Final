//Author: Chengkun Li
//Date: 5/28/2025
//Background class takes in parameters to dictate the time of day, clouds, stars, and a ground.
//These are used to draw a background with a day/night cycle, clouds, stars, and a ground

class Background {
    constructor() {
        this.timeOfDay = 0 // 0 = midnight, 0.5 = noon, 1 = midnight again
        this.clouds = []
        this.stars = []
        this.initializeClouds()
        this.initializeStars()
        this.paused = false
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
        if (!paused) {
            this.timeOfDay += deltaTime
            if (this.timeOfDay > 1) this.timeOfDay = 0
            if (this.timeOfDay < 0) this.timeOfDay = 1
        }
    }

    // Draw the complete background
    draw() {
        this.drawSky()
        this.drawSun()
        this.drawMoon()
        this.drawStars()
        this.drawMountains()
        this.drawClouds()
        this.drawGround()
    }

    // Draw sky gradient based on time of day
    drawSky() {
        // Define colors for different times
        let dayColor = color('#008DDA') // Sky blue
        let sunsetColor = color('#FCB454') // Orange
        let nightColor = color('#201658') // Midnight blue

        let skyColor

        if (this.timeOfDay < 0.35) {
            // Night time
            skyColor = nightColor
        } else if (this.timeOfDay < 0.4) {
            // Dawn transition
            skyColor = lerpColor(
                nightColor,
                sunsetColor,
                (this.timeOfDay - 0.35) * 20
            )
        } else if (this.timeOfDay < 0.5) {
            // Dawn to day
            skyColor = lerpColor(
                sunsetColor,
                dayColor,
                (this.timeOfDay - 0.4) * 10
            )
        } else if (this.timeOfDay < 0.9) {
            // Day time
            skyColor = dayColor
        } else if (this.timeOfDay < 0.95) {
            // Day to sunset
            skyColor = lerpColor(
                dayColor,
                sunsetColor,
                (this.timeOfDay - 0.9) * 20
            )
        } else {
            // Sunset to night
            skyColor = lerpColor(
                sunsetColor,
                nightColor,
                (this.timeOfDay - 0.95) * 20
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

    // Draw sun
    drawSun() {
        // Sun is visible during day time (0.4 to 1.0)
        let sunAlpha = 0
        if (this.timeOfDay >= 0.4) {
            if (this.timeOfDay < 0.45) {
                // Dawn - sun fading in
                sunAlpha = map(this.timeOfDay, 0.4, 0.45, 0, 200)
            } else if (this.timeOfDay > 0.95) {
                // Dusk - sun fading out
                sunAlpha = map(this.timeOfDay, 0.95, 1.0, 200, 0)
            } else {
                // Full day
                sunAlpha = 200
            }
        }

        if (sunAlpha > 0) {
            // Calculate sun position based on its visible time (0.4 to 1.0)
            let sunProgress = map(this.timeOfDay, 0.4, 1.0, 0, 1)
            let sunX = map(sunProgress, 0, 1, 50, width - 50) // From left to right
            let sunY = map(sin(sunProgress * PI), 0, 1, height * 0.85, 50) // Arc from horizon to sky

            // Draw sun
            fill(255, 255, 0, sunAlpha)
            noStroke()
            ellipse(sunX, sunY, 60, 60)

            // Sun rays
            stroke(255, 255, 0, sunAlpha * 0.5)
            strokeWeight(10)
            for (let i = 0; i < 8; i++) {
                let angle = (i * PI) / 4
                let x1 = sunX + cos(angle) * 40
                let y1 = sunY + sin(angle) * 40
                let x2 = sunX + cos(angle) * 60
                let y2 = sunY + sin(angle) * 60
                line(x1, y1, x2, y2)
            }
        }
    }

    // Draw moon
    drawMoon() {
        // Moon is visible during night time (0.0 to 0.4)
        let moonAlpha = 0
        if (this.timeOfDay <= 0.4) {
            if (this.timeOfDay < 0.05) {
                // Early night - moon fading in
                moonAlpha = map(this.timeOfDay, 0.0, 0.05, 0, 180)
            } else if (this.timeOfDay > 0.35) {
                // Pre-dawn - moon fading out
                moonAlpha = map(this.timeOfDay, 0.35, 0.4, 180, 0)
            } else {
                // Deep night - full visibility
                moonAlpha = 180
            }
        }

        if (moonAlpha > 0) {
            // Calculate moon position based on its visible time (0.0 to 0.4)
            let moonProgress = map(this.timeOfDay, 0.0, 0.4, 0, 1)
            let moonX = map(moonProgress, 0, 1, 50, width - 50) // From left to right
            let moonY = map(sin(moonProgress * PI), 0, 1, height * 0.85, 50) // Arc from horizon to sky

            // Draw moon
            fill(220, 220, 220, moonAlpha)
            noStroke()
            ellipse(moonX, moonY, 60, 60)

            // Moon craters
            fill(200, 200, 200, moonAlpha * 0.6)
            ellipse(moonX - 10, moonY - 5, 8, 8)
            ellipse(moonX + 8, moonY + 8, 6, 6)
            ellipse(moonX - 5, moonY + 12, 4, 4)
        }
    }

    // Draw mountains
    drawMountains() {
        this.drawMountainLayer(0.3, color(60, 60, 80, 255), 0.8) // Far mountains
        this.drawMountainLayer(0.4, color(80, 80, 100, 255), 0.6) // Mid mountains
        this.drawMountainLayer(0.5, color(100, 100, 120, 255), 0.4) // Near mountains
    }

    // idea from Experiment 2
    drawMountainLayer(baseHeight, mountainColor, noiseScale) {
        fill(mountainColor)
        noStroke()
        beginShape()
        vertex(0, height)
        for (let x = 0; x <= width; x += 5) {
            let noiseValue = noise(x * 0.01 * noiseScale)
            let mountainHeight = height * baseHeight + noiseValue * height * 0.3
            vertex(x, mountainHeight)
        }
        vertex(width, height)
        endShape(CLOSE)
    }

    // Draw animated clouds
    drawClouds() {
        fill(255, 255, 255, 150)
        noStroke()

        for (let cloud of this.clouds) {
            // Move clouds
            if (!paused) {
                cloud.x += cloud.speed
                if (cloud.x > width + cloud.size) {
                    cloud.x = -cloud.size
                }
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

    drawStars() {
        if (this.timeOfDay <= 0.4) {
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

    drawGround() {
        fill(34, 139, 34)
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
    pause() {
        this.paused = true
    }
    resume() {
        this.paused = false
    }
}
