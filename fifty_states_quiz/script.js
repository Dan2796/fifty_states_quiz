// note that fifty states js file must be read first to provide the array
const inputForm = document.getElementById('inputForm');
const answerBox = document.querySelector('.answerBox');
const resetButton = document.getElementById('resetButton');
const timer = document.querySelector(".timer");
const text1 = document.querySelector(".text1");
const text2 = document.querySelector(".text2");
const text3 = document.querySelector(".text3");

// focus on answer box when refreshing
answerBox.focus();

// set variables to keep track of the state of the game
let gameState = 'readyToStart'; // other options are playing and gameOver
let pastCorrectGuesses = [];
let numberCorrectGuesses = 0;
let guessedGotham = false;
let targetTime;
let timerInterval;

// listen for submit button (return key since it's hidden) and give up button
inputForm.addEventListener('submit', onSubmit);
resetButton.addEventListener('click', onReset);

timer.textContent = 'Time left: 4m0s';

// set timer
function countdown() {
  let currentTime = new Date().getTime();
  let minsLeft = Math.floor((targetTime - currentTime) / 60000);
  let secsLeft = Math.floor(((targetTime - currentTime) % 60000) / 1000);
  timer.textContent = `Time left: ${minsLeft}m${secsLeft}s`;
  timer.style.color = 'var(--us_red)';
  if (minsLeft <= 0 && secsLeft <= 0) {
    onReset();
  }
}

function onSubmit() {
  // Preventing page refresh
  event.preventDefault();
  // store user guess as a constant - want to ignore case so just convert to lower
  const userGuess = answerBox.value.toLowerCase();
  // refresh input box once an answer has been submitted
  inputForm.reset();
  // start game if not already done
  if (gameState === 'readyToStart') {
    targetTime = new Date().getTime() + 4 * 60000;
    // set to 100 not 1000 because was getting weird lags at the start
    timerInterval = setInterval(countdown, 100);
    gameState = 'playing';
  }
  // if conditions based on whether it's (1) a repeated answer, (2) gotham, (3) correct or (4) wrong with an
  // escape clause in case it's right and also the 50th answer
  if (pastCorrectGuesses.includes(userGuess)) {
    text1.textContent = 'You\'ve already got that one.';
  } else if (userGuess === 'gotham') {
    pastCorrectGuesses.push(userGuess);
    text1.textContent = 'Gotham is actually a city not a state, but I\'ll give you a bonus point anyway...';
    guessedGotham = true;
    text3.textContent === '' ? text3.textContent += `, (gotham)` : text3.textContent += `(gotham)`;
    text3.textContent === '' ? text3.textContent += `(gotham)` : text3.textContent += `, (gotham)`;
  } else if (fiftyStates.includes(userGuess)) {
    pastCorrectGuesses.push(userGuess);
    text1.textContent = 'Yep, that\'s one of them!';
    text3.textContent === '' ? text3.textContent += `${userGuess}` : text3.textContent += `, ${userGuess}`;
    // note this comes after checking if number correct is zero
    numberCorrectGuesses++;
    // end game if they are all there
    if (numberCorrectGuesses === 50) {
      onReset();
      return;
    }
  } else {
    text1.textContent = 'Oops, not quite...';
  }
  // this comes last because we don't need to bother changing it if it's the last guess, in which case the function
  // will already have exited.
  text2.textContent = `${numberCorrectGuesses} / 50. Last guess: ${userGuess}`;
}

function onReset() {
  text2.textContent = '';
  timer.style.color = 'white';
  window.clearInterval(timerInterval);
  if (gameState === 'playing') {
    answerBox.style.display = 'none';
    // send reset button to the left and widen because the answer box is gone
    resetButton.textContent = 'Have another go';
    resetButton.style.margin = 0;
    resetButton.style.paddingLeft = '3em';
    resetButton.style.paddingRight = '3em';
    if (numberCorrectGuesses === 50 && guessedGotham) {
      text1.textContent = 'That\'s the lot, 50 out of 50 - nice one.';
    } else if (numberCorrectGuesses === 50 && !guessedGotham) {
      text1.textContent = 'Well done, 51 out of 50! You even got the bonus point you nerd.';
    } else {
      text1.textContent = `Oh bad luck, you only got ${numberCorrectGuesses} out of 50. You missed the ones in red below:`;
      text2.style.color = 'var(--us_red)';
      for (const state of fiftyStates) {
        if (!pastCorrectGuesses.includes(state)) {
          text2.textContent === '' ? text2.textContent = state : text2.textContent += `, ${state}`;
        }
      }
    }
    gameState = 'gameOver';
  } else if (gameState === 'gameOver') {
    answerBox.style.display = 'flex';
    numberCorrectGuesses = 0;
    pastCorrectGuesses = [];
    resetButton.textContent = 'Give up';
    timer.textContent = 'Time left: 4m00s';
    text1.textContent = '';
    text3.textContent = '';
    answerBox.focus();
    text2.style.color = 'white';
    text2.textContent = '';
    gameState = 'readyToStart';
  } else {
    text1.textContent = 'Can\'t restart yet - you haven\'t even started!'
  }
}
