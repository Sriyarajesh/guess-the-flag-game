
let allCountries = [];
let usedCountries = new Set();
let score = 0;
let lives = 3;
let timer = 10;
let countdown;
let correctAnswer = "";
let highScore = localStorage.getItem("highScore") || 0;
let streak = 0;

const flagImage = document.getElementById("flagImage");
const optionsContainer = document.getElementById("optionsContainer");
const scoreSpan = document.getElementById("score");
const livesSpan = document.getElementById("lives");
const timeSpan = document.getElementById("time");
const highScoreSpan = document.getElementById("highScore");
const streakBar = document.getElementById("streakBar");
const funFact = document.getElementById("funFact");
const gameOverScreen = document.getElementById("gameOverScreen");
const finalScoreSpan = document.getElementById("finalScore");
const difficultySelect = document.getElementById("difficultySelect");

highScoreSpan.textContent = highScore;

const facts = {
  Japan: "Japan’s flag is called the Nisshōki or ‘sun-mark flag’.",
  France: "France’s flag is known as the ‘Tricolore’.",
  Germany: "Germany’s colors symbolize unity and freedom.",
  India: "India’s flag is called the Tiranga, meaning ‘tricolour’.",
  Brazil: "Brazil’s flag has a starry sky and national motto.",
  "United States": "The U.S. flag has 13 stripes for the original colonies.",
  Canada: "Canada's flag is known as the Maple Leaf!",
  Australia: "Australia’s flag features the Union Jack and the Southern Cross.",
  Italy: "Italy’s flag represents hope, faith, and charity.",
  "United Kingdom": "UK’s flag is famously called the Union Jack."
};

function loadCountries() {
  fetch("https://restcountries.com/v3.1/all")
    .then(res => res.json())
    .then(data => {
      allCountries = data
        .filter(c => c.flags && c.name && c.name.common)
        .map(c => ({
          name: c.name.common,
          flag: c.flags.svg
        }));
      showNextFlag();
    });
}

function showNextFlag() {
  clearInterval(countdown);
  timer = 10;
  timeSpan.textContent = timer;

  if (usedCountries.size >= 40) {
    usedCountries.clear(); // Reset after 40 unique countries
  }

  let country;
  do {
    country = allCountries[Math.floor(Math.random() * allCountries.length)];
  } while (usedCountries.has(country.name));

  usedCountries.add(country.name);
  correctAnswer = country.name;
  flagImage.src = country.flag;

  const options = new Set([correctAnswer]);
  while (options.size < 4) {
    const random = allCountries[Math.floor(Math.random() * allCountries.length)];
    options.add(random.name);
  }

  const shuffled = Array.from(options).sort(() => 0.5 - Math.random());

  optionsContainer.innerHTML = "";
  shuffled.forEach(option => {
    const btn = document.createElement("button");
    btn.textContent = option;
    btn.onclick = () => checkAnswer(option);
    optionsContainer.appendChild(btn);
  });

  countdown = setInterval(() => {
    timer--;
    timeSpan.textContent = timer;
    if (timer === 0) {
      clearInterval(countdown);
      loseLife();
    }
  }, 1000);
}

function checkAnswer(selected) {
  clearInterval(countdown);
  if (selected === correctAnswer) {
    score++;
    streak++;
    scoreSpan.textContent = score;
    funFact.textContent = facts[correctAnswer] || "";
    updateStreak();
    if (score > highScore) {
      highScore = score;
      localStorage.setItem("highScore", highScore);
      highScoreSpan.textContent = highScore;
    }
    showNextFlag();
  } else {
    streak = 0;
    updateStreak();
    loseLife();
  }
}

function updateStreak() {
  streakBar.value = streak % 5;
}

function loseLife() {
  lives--;
  livesSpan.textContent = lives;
  funFact.textContent = `Oops! That was ${correctAnswer}.`;
  if (lives === 0) {
    gameOver();
  } else {
    streak = 0;
    updateStreak();
    setTimeout(showNextFlag, 2000);
  }
}

function gameOver() {
  gameOverScreen.style.display = "block";
  finalScoreSpan.textContent = score;
}

function restartGame() {
  score = 0;
  lives = 3;
  streak = 0;
  usedCountries.clear();
  scoreSpan.textContent = score;
  livesSpan.textContent = lives;
  funFact.textContent = "";
  gameOverScreen.style.display = "none";
  updateStreak();
  showNextFlag();
}

function shareScore() {
  const shareText = `I scored ${score} on Guess the Flag! 🌍`;
  if (navigator.share) {
    navigator.share({ text: shareText });
  } else {
    alert("Copy and share:\n" + shareText);
  }
}

function setTheme(theme) {
  const root = document.documentElement.style;
  if (theme === "pastel") {
    root.setProperty("--bg", "#fcefee");
    root.setProperty("--text", "#333");
    root.setProperty("--btn", "#9b59b6");
  } else if (theme === "dark") {
    root.setProperty("--bg", "#121212");
    root.setProperty("--text", "#f5f5f5");
    root.setProperty("--btn", "#333");
  } else if (theme === "aqua") {
    root.setProperty("--bg", "#e0ffff");
    root.setProperty("--text", "#034f84");
    root.setProperty("--btn", "#00bcd4");
  }
}

difficultySelect.addEventListener("change", loadCountries);
loadCountries();
