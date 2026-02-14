import wordsList from "./data/words.js";

const inputContainer = document.querySelector(".form-control");
const wrongInputs = document.querySelector(".wrong-input");
const triesCounterEl = document.getElementById("tries-counter");
const counterDots = document.querySelectorAll(".counter-dot");

const words = wordsList;
let currentWord = "";
let currentIndexWord = 0;
let triesCounter = 0;
let mistakes = [];
const GAME_ATTEMPTS = 6;

function getIndexOfElements(length) {
  return Math.floor(Math.random() * length);
}

function focusFirstInput() {
  const inputEl = document.querySelector('input[type="text"]');
  inputEl.readOnly = false;
  inputEl.parentElement.className = "blinking__text-cursor";
  inputEl.focus();
}

// Scramble and return the scrambled word
function scrambleWord(word) {
  let scrambleWord = "";
  const splitWord = word.split("");

  // Loop over each letter
  while (splitWord.length !== 0) {
    // Pick a random number between 0 and arrLength - 1
    const position = getIndexOfElements(splitWord.length);

    // Add up the matched letter
    scrambleWord += splitWord[position];

    // Swap the matched letter to the end of the array
    if (position < splitWord.length - 1) {
      [splitWord[position], splitWord[splitWord.length - 1]] = [
        splitWord[splitWord.length - 1],
        splitWord[position],
      ];
    }

    // Remove the last letter of the array
    splitWord.pop();
  }

  return scrambleWord;
}

// Generate and display scrambled word
function generateRandomWord() {
  // Select a word
  currentWord = words[getIndexOfElements(words.length)];
  // Get the scrambled word
  const getScrambleWord = scrambleWord(currentWord);
  // Display it on screen
  document.querySelector(".random-word").textContent = getScrambleWord;

  // Clean and create inputs
  inputContainer.innerHTML = "";
  createInputFields(currentWord.length);

  // Focus the first input
  focusFirstInput();
}

// Create number of input fields according to the number of letters
function createInputFields(length) {
  for (let i = 0; i < length; i++) {
    const div = document.createElement("div");
    const input = document.createElement("input");
    input.addEventListener("input", handleInput);
    input.type = "text";
    input.minLength = "1";
    input.maxLength = "1";
    input.name = "letter" + (i + 1);
    input.id = "letter" + (i + 1);
    input.readOnly = true;

    div.appendChild(input);
    inputContainer.appendChild(div);
  }
}

// Handle input change event
function handleInput(event) {
  const inputEl = event.target;
  const nextSiblingEl = inputEl.parentElement.nextElementSibling;

  // Validate if the given letter match the order of the string
  const letter = inputEl.value.trim().toLowerCase();

  if (currentWord.charAt(currentIndexWord) === letter) {
    currentIndexWord++;

    // Remove cursor text
    inputEl.parentElement.classList.remove("blinking__text-cursor");
    inputEl.readOnly = true;

    // Focus the next input
    if (nextSiblingEl) {
      nextSiblingEl.className = "blinking__text-cursor";
      nextSiblingEl.firstChild.focus();
      nextSiblingEl.firstChild.readOnly = false;
    }
  } else if (letter) {
    // Handle mistakes
    inputEl.value = "";

    triesCounter++;

    // Reset game
    if (triesCounter === GAME_ATTEMPTS) return resetGame();

    // Update text and colors to show attempts
    mistakes.push(letter);
    wrongInputs.textContent = mistakes.join(", ");
    counterDots[triesCounter - 1].classList.add("filled-dot");
    triesCounterEl.textContent = triesCounter;
  }

  if (currentIndexWord === currentWord.length) {
    // Display a success message
    const modalEl = document.querySelector(".modal");
    const defaultTop = modalEl.getBoundingClientRect().top;
    modalEl.style.top = 10 + "%";

    setTimeout(() => {
      modalEl.style.top = defaultTop + "px";

      // Re-start the game
      resetGame();
      generateRandomWord();
    }, 2000);
  }
}

// Handle game reset button
function resetGame() {
  // Reset app state
  currentIndexWord = 0;
  triesCounter = 0;
  mistakes = [];
  // Clean HTML
  const currentCursor = document.querySelector(".blinking__text-cursor");
  if (currentCursor) {
    currentCursor.classList.remove("blinking__text-cursor");
    currentCursor.firstChild.readOnly = true;
  }

  wrongInputs.textContent = "";
  triesCounterEl.textContent = 0;
  counterDots.forEach((el) => el.classList.remove("filled-dot"));
  // Reset form
  const form = document.querySelector(".form");
  form.reset();
  // Focus first input
  focusFirstInput();
}

// Event Listeners
document.getElementById("randomButton").addEventListener("click", (e) => {
  e.preventDefault();
  resetGame();
  generateRandomWord();
});
document.getElementById("clearBtn").addEventListener("click", resetGame);

// initial load
generateRandomWord();
