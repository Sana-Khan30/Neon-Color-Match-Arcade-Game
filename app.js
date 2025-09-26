        const displayScore = document.querySelector('.display-score');
        const displayStreak = document.querySelector('.display-streak');
        const displayLevel = document.querySelector('.display-level');
        const displayHigh = document.querySelector('.display-highscore');
        const targetColorText = document.querySelector('.target-color');
        const divContainer = document.querySelector('.div-container');
        const timerFill = document.querySelector('.timer-fill');
        const gameOverText = document.querySelector('.game-over');
        const restartBtn = document.querySelector('.restart-btn');

        const colors = [
            {name: "Neon Pink", hex: "#ff00ff"},
            {name: "Neon Cyan", hex: "#00ffff"},
            {name: "Neon Green", hex: "#39ff14"},
            {name: "Neon Blue", hex: "#1f51ff"},
            {name: "Neon Orange", hex: "#ff6700"},
            {name: "Neon Yellow", hex: "#ffff33"},
            {name: "Neon Red", hex: "#ff073a"},
            {name: "Neon Purple", hex: "#a200ff"},
            {name: "Electric Lime", hex: "#ccff00"},
            {name: "Neon Aqua", hex: "#00ffcc"},
            {name: "Hot Magenta", hex: "#ff1dce"},
            {name: "Laser Lemon", hex: "#ffff66"},
            {name: "Neon Sky", hex: "#66fcf1"},
            {name: "Plasma Violet", hex: "#9d4edd"}
        ];

        let displayedColors = [];
        let score = 0, streak = 0, level = 1, highScore = 0;
        let targetColor = null;
        let timer = 30, interval;

        // Load high score
        if (localStorage.getItem("neonHighScore")) {
            highScore = Number(localStorage.getItem("neonHighScore"));
            displayHigh.textContent = "High Score: " + highScore;
        }

        function createColorBoxes(limit) {
            divContainer.innerHTML = "";
            displayedColors = [...colors].sort(() => 0.5 - Math.random()).slice(0, limit);
            displayedColors.forEach(colorObj => {
                const box = document.createElement('div');
                box.className = 'color-box';
                box.style.backgroundColor = colorObj.hex;
                box.style.color = colorObj.hex;
                box.addEventListener('click', () => matchColor(box, colorObj.name));
                divContainer.appendChild(box);
            });
            return displayedColors;
        }

        function setNewTargetColor() {
            let limit = Math.min(colors.length, 3 + level * 2);
            const shown = createColorBoxes(limit);
            targetColor = shown[Math.floor(Math.random() * shown.length)];
            targetColorText.textContent = `Target: ${targetColor.name}`;
        }

        function showBonusText(amount) {
            const timerContainer = document.querySelector('.timer-container');
            const bonus = document.createElement('span');
            bonus.className = 'bonus-time';
            bonus.textContent = `+${amount}s`;
            timerContainer.appendChild(bonus);
            setTimeout(() => bonus.remove(), 1000);
        }

        function matchColor(box, clickedName) {
            if (!targetColor) return;
            if (clickedName === targetColor.name) {
                score++;
                streak++;

                // 🕒 Bonus time
                let bonus = (streak >= 5) ? 4 : 2;
                timer = Math.min(timer + bonus, 60);
                timerFill.style.width = (timer / 30) * 100 + "%";
                showBonusText(bonus);

                if (streak % 3 === 0) score += 2;
                if (score % 5 === 0) level++;
                box.classList.add('correct');
                setTimeout(() => box.classList.remove('correct'), 600);
            } else {
                streak = 0;
                box.classList.add('wrong');
                setTimeout(() => box.classList.remove('wrong'), 400);
            }
            updateUI();
            setNewTargetColor();
        }

        function updateUI() {
            displayScore.textContent = "Score: " + score;
            displayStreak.textContent = "Streak: " + streak;
            displayLevel.textContent = "Level: " + level;
            if (score > highScore) {
                highScore = score;
                localStorage.setItem("neonHighScore", highScore);
                displayHigh.textContent = "High Score: " + highScore;
            }
        }

        function startTimer() {
            timer = 30;
            timerFill.style.width = "100%";
            clearInterval(interval);
            interval = setInterval(() => {
                timer--;
                timerFill.style.width = (timer / 30) * 100 + "%";
                if (timer <= 0) endGame();
            }, 1000);
        }

        function endGame() {
            clearInterval(interval);
            divContainer.innerHTML = "";
            targetColorText.textContent = "Target: ?";
            gameOverText.textContent = `⏳ Time’s Up! Final Score: ${score}`;
            restartBtn.style.display = 'inline-block';
        }

        function startGame() {
            score = 0; streak = 0; level = 1; gameOverText.textContent = "";
            restartBtn.style.display = 'none';
            updateUI();
            setNewTargetColor();
            startTimer();
        }

        restartBtn.addEventListener('click', startGame);
        startGame();