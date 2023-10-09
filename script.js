// Vokabel-Pool
let vocabulary = [];
let vocabularyRepeat = [];
let currentIndex = 0;
let correctCount = 0;
let resultDiv = document.getElementById("result");
let questionDiv = document.getElementById("question");
let answerInput = document.getElementById("answer");
let counterDiv = document.getElementById("counter");
let btnCheck = document.getElementById("btn-check");
let btnNextVocabulary = document.getElementById("btn-next-vocabulary");

let customVocabularyList = document.getElementById("customVocabularyList");
let isCustomVocabularyVisible = false;
questionDiv.innerHTML = "";

// Funktion zum Überprüfen der Antwort und Farbwechsel
function checkAnswer() {
  let currentVocabulary = vocabularyRepeat[currentIndex];
  let userAnswer = answerInput.value.trim().toLowerCase();

  let questionWord = document.getElementById("question-card");
  if (userAnswer === currentVocabulary.answer.toLowerCase()) {
    questionWord.classList = "question-card question-color-green";
    vocabularyRepeat.splice(currentIndex, 1);
    correctCount++;
  } else {
    questionWord.classList = "question-card question-color-red";
    currentIndex++;
    questionDiv.innerHTML = "correct answer: " + currentVocabulary.answer;
  }

  // eingabefeld und check button nicht anzeigen

  answerInput.style.display = "none";
  btnCheck.style.display = "none";

  // next vocabulary button anzeigen

  btnNextVocabulary.style.display = "inline-block";

  updateCounter();
  saveProgress(); // Fortschritt speichern
}

// Nächste Vokabel anzeigen

function nextQuestion() {
  // hintergrund farbe neutralisieren
  let questionWord = document.getElementById("question-card");
  questionWord.classList = "question-card";

  // next vocabulary button entfernen
  btnNextVocabulary.style.display = "none";

  // eingabefeld und checkbutton anzeigen

  answerInput.style.display = "inline-block";
  btnCheck.style.display = "inline-block";
  answerInput.value = "";
  // überprüfen des index

  checkIndex();

  // nächste frage anzeigen

  if (currentIndex < vocabularyRepeat.length) {
    showQuestion();
  } else {
    questionDiv.innerHTML = "Training completed";
    answerInput.style.display = "none";
    // btnCheck.style.display = "none";
  }

  saveProgress(); // Fortschritt speichern
}

// Funktion zum Anzeigen der nächsten Frage
function showQuestion() {
  // let currentVocabulary = vocabularyRepeat[currentIndex];
  if (vocabulary.length !== 0 && currentIndex < vocabularyRepeat.length) {
    questionDiv.innerHTML = vocabularyRepeat[currentIndex].question;
  } else if (vocabulary.length === 0) {
    questionDiv.innerHTML = "Add vocabularies to start training";
    answerInput.style.display = "none";
  } else {
    questionDiv.innerHTML = "restart training";
    answerInput.style.display = "none";
  }
  // else {
  //   questionDiv.innerHTML = "Add vocabulary to start training";
  //   answerInput.style.display = "none";
  // }
}
// Funktion zum Aktualisieren des Zählers
function updateCounter() {
  counterDiv.innerHTML = correctCount + " / " + vocabulary.length;
}

// Funktion zum Speichern des Fortschritts im Local Storage
function saveProgress() {
  localStorage.setItem("currentIndex", currentIndex.toString());
  localStorage.setItem("correctCount", correctCount.toString());
  localStorage.setItem("vocabulary", JSON.stringify(vocabulary));
  localStorage.setItem("vocabularyRepeat", JSON.stringify(vocabularyRepeat));
}

