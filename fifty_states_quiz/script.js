// note that fifty states js file must be read first to provide the array

const inputForm = document.getElementById("inputForm");
const lastAnswer = document.querySelector(".lastAnswer");
const answerBox = document.querySelector(".answerBox");
const submittedAnswer = document.querySelector(".submittedAnswer");
const correct = document.querySelector(".correct");
const pastAnswers = document.querySelector(".pastAnswers");

const pastCorrectGuesses = [];
let numberCorrect = 0;

answerBox.focus();

inputForm.addEventListener("submit", onSubmit);

function onSubmit() {
  // Preventing page refresh and then refresh text box
  event.preventDefault();
  const userGuess = answerBox.value.toLowerCase();

  if (pastCorrectGuesses.includes(userGuess)) {
    correct.textContent = "You've already got that one.";
  } else if (fiftyStates.includes(userGuess)) {
    numberCorrect++;
    pastCorrectGuesses.push(userGuess);
    correct.textContent = "Yep, that's one of them!";
    if (numberCorrect != 1) {
      pastAnswers.textContent += ` -- `;
    }
    pastAnswers.textContent += userGuess;
  } else {
    correct.textContent = "Oops, not quite...";
  }
  
  lastAnswer.textContent = `${numberCorrect} / 50. Last guess: ${userGuess}`;
  inputForm.reset();

}
