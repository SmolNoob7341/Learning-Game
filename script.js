document.addEventListener("DOMContentLoaded", function() {
  const homeScreen = document.getElementById("homeScreen");
  const moreOptionsScreen = document.getElementById("moreOptionsScreen");
  const gameArea = document.getElementById("gameArea");
  const materialButtons = document.querySelectorAll(".material-button");
  const backToHomeButton = document.getElementById("backToHomeButton");
  const backButton = document.getElementById("backButton");
  const balloonContainer = document.getElementById("balloon-container");
  const fireworksContainer = document.getElementById("fireworks-container");
  const sounds = {
    error: new Audio("error-126627.mp3"),
    yay: new Audio("yay-6326.mp3")
  };
  let currentMaterial = "letters";
  let current;

  materialButtons.forEach(button => {
    button.addEventListener("click", function() {
      currentMaterial = this.dataset.material;
      showScreen(gameArea);
      startGame(currentMaterial);
    });
  });
  document.getElementById("moreOptionsButton").addEventListener("click", function() {
    showScreen(moreOptionsScreen);
  });
  backButton.addEventListener("click", function() {
    showScreen(homeScreen);
  });
  backToHomeButton.addEventListener("click", function() {
    showScreen(homeScreen);
  });
  
  function showScreen(screen) {
    homeScreen.classList.remove('active');
    moreOptionsScreen.classList.remove('active');
    gameArea.classList.remove('active');
    screen.classList.add('active');
  }

  function startGame(material) {
    const elements = getGameElements();
    resetGame(elements, material);

    function resetGame(elements, material) {
      current = generateQuestion(material);
      elements.letter.textContent = current.question;

      const answers = generateAnswerOptions(current.correctAnswer, material);
      updateAnswerButtons(elements, answers);
    }

    function getGameElements() {
      return ['letter', 'ans1', 'ans2', 'ans3', 'ans4', 'header'].reduce((acc, id) => {
        acc[id] = document.getElementById(id);
        return acc;
      }, {});
    }

    function generateQuestion(material) {
      if (material === "letters") {
        return generateLetterQuestion();
      } else if (material === "pre-k") {
        return generatePreKMathQuestion();
      } else if (material === "kindergarten") {
        return generateKindergartenMathQuestion();
      }
      // Add more material types here
    }

    function generateLetterQuestion() {
      const letters = 'abcdefghijklmnopqrstuvwxyz';
      const possibility = [...letters, ...letters.toUpperCase()];
      const question = possibility[Math.floor(Math.random() * possibility.length)];
      return { question, correctAnswer: question };
    }

    function generatePreKMathQuestion() {
      const num1 = Math.floor(Math.random() * 5) + 1;
      const num2 = Math.floor(Math.random() * 5) + 1;
      const question = `${num1} + ${num2}`;
      const correctAnswer = (num1 + num2).toString();
      return { question, correctAnswer };
    }

    function generateKindergartenMathQuestion() {
      const num1 = Math.floor(Math.random() * 10) + 1;
      const num2 = Math.floor(Math.random() * 10) + 1;
      const question = `${num1} + ${num2}`;
      const correctAnswer = (num1 + num2).toString();
      return { question, correctAnswer };
    }

    function generateAnswerOptions(correctAnswer, material) {
      const answers = [correctAnswer];
      while (answers.length < 4) {
        const wrongAnswer = generateWrongAnswer(material);
        if (!answers.includes(wrongAnswer)) {
          answers.push(wrongAnswer);
        }
      }
      return shuffleArray(answers);
    }

    function generateWrongAnswer(material) {
      if (material === "letters") {
        const letters = 'abcdefghijklmnopqrstuvwxyz';
        const possibility = [...letters, ...letters.toUpperCase()];
        return possibility[Math.floor(Math.random() * possibility.length)];
      } else {
        return (Math.floor(Math.random() * 20)).toString(); // For math questions
      }
    }

    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }

    function updateAnswerButtons(elements, answers) {
      ['ans1', 'ans2', 'ans3', 'ans4'].forEach((id, i) => {
        elements[id].textContent = answers[i];
        elements[id].removeEventListener("click", verdict);
        elements[id].addEventListener("click", verdict);
      });
    }

    function verdict() {
      const answerButtons = document.querySelectorAll('.button');
      answerButtons.forEach(button => {
        button.disabled = true; // Disable all answer buttons
      });
      
      if (this.textContent === current.correctAnswer) {
        startCelebration();
        sounds.yay.play();
        setTimeout(() => {
          resetGame(elements, material);
          stopCelebration();
          answerButtons.forEach(button => {
            button.disabled = false;
          });
        }, 3000);
      } else {
        sounds.error.play();
        this.textContent = "❌";
      }
    }

    function startCelebration() {
      changeBackground();
      createFireworks();
      createBalloons();
    }

    function stopCelebration() {
      resetBackground();
      clearFireworks();
      clearBalloons();
    }

    function changeBackground() {
      document.body.style.backgroundColor = getRandomColor();
    }

    function resetBackground() {
      document.body.style.backgroundColor = '#f4f4f4';
    }

    function createFireworks() {
      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          const firework = document.createElement('div');
          firework.className = 'firework';
          firework.style.left = `${Math.random() * 100}%`;
          firework.style.backgroundColor = getRandomColor(); // Randomize color
          fireworksContainer.appendChild(firework);
          setTimeout(() => firework.remove(), 1000);
        }, i * 200);
      }
    }

    function clearFireworks() {
      fireworksContainer.innerHTML = '';
    }

    function createBalloons() {
      for (let i = 0; i < 14; i++) {
        setTimeout(() => {
          const balloon = document.createElement('div');
          balloon.className = 'balloon';
          balloon.style.left = `${Math.random() * 100}%`;
          balloon.style.backgroundColor = getRandomColor();
          balloonContainer.appendChild(balloon);
          animateBalloon(balloon);
        }, i * 200);
      }
    }

    function clearBalloons() {
      balloonContainer.innerHTML = '';
    }

    function animateBalloon(balloon) {
      let bottom = -100;
      const interval = setInterval(() => {
        if (bottom > window.innerHeight) {
          clearInterval(interval);
          balloon.remove();
        } else {
          bottom += 9; // Increase the increment value for faster balloons
          balloon.style.bottom = `${bottom}px`;
        }
      }, 20);
    }

    function getRandomColor() {
      const colors = ['#FF5733', '#3498DB', '#2ECC71', '#F1C40F', '#9B59B6', '#E74C3C', '#1ABC9C'];
      return colors[Math.floor(Math.random() * colors.length)];
    }
  }
});
