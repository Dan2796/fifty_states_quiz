// note that fifty states js file must be read first to provide the array

const inputForm = document.getElementById("inputForm");
const lastAnswer = document.querySelector(".lastAnswer");
const answerBox = document.querySelector(".answerBox");
const correct = document.querySelector(".correct");
const pastAnswers = document.querySelector(".pastAnswers");
const giveUpButton = document.getElementById("giveUpButton");

let alreadyGivenUp = false;

let pastCorrectGuesses = [];
let numberCorrect = 0;

answerBox.focus();

inputForm.addEventListener("submit", onSubmit);
giveUpButton.addEventListener("click", onGameOver);

function onSubmit() {
  // Preventing page refresh and then refresh text box
  event.preventDefault();
  const userGuess = answerBox.value.toLowerCase();
  inputForm.reset();

  if (pastCorrectGuesses.includes(userGuess)) {
    correct.textContent = "You've already got that one.";
  } else if (fiftyStates.includes(userGuess)) {
    numberCorrect++;
    pastCorrectGuesses.push(userGuess);
    if (numberCorrect === 51 || (numberCorrect === 50 && !pastCorrectGuesses.includes("gotham")) ) {
      pastAnswers.textContent += `, ${userGuess}`;
      onGameOver();
      return;
    } else {
      correct.textContent = "Yep, that's one of them!";
      if (numberCorrect != 1) {
        pastAnswers.textContent += `, `;
      }
      pastAnswers.textContent += userGuess;
    }
  } else {
    correct.textContent = "Oops, not quite...";
  }
  lastAnswer.textContent = `${numberCorrect} / 50. Last guess: ${userGuess}`;
}

function onGameOver() {
  answerBox.style.display = "none";
  if (alreadyGivenUp === true) {
    alreadyGivenUp = false;
    answerBox.style.display = "flex";
    numberCorrect = 0;
    pastCorrectGuesses = [];
    giveUpButton.textContent = "Give up";
    correct.textContent = "";
    pastAnswers.textContent = "";
    answerBox.focus();
    lastAnswer.style.color = "white";
    lastAnswer.textContent = "";
  } else {
    alreadyGivenUp = true;
    answerBox.style.display = "none";
    giveUpButton.textContent = "Have another go";
    giveUpButton.style.margin = 0;
    giveUpButton.style.paddingLeft = "3em";
    giveUpButton.style.paddingRight = "3em";
    lastAnswer.textContent = "";
    if (numberCorrect === 51) {
      correct.textContent = "Well done, 51 out of 50! You even got the bonus one you nerd.";
      lastAnswer.textContent = "";
    }
    if (numberCorrect === 50) {
      correct.textContent = "That's the lot, 50 out of 50 - nice one.";
      lastAnswer.textContent = "";
    } else {
      correct.textContent = `Oh bad luck, you only got ${numberCorrect} out of 50. You missed the ones in red below:`;
      let firstAnswer = true;
      for(const state of fiftyStates) {
        lastAnswer.style.color = "var(--us_red)";
        if (state !== "gotham" && !pastCorrectGuesses.includes(state)) {
          if (firstAnswer === true) {
            firstAnswer = false;
          } else {
            lastAnswer.textContent += ", "
          }
          lastAnswer.textContent += state;
        }
      }
    }
  }
}
