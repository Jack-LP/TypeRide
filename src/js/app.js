const word = document.getElementById('word');
const text = document.getElementById('text');
const scoreEl = document.getElementById('score');
const timeEl = document.getElementById('time');
const endgameEl = document.getElementById('end-game-container');
const settingsBtn = document.getElementById('settings-btn');
const settings = document.getElementById('settings');
const settingsForm = document.getElementById('settings-form');
const difficultySelect = document.getElementById('difficulty');

let randomWord;
let score = 0;
let time = 10;

// Set difficulty to value in local storage (medium default)
let difficulty =
  localStorage.getItem('difficulty') !== null
    ? localStorage.getItem('difficulty')
    : 'medium';
difficultySelect.value =
  localStorage.getItem('difficulty') !== null
    ? localStorage.getItem('difficulty')
    : 'medium';

text.focus();

// Start countdown timer
const timeInterval = setInterval(updateTime, 1000);

// Get words array from API call
async function getRandomWords() {
  const response = await fetch(
    `https://random-word-api.herokuapp.com/word?number=1&lang=en&length=5`
  );
  if (response.status != 200) {
    console.error('error 200');
  } else {
    const randomWords = await response.json();
    addWordToDom(randomWords);
  }
}

// Generate random word from array
function getRandomWord(wordsList) {
  return wordsList[Math.floor(Math.random() * wordsList.length)];
}

function updateTime() {
  time--;
  timeEl.innerText = `${time}s`;

  if (time === 0) {
    clearInterval(timeInterval);

    // End game
    gameOver();
  }
}

function gameOver() {
  endgameEl.innerHTML = `
    <h1>Times Up!</h1>
    <p>You scored ${score} points on ${difficulty} difficulty</p>
    <button onclick="location.reload()" class="reload-btn">Play Again</button>
  `;
  endgameEl.style.display = 'flex';
}

function addWordToDom(wordsList) {
  randomWord = getRandomWord(wordsList);
  word.innerText = randomWord;
}

function updateScore() {
  score++;
  scoreEl.innerText = score;
}

// Event listeners

// Typing
text.addEventListener('input', (e) => {
  const insertedText = e.target.value.toLowerCase();
  if (insertedText === randomWord) {
    getRandomWords();
    updateScore();

    // Clear input
    e.target.value = '';

    switch (difficulty) {
      case 'hard':
        time += 2;
        break;
      case 'medium':
        time += 3;
        break;
      case 'easy':
        time += 4;
        break;
    }

    updateTime();
  }
});

settingsBtn.addEventListener('click', () => {
  settings.classList.toggle('hide');
});

settingsForm.addEventListener('change', (e) => {
  difficulty = e.target.value;
  localStorage.setItem('difficulty', difficulty);
});

getRandomWords();
