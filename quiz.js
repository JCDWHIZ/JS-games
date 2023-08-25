const _question = document.getElementById("question");
const _option = document.querySelector(".quiz-options");
const _correctScore = document.getElementById("correct-score");
const _totalQuestion = document.getElementById("total-question");
const _checkbtn = document.getElementById("check-answer");
const _playAgainBtn = document.getElementById("play-again");
const _result = document.getElementById("result");
const toggleButton = document.getElementById("toggle-mode");
const body = document.body;

// Event listener for the toggle button
toggleButton.addEventListener("click", () => {
  body.classList.toggle("dark-mode");
  body.classList.toggle("light-mode");
});

let correctAnswer = "",
  correctScore = (askedCount = 0),
  totalQuestion = 10;

function eventListeners() {
  _checkbtn.addEventListener("click", checkAnswer);
  _playAgainBtn.addEventListener("click", RestartQuiz);
}

document.addEventListener("DOMContentLoaded", () => {
  loadQuestion();
  eventListeners();
  _totalQuestion.textContent = totalQuestion;
  _correctScore.textContent = correctScore;
});

async function loadQuestion() {
  const APIURL = "https://opentdb.com/api.php?amount=10";
  const results = await fetch(`${APIURL}`);
  const data = await results.json();
  _result.innerHTML = "";
  showQuestion(data.results[0]);
  // console.log(data.results[0]);
}

function showQuestion(data) {
  _checkbtn.disabled = false;
  correctAnswer = data.correct_answer; // Corrected here
  let incorrectAnswer = data.incorrect_answers;
  let optionList = incorrectAnswer;
  optionList.splice(
    Math.floor(Math.random() * (incorrectAnswer.length + 1)),
    0,
    correctAnswer
  );

  _question.innerHTML = `${data.question} <br> <span class="category">${data.category}</span>`;
  _option.innerHTML = `${optionList
    .map((option, index) => `<li> ${index + 1}. <span> ${option} </span> </li>`)
    .join("")}`;
  selectedOption();
}

function selectedOption() {
  _option.querySelectorAll("li").forEach((option) => {
    option.addEventListener("click", () => {
      if (_option.querySelector(".selected")) {
        const activeOption = _option.querySelector(".selected");
        activeOption.classList.remove("selected"); // Corrected here
      }
      option.classList.add("selected");
    });
  });
  console.log(correctAnswer);
}

function checkAnswer() {
  _checkbtn.disabled = true;
  if (_option.querySelector(".selected")) {
    let selectedAnswer = _option.querySelector(".selected span").textContent;
    if (selectedAnswer.trim() == HTMLDecode(correctAnswer)) {
      correctScore++;
      _result.innerHTML = `<p> <i class = "fas fa-check"></i>Correct Answer! </p>`;
    } else {
      _result.innerHTML = `<p> <i class="fas fa-times"></i>Incorrect Answer! <p> </p>   <small><b>Correct Answer: </b> ${correctAnswer}</small></p>`;
    }
    checkCount();
  } else {
    _result.innerHTML = `<p><i class = "fas fa-question></i>Please select an option! </p>`;
    _checkbtn.disabled = false;
  }
}

function HTMLDecode(textString) {
  let doc = new DOMParser().parseFromString(textString, "text/html");
  return doc.documentElement.textContent;
}

function checkCount() {
  askedCount++;
  setCount();
  if (askedCount == totalQuestion) {
    _result.innerHTML += `<p>Your Score is ${correctScore}. </p>`;
    _playAgainBtn.style.display = "block";
    _checkbtn.style.display = "none";
  } else {
    setTimeout(() => {
      loadQuestion();
    }, 300);
  }
}

function setCount() {
  _totalQuestion.textContent = totalQuestion;
  _correctScore.textContent = correctScore;
}

function RestartQuiz() {
  correctScore = askedCount = 0;
  _playAgainBtn.style.display = "none";
  _checkbtn.style.display = "block";
  _checkbtn.disabled = "false";
  setCount();
  loadQuestion();
}
