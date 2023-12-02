const typingText = document.querySelector(".typing-text p")
inpField = document.querySelector(".wrapper .input-field")
mistakeTag = document.querySelector(".mistakes span ")
timeTag = document.querySelector(".time span b")
wpmTag = document.querySelector(".wpm span");
prevScoreTag = document.querySelector(".prev-score span");
tryAgainBtn = document.querySelector(".content button ")

charIndex = 0
mistakes = 0
wpm = 0
isTyping = false
let timer, maxTime = 15, timeLeft = maxTime

function generateRandomSentencesHelper(numberOfSentences) {
    let url = 'https://metaphorpsum.com/sentences/' + numberOfSentences

    // Making our request
    return fetch(url, {
       method: `GET`,
       headers: {
         Accept: "application/text",
       },
     }).then(response =>response.text())
}

async function generateRandomSentences() {
  let paragraph = await generateRandomSentencesHelper(10)
   typingText.innerHTML = "";
  paragraph.split("").forEach(character => {
    const characterSpan = document.createElement('span');
    characterSpan.innerText = character;
    typingText.appendChild(characterSpan);
  })
  typingText.querySelectorAll("span")[0].classList.add("active");
  document.addEventListener('keydown', inpField.focus())
  typingText.addEventListener('click', inpField.focus())
}

function initTyping() {
  const characters = typingText.querySelectorAll('span')
  let typedChar = inpField.value.split("")[charIndex]
  targetChar = characters[charIndex]

  if (charIndex >= characters.length - 1 || timeLeft <= 0) {
    clearInterval(timer)
    inpField.value = ""

  } else {

  if (!isTyping) {
    timer = setInterval(initTimer, 1000);
    isTyping = true
  }
  
  if (typedChar == null) {
    targetChar.classList.remove("active")
    charIndex = Math.max(0, charIndex - 1)
    if (characters[charIndex].classList.contains("incorrect")) {
      mistakes--;
    }
    characters[charIndex].classList.remove("correct", "incorrect");
    characters[charIndex].classList.add("active");
  } else {
    targetChar.classList.remove("active")
    if (typedChar == targetChar.innerText) {
      targetChar.classList.add("correct")
    } else {
      targetChar.classList.add("incorrect")
      mistakes++;
    }
    charIndex++;
  }
  mistakeTag.innerText = mistakes
  characters[charIndex].classList.add("active");
  correctCharactersTyped = charIndex - mistakes
  timeElapsed = maxTime - timeLeft
  wpm =
    Math.round(((correctCharactersTyped / timeElapsed) * 60 * 100) / 5) / 100;

  wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm
  wpmTag.innerText = wpm
}
}

function initTimer() {
  if (timeLeft > 0) {
    timeLeft--;
    timeTag.innerText = timeLeft
  } else {
   clearInterval(timer)
  }
}

function resetGame() {
  inpField.value = "";
  clearInterval(timer);
 
  generateRandomSentences();
  timeLeft = maxTime
  charIndex = mistakes = isTyping = 0
  timeTag.innerText = timeLeft
  mistakeTag.innerText = 0
  wpmTag.innerText = 0
  prevScoreTag.innerText = wpm;

}
resetGame()
inpField.addEventListener("input", initTyping)
tryAgainBtn.addEventListener("click", resetGame)

