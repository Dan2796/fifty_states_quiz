// note that fifty states js file must be read first to provide the array
const timer = document.getElementById('timer');
const inputForm = document.getElementById('inputForm');
const answerBox = document.getElementById('answerBox');
const resetButton = document.getElementById('resetButton');
const text1 = document.getElementById('text1');
const text2 = document.getElementById('text2');
const text3 = document.getElementById('text3');

// set time limit on game in milliseconds:
const timeLimit = 4 * 60000;

// set variables to keep track of the state of the game
let playing = false;
let pastCorrectGuesses = [];
let numberCorrectGuesses = 0;
let targetTime;
let timerInterval;

// start in the correct state - saves having to code the starting state into the html
displayStartState();

// listen for submit button (return key since it's hidden) and give up button
inputForm.addEventListener('submit', onSubmit);
resetButton.addEventListener('click', () => {
  if (playing) {
    gameOver();
    displayFailedState(fiftyStates, numberCorrectGuesses, pastCorrectGuesses);
  } else {
    displayStartState(fiftyStates, numberCorrectGuesses, pastCorrectGuesses);
  }
});

function onSubmit(e) {
  // Preventing page refresh
  e.preventDefault();
  // store user guess as a constant - want to ignore case so just convert to lower
  const userGuess = answerBox.value.toLowerCase().trim();
  // refresh input box once an answer has been submitted
  inputForm.reset();
  // start game if not already done
  if (!playing) {
    displayPlayState();
    playing = true;
    numberCorrectGuesses = 0;
    pastCorrectGuesses = [];
    targetTime = new Date().getTime() + timeLimit;
    // set to 100 not 1000 because I was getting weird lags at the start
    timerInterval = setInterval( function() {
      // need to pass countdown the parameters required for displaying the failed state for if timer runs out
      countdown(targetTime, fiftyStates, numberCorrectGuesses, pastCorrectGuesses);
      }, 100 );
  }
  if (pastCorrectGuesses.includes(userGuess)) {
    updateTextOnGuess(true, true, numberCorrectGuesses, userGuess)
  } else if (fiftyStates.includes(userGuess)) {
    pastCorrectGuesses.push(userGuess);
    numberCorrectGuesses++;
    // end game if they are all there
    if (numberCorrectGuesses === 50) {
      gameOver();
      displayWonState();
      return;
    }
    updateTextOnGuess(true, false, numberCorrectGuesses, userGuess)
  } else {
    updateTextOnGuess(false, false, numberCorrectGuesses, userGuess)
  }
}

function formatTimer(milliseconds) {
  // catch negative numbers in case timer runs out and interval checks once it's negative
  let minutesLeft = milliseconds > 0 ? Math.floor((milliseconds) / 60000) : 0;
  let secondsLeft = milliseconds > 0 ? Math.floor((milliseconds % 60000) / 1000): 0;
  return `Time left: ${minutesLeft}m${secondsLeft}s`
}

function countdown(targetTime, fiftyStates, numberCorrectGuesses, pastCorrectGuesses) {
  let currentTime = new Date().getTime();
  let timeLeft = targetTime - currentTime;
  timer.textContent = formatTimer(timeLeft);
  timer.className = 'timerActive';
  if (timeLeft <= 0) {
    gameOver();
    displayFailedState(fiftyStates, numberCorrectGuesses, pastCorrectGuesses);
  }
}

function updateTextOnGuess(guessCorrect, alreadyGuessed, numberCorrectGuesses, userGuess) {
  if (guessCorrect && alreadyGuessed) {
    text1.textContent = 'You\'ve already got that one.'
  } else if (guessCorrect && !alreadyGuessed) {
    text1.textContent = 'Yep, that\'s one of them!';
    text3.textContent === '' ? text3.textContent += `${userGuess}` : text3.textContent += `, ${userGuess}`;
  } else {
    text1.textContent = 'Oops, not quite...';
  }
  text2.textContent = `${numberCorrectGuesses} / 50. Last guess: ${userGuess}`;
}

function gameOver(){
  window.clearInterval(timerInterval);
  playing = false;
}

function displayStartState() {
  timer.textContent = formatTimer(timeLimit);
  answerBox.className = 'answerBox';
  answerBox.focus();
  resetButton.textContent = 'Give up';
  resetButton.className = 'resetButtonHidden';
  text1.textContent = 'Have a shot!';
  text2.textContent = '';
  text2.className = 'text2';
  text3.textContent = '';
}

function displayPlayState() {
  resetButton.className= 'resetButton';
  text1.textContent = '';
  text2.textContent = '';
  text3.textContent = '';
}

function displayFailedState(fiftyStates, numberCorrectGuesses, pastCorrectGuesses) {
  timer.className = 'timerInactive';
  answerBox.className = 'answerBoxHidden';
  resetButton.textContent = 'Have another go';
  resetButton.className = 'resetButtonWide';
  text1.textContent = `Oh bad luck, you only got ${numberCorrectGuesses} out of 50. You missed the ones in red below:`;
  text2.textContent = '';
  for (const state of fiftyStates) {
        if (!pastCorrectGuesses.includes(state)) {
          text2.textContent === '' ? text2.textContent = state : text2.textContent += `, ${state}`;
        }
  }
  text2.className = 'text2Failed';
}

function displayWonState() {
  timer.className = 'timerInactive';
  answerBox.className = 'answerBoxHidden';
  resetButton.textContent = 'Have another go';
  resetButton.className = 'resetButtonWide';
  text1.textContent = 'That\'s the lot, 50 out of 50 - nice one.';
  text2.textContent = '';
}
