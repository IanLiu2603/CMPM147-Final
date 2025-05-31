//Author: Chengkun Li
//Date: 5/28/2025
//Background class takes in parameters to dictate the time of day, clouds, stars, and a ground.
//These are used to draw a background with a day/night cycle, clouds, stars, and a ground

// Reference:
// from Jackie Sanchez line 200 - 234: https://github.com/Jsanc189/cmpm147/blob/master/experiment2/js/sketch.js
// from Starfield Screensaver's response: https://stackoverflow.com/questions/35460303/how-to-convert-decimal-hour-value-to-hhmmss

class Background {
    constructor() {
        this.timeOfDay = 0 // 0-24 hours, 0 = midnight, 12 = noon, 18 = sunset, 6 = sunrise
        this.clouds = []
        this.stars = []
        this.initializeClouds()
        this.initializeStars()
        this.paused = false
    }
    // Initialize cloud positions
    initializeClouds() {
        for (let i = 0; i < 50; i++) {
            let cloud = {
                x: random(width),
                y: random(50, 200),
                size: random(20, 40),
                speed: random(0.2, 0.8),
                circle: [],
            }

            // idea from Jackie Sanchez
            // line 200 - 234: https://github.com/Jsanc189/cmpm147/blob/master/experiment2/js/sketch.js
            for (let j = 0; j < 200; j++) {
                let puff = {
                    x: randomGaussian(0, cloud.size),
                    y: randomGaussian(0, cloud.size * 0.4),
                    size: random(cloud.size * 0.15, cloud.size * 0.4),
                    alpha: random(30, 120),
                }
                cloud.circle.push(puff)
            }

            this.clouds.push(cloud)
        }
    }

    // Initialize star positions
    initializeStars() {
        for (let i = 0; i < 200; i++) {
            this.stars.push({
                x: random(width),
                y: random(0, height * 0.6),
                brightness: random(100, 255),
                twinkleSpeed: random(0.02, 0.05),
                speed: random(0.01, 0.05),
            })
        }
    }

    // Update time of day (can be controlled by time control system)
    updateTime(deltaTime) {
        if (!paused) {
            this.timeOfDay += deltaTime * 24 // Convert deltaTime to hours
            if (this.timeOfDay >= 24) this.timeOfDay = 0
            if (this.timeOfDay < 0) this.timeOfDay = 24
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

        if (this.timeOfDay < 5.5 || this.timeOfDay >= 18.5) {
            skyColor = nightColor
        } else if (this.timeOfDay < 6.5) {
            skyColor = lerpColor(
                nightColor,
                sunsetColor,
                (this.timeOfDay - 5.5) / 1.0
            )
        } else if (this.timeOfDay < 7.5) {
            skyColor = lerpColor(
                sunsetColor,
                dayColor,
                (this.timeOfDay - 6.5) / 1.0
            )
        } else if (this.timeOfDay < 17.5) {
            skyColor = dayColor
        } else if (this.timeOfDay < 18.0) {
            skyColor = lerpColor(
                dayColor,
                sunsetColor,
                (this.timeOfDay - 17.5) / 0.5
            )
        } else {
            skyColor = lerpColor(
                sunsetColor,
                nightColor,
                (this.timeOfDay - 18.0) / 0.5
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
        // Sun is visible during daytime (6:00 to 18:00)
        let sunAlpha = 0
        if (this.timeOfDay >= 6.0 && this.timeOfDay <= 18.0) {
            if (this.timeOfDay < 7.0) {
                // Dawn - sun fading in
                sunAlpha = map(this.timeOfDay, 6.0, 7.0, 0, 200)
            } else if (this.timeOfDay > 17.0) {
                // Dusk - sun fading out
                sunAlpha = map(this.timeOfDay, 17.0, 18.0, 200, 0)
            } else {
                // Full day
                sunAlpha = 200
            }
        }

        if (sunAlpha > 0) {
            // Calculate sun position based on daytime hours (6:00 to 18:00)
            let sunProgress = map(this.timeOfDay, 6.0, 18.0, 0, 1)
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
        // Moon is visible during nighttime (18:00 to 6:00)
        let moonAlpha = 0
        if (this.timeOfDay < 6.0 || this.timeOfDay > 18.0) {
            if (this.timeOfDay < 1.0 || this.timeOfDay > 23.0) {
                // Early night or very late night - moon fading in/out
                if (this.timeOfDay > 23.0) {
                    moonAlpha = map(this.timeOfDay, 23.0, 24.0, 0, 180)
                } else {
                    moonAlpha = map(this.timeOfDay, 0.0, 1.0, 180, 180)
                }
            } else if (this.timeOfDay > 5.0 && this.timeOfDay < 6.0) {
                // Pre-dawn - moon fading out
                moonAlpha = map(this.timeOfDay, 5.0, 6.0, 180, 0)
            } else if (this.timeOfDay > 18.0 && this.timeOfDay < 19.0) {
                // Early evening - moon fading in
                moonAlpha = map(this.timeOfDay, 18.0, 19.0, 0, 180)
            } else {
                // Deep night - full visibility
                moonAlpha = 180
            }
        }

        if (moonAlpha > 0) {
            // Calculate moon position for nighttime hours
            let moonProgress
            if (this.timeOfDay >= 18.0) {
                // Evening to midnight
                moonProgress = map(this.timeOfDay, 18.0, 24.0, 0, 0.5)
            } else {
                // Midnight to dawn
                moonProgress = map(this.timeOfDay, 0.0, 6.0, 0.5, 1.0)
            }

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
        noStroke()

        for (let cloud of this.clouds) {
            // Move clouds
            if (!paused) {
                cloud.x += cloud.speed
                if (cloud.x > width + cloud.size) {
                    cloud.x = -cloud.size
                }
            }

            // Draw all circle for this cloud
            for (let puff of cloud.circle) {
                fill(255, 255, 255, puff.alpha)
                ellipse(
                    cloud.x + puff.x,
                    cloud.y + puff.y,
                    puff.size,
                    puff.size * 0.8
                )
            }
        }
    }

    drawStars() {
        if (this.timeOfDay < 6.0 || this.timeOfDay > 18.0) {
            noStroke()
            for (let star of this.stars) {
                // Move stars
                if (!this.paused) {
                    star.x -= star.speed
                    if (star.x < -5) {
                        star.x = width + 5
                        star.y = random(0, height * 0.6)
                    }
                }

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
    setTimeOfDay(hours) {
        this.timeOfDay = constrain(hours, 0, 24)
    }

    // Get current time of day
    getTimeOfDay() {
        return this.timeOfDay
    }

    // Get formatted time string
    // from Starfield Screensaver's response: https://stackoverflow.com/questions/35460303/how-to-convert-decimal-hour-value-to-hhmmss
    getFormattedTime() {
        let hours = Math.floor(this.timeOfDay)
        let minutes = Math.floor((this.timeOfDay - hours) * 60)
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
    }

    pause() {
        this.paused = true
    }
    resume() {
        this.paused = false
    }
}
