document.addEventListener("DOMContentLoaded", function() {
    const screens = document.querySelectorAll('.screen');
    const materialButtons = document.querySelectorAll(".material-button, .option-material-button");
    const backButton = document.querySelectorAll('.backButton');
    const singleAnswerContainer = document.getElementById("singleOptionsContainer");
    const multipleAnswerContainer = document.getElementById("multipleOptionsContainer"); 
    const submitButton = document.getElementById("submitButton");
    const singleOptionsContainer = document.getElementById("singleOptionsContainer");
    const multipleOptionsContainer = document.getElementById("multipleOptionsContainer");
    const balloonContainer = document.getElementById("balloon-container");
    const singleQuestion = document.getElementById("singleQuestion");
    const multipleQuestion = document.getElementById("multipleQuestion");
    const multipleQuestion2 = document.getElementById("multipleQuestion2");

    let currentMaterial = "letters";
    let currentQuestion;
    let selectedAnswers = [];

    materialButtons.forEach(button => {
        button.addEventListener("click", function() {
            currentMaterial = this.dataset.material;
            showScreen(document.getElementById('gameArea'));
            startGame(currentMaterial);
        });
    });

    document.getElementById("moreOptionsButton").addEventListener("click", function() {
        showScreen(document.getElementById('moreOptionsScreen'));
    });

    backButton.forEach(button => {
        button.addEventListener("click", function() {
            showScreen(document.getElementById('homeScreen'));
        });
    });

    document.getElementById("backToHomeButton").addEventListener("click", function() {
        showScreen(document.getElementById('homeScreen'));
    });

    function showScreen(screen) {
        screens.forEach(s => s.classList.remove('active'));
        screen.classList.add('active');
    }

    function startGame(material) {
        resetGame();

        function resetGame() {
            const questionType = getRandomQuestionType();
            currentQuestion = generateQuestion(material, questionType);

            if (questionType === "single") {
                showSingleAnswerQuestion(currentQuestion);
            } else if (questionType === "multiple") {
                showMultipleAnswerQuestion(currentQuestion);
            }
        }

        function getRandomQuestionType() {
            const types = ["single", "multiple"];
            return types[Math.floor(Math.random() * types.length)];
        }

        function generateQuestion(material, type) {
            if (material === "letters") {
                return generateLetterQuestion(type);
            } else if (material === "pre-k") {
                return generatePreKMathQuestion(type);
            } else if (material === "kindergarten") {
                return generateKindergartenMathQuestion(type);
            }
        }

        function generateLetterQuestion(type) {
            const letters = 'abcdefghijklmnopqrstuvwxyz';
            const randomIndex = Math.floor(Math.random() * letters.length);
            const letter = letters[randomIndex];
            const question = `What is the letter '${letter}'?`;
            if(type === "multiple"){
                let letter2 = letters[Math.floor(Math.random() * letters.length)];
                while(letter == letter2){
                    letter2 = letters[Math.floor(Math.random() * letters.length)];
                }
                const question2 = `What is the letter '${letter2}'?`;
                return {type, question, question2, letter, letter2}
            }else{
                return { type, question, correctAnswer: letter};
            }
        }

        function generatePreKMathQuestion(type) {
            const num1 = Math.floor(Math.random() * 5) + 1;
            const num2 = Math.floor(Math.random() * 5) + 1;
            const question = `${num1} + ${num2}`;
            const correctAnswer = (num1 + num2).toString();
            return { type, question, correctAnswer };
        }

        function generateKindergartenMathQuestion(type) {
            const num1 = Math.floor(Math.random() * 10) + 1;
            const num2 = Math.floor(Math.random() * 10) + 1;
            const question = `${num1} + ${num2}`;
            const correctAnswer = (num1 + num2).toString();
            return { type, question, correctAnswer };
        }

        function showSingleAnswerQuestion(question) {
            singleAnswerContainer.style.display = "block";
            multipleAnswerContainer.style.display = "none";
            submitButton.style.display = "none";
            singleQuestion.style.display = "block";
            multipleQuestion.style.display = "none";

            singleQuestion.textContent = question.question;
            const answers = generateAnswerOptions(question.correctAnswer);
            updateAnswerButtons(singleOptionsContainer, answers, "single");
        }

        function showMultipleAnswerQuestion(info) {
            singleAnswerContainer.style.display = "none";
            multipleAnswerContainer.style.display = "block";
            submitButton.style.display = "block";
            singleQuestion.style.display = "none";
            multipleQuestion.style.display = "block";

            multipleQuestion.textContent = info.question;
            multipleQuestion2.textContent = info.question2;
            const answers = generateAnswerOptions(info.letter, info.letter2);
            updateAnswerButtons(multipleOptionsContainer, answers, "multiple");
        }

        function generateAnswerOptions(correctAnswer, correctAnswer2) {
            let answers;
            if (correctAnswer2 != null) {
                answers = [correctAnswer, correctAnswer2];
                while (answers.length < 4) {
                    const wrongAnswer = generateRandomLetter();
                    if (!answers.includes(wrongAnswer) && wrongAnswer !== correctAnswer && wrongAnswer !== correctAnswer2) {
                        answers.push(wrongAnswer);
                    }
                }
            } else {
                answers = [correctAnswer];
                while (answers.length < 4) {
                    const wrongAnswer = generateRandomLetter();
                    if (!answers.includes(wrongAnswer) && wrongAnswer !== correctAnswer) {
                        answers.push(wrongAnswer);
                    }
                }
            }
            return shuffleArray(answers);
        }

        function generateRandomLetter() {
            const letters = 'abcdefghijklmnopqrstuvwxyz';
            return letters[Math.floor(Math.random() * letters.length)];
        }

        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }

        function updateAnswerButtons(container, answers, type) {
            container.innerHTML = '';
            answers.forEach(answer => {
                const button = document.createElement("button");
                button.textContent = answer;
                button.className = "answer-button";
                button.dataset.answer = answer; // Assigning the answer to the dataset
                button.addEventListener("click", () => {
                    if (type === "single") {
                        handleSingleAnswer(button, answer);
                    } else {
                        handleMultipleAnswer(button, answer);
                    }
                });
                container.appendChild(button);
            });
        }

        function handleSingleAnswer(button, answer) {
            if (answer === currentQuestion.correctAnswer) {
                handleCorrectAnswer(button);
            } else {
                handleIncorrectAnswer(button);
            }
        }

        function handleMultipleAnswer(button, answer) {
            button.classList.toggle("selected");
            if (selectedAnswers.includes(answer)) {
                selectedAnswers = selectedAnswers.filter(ans => ans !== answer);
            } else {
                selectedAnswers.push(answer);
            }
        }

        function handleCorrectAnswer(button) {
            button.classList.add("correct");
            startCelebration();
            setTimeout(() => {
                resetGame();
                stopCelebration();
            }, 3000);
        }

        function handleIncorrectAnswer(button) {
            const buttons = document.querySelectorAll('.answer-button'); // Select all answer buttons
            buttons.forEach(btn => {
                if (btn.textContent === button.textContent) {
                    btn.classList.add("incorrect");
                }
            });
        }

        submitButton.addEventListener("click", function() {
            if (selectedAnswers.includes(currentQuestion.correctAnswer)) {
                selectedAnswers.forEach(answer => {
                    const button = Array.from(multipleOptionsContainer.children).find(btn => btn.textContent === answer);
                    handleCorrectAnswer(button);
                });
            } else {
                selectedAnswers.forEach(answer => {
                    const button = Array.from(multipleOptionsContainer.children).find(btn => btn.textContent === answer);
                    handleIncorrectAnswer(button);
                });
            }
        });

        function startCelebration() {
            changeBackground();
            createBalloons();
        }

        function stopCelebration() {
            resetBackground();
            clearBalloons();
        }

        function changeBackground() {
            document.body.style.backgroundColor = getRandomColor();
        }

        function resetBackground() {
            document.body.style.backgroundColor = '#f4f4f4';
        }

        function createBalloons() {
            for (let i = 0; i < 60; i++) {
                setTimeout(() => {
                    const balloon = document.createElement('div');
                    balloon.className = 'balloon';
                    balloon.style.left = `${Math.random() * 100}%`;
                    balloon.style.backgroundColor = getRandomColor();
                    balloonContainer.appendChild(balloon);
                    animateBalloon(balloon);
                }, i * 50);
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