// Funktion zum Laden des Fortschritts aus dem Local Storage
function loadProgress() {
  let savedIndex = localStorage.getItem("currentIndex");
  let savedCorrectCount = localStorage.getItem("correctCount");
  let savedVocabulary = localStorage.getItem("vocabulary");
  let savedVocabularyRepeat = localStorage.getItem("vocabularyRepeat");

  if (
    savedIndex !== null &&
    savedCorrectCount !== null &&
    savedVocabulary !== null &&
    savedVocabularyRepeat !== null
  ) {
    currentIndex = parseInt(savedIndex);
    correctCount = parseInt(savedCorrectCount);
    vocabulary = JSON.parse(savedVocabulary);
    vocabularyRepeat = JSON.parse(savedVocabularyRepeat);

    // if (currentIndex < vocabularyRepeat.length) {
    //   showQuestion();
    // } else {
    //   questionDiv.innerHTML = "";
    //   answerInput.style.display = "none";
    // }

    updateCounter();
  }
}
// Funktion zum Neustarten des Vokabeltrainers
function restartVocabularyTrainer() {
  currentIndex = 0;
  correctCount = 0;
  vocabularyRepeat = [...vocabulary];
  answerInput.style.display = "inline-block";
  resultDiv.innerHTML = "";
  answerInput.value = "";
  let questionWord = document.getElementById("question-card");
  questionWord.classList = "question-card";

  updateCounter();
  saveProgress();
  showQuestion();
}

// Funktion zum Hinzufügen eigener Vokabeln
function addCustomVocabulary() {
  let newQuestion = document.getElementById("newQuestion").value.trim();
  let newAnswer = document.getElementById("newAnswer").value.trim();

  if (newQuestion !== "" && newAnswer !== "") {
    let isDuplicate = vocabulary.some(function (vocab) {
      return (
        vocab.question.toLowerCase() === newQuestion.toLowerCase() ||
        vocab.answer.toLowerCase() === newAnswer.toLowerCase()
      );
    });

    if (isDuplicate) {
      alert("Vokabel existiert bereits");
    } else {
      vocabulary.push({ question: newQuestion, answer: newAnswer });
      vocabularyRepeat.push({ question: newQuestion, answer: newAnswer });
      document.getElementById("newQuestion").value = "";
      document.getElementById("newAnswer").value = "";
      saveProgress();
      updateCounter(); // Zähler aktualisieren
      showCustomVocabulary();
    }
  }
}

// Funktion zum Anzeigen oder Ausblenden der eigenen Vokabelliste
function toggleCustomVocabulary() {
  let buttonList = document.getElementById("btn-list");
  isCustomVocabularyVisible = !isCustomVocabularyVisible;

  if (isCustomVocabularyVisible) {
    customVocabularyList.style.display = "flex";
    showCustomVocabulary();
    buttonList.innerHTML = "HIDE LIST";
  } else {
    customVocabularyList.style.display = "none";
    buttonList.innerHTML = "SHOW LIST";
  }
}

// Funktion zum Anzeigen der eigenen Vokabeln

function showCustomVocabulary() {
  customVocabularyList.innerHTML = "";

  for (let i = 0; i < vocabulary.length; i++) {
    let listItem = document.createElement("li");
    listItem.textContent =
      vocabulary[i].question + " - " + vocabulary[i].answer;
    customVocabularyList.appendChild(listItem);
    listItem.id = "vocabulary-" + i;
    customVocabularyList.appendChild(listItem);

    let deleteItem = document.createElement("button");
    deleteItem.textContent = "-";
    deleteItem.classList = "deleteButton";
    deleteItem.setAttribute(
      "onclick",
      "deleteVocabulary(" + i + "), listIsEmpty()"
    );
    listItem.appendChild(deleteItem);
  }
}

// funktion zum checken ob vocabulary liste is empty -> dann schliessen

function listIsEmpty() {
  if (customVocabularyList.innerHTML === "") {
    customVocabularyList.style.display = "none";
  }
}

// funktion zum überprüfen des index

function checkIndex() {
  if (currentIndex >= vocabularyRepeat.length) {
    currentIndex = 0;
  }
}

function deleteVocabulary(index) {
  vocabulary.splice(index, 1);
  showCustomVocabulary();
  updateCounter(); // Zähler aktualisieren
  saveProgress();
}
document
  .getElementById("restartButton")
  .addEventListener("click", restartVocabularyTrainer);

// Ersten Fortschritt laden oder erste Frage anzeigen
loadProgress();
showQuestion();
