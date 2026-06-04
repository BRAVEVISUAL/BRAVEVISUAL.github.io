document.addEventListener("DOMContentLoaded", function () {
  const year = document.getElementById("year");
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  const targetDate = document.getElementById("targetDate");
  if (targetDate) {
    targetDate.value = "2026-06-20";
  }

  const randomPickBtn = document.getElementById("randomPickBtn");
  if (randomPickBtn) {
    randomPickBtn.addEventListener("click", pickRandomItem);
  }

  const ddayCalculateBtn = document.getElementById("ddayCalculateBtn");
  if (ddayCalculateBtn) {
    ddayCalculateBtn.addEventListener("click", calculateDday);
  }

  const changeColorBtn = document.getElementById("changeColorBtn");
  if (changeColorBtn) {
    changeColorBtn.addEventListener("click", function () {
      playStyleRound("color");
    });
  }

  const changeSizeBtn = document.getElementById("changeSizeBtn");
  if (changeSizeBtn) {
    changeSizeBtn.addEventListener("click", function () {
      playStyleRound("size");
    });
  }

  const changeBackgroundBtn = document.getElementById("changeBackgroundBtn");
  if (changeBackgroundBtn) {
    changeBackgroundBtn.addEventListener("click", function () {
      playStyleRound("background");
    });
  }

  const toggleVisibilityBtn = document.getElementById("toggleVisibilityBtn");
  if (toggleVisibilityBtn) {
    toggleVisibilityBtn.addEventListener("click", function () {
      playStyleRound("hidden");
    });
  }

  const startStyleGameBtn = document.getElementById("startStyleGameBtn");
  if (startStyleGameBtn) {
    startStyleGameBtn.addEventListener("click", startStyleGame);
  }

  const resetPlayerBtn = document.getElementById("resetPlayerBtn");
  if (resetPlayerBtn) {
    resetPlayerBtn.addEventListener("click", resetPlayerStyle);
  }

  const pizzaOrderForm = document.getElementById("pizzaOrderForm");
  if (pizzaOrderForm) {
    pizzaOrderForm.addEventListener("submit", validatePizzaOrder);
    pizzaOrderForm.addEventListener("reset", function () {
      setTimeout(resetPizzaOrder, 0);
    });
  }

  document.querySelectorAll(".menu-check, .menu-qty").forEach((input) => {
    input.addEventListener("change", recalculatePizzaTotal);
    input.addEventListener("input", recalculatePizzaTotal);
  });

  const pizzaAddress = document.getElementById("pizzaAddress");
  if (pizzaAddress) {
    pizzaAddress.addEventListener("blur", checkPizzaAddress);
  }

  const carTrack = document.getElementById("carTrack");
  if (carTrack) {
    carTrack.addEventListener("keydown", moveArcadeCar);
  }

  const carResetBtn = document.getElementById("carResetBtn");
  if (carResetBtn) {
    carResetBtn.addEventListener("click", resetArcadeCar);
  }

  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", showMessage);
  }

  const messageList = document.getElementById("messageList");
  if (messageList) {
    messageList.addEventListener("click", deleteMessage);
  }

  initializeJourneyScroll();
  initializeStyleGame();
});

const styleGameEffects = ["color", "size", "background", "hidden"];
let styleGameOrder = [];
let styleGameIndex = 0;
let styleGameStartedAt = 0;
let styleGameTimer = null;
let styleGameActive = false;
let styleGameLocked = false;

const quizQuestions = [
  {
    topic: "HTML",
    question: "웹페이지에서 가장 큰 제목을 나타낼 때 주로 사용하는 태그는?",
    options: ["<p>", "<h1>", "<img>", "<br>"],
    answer: "<h1>",
    hint: "제목 heading의 첫 단계입니다.",
  },
  {
    topic: "HTML",
    question: "다른 페이지로 이동하는 링크를 만들 때 사용하는 태그는?",
    options: ["<a>", "<ul>", "<table>", "<input>"],
    answer: "<a>",
    hint: "anchor의 약자입니다.",
  },
  {
    topic: "CSS",
    question: "글자 색을 바꾸는 CSS 속성은?",
    options: ["font-size", "color", "margin", "display"],
    answer: "color",
    hint: "텍스트의 색상 자체를 지정합니다.",
  },
  {
    topic: "CSS",
    question: "요소의 배경색을 바꾸는 CSS 속성은?",
    options: ["background-color", "text-align", "border-radius", "padding"],
    answer: "background-color",
    hint: "배경을 뜻하는 단어가 들어갑니다.",
  },
  {
    topic: "JavaScript",
    question: "HTML 요소를 id로 가져올 때 사용하는 메서드는?",
    options: [
      "document.getElementById()",
      "document.write()",
      "alert()",
      "console.log()",
    ],
    answer: "document.getElementById()",
    hint: "DOM에서 특정 id를 찾습니다.",
  },
  {
    topic: "JavaScript",
    question: "버튼 클릭 같은 사용자 동작을 처리할 때 연결하는 것은?",
    options: ["event", "array", "string", "number"],
    answer: "event",
    hint: "click, submit 같은 동작을 다룹니다.",
  },
];
let currentQuiz = null;
let quizCorrectCount = 0;
let quizTryCount = 0;
let arcadeCarX = 20;
let arcadeCarY = 20;
const arcadeCarStep = 10;

function initializeJourneyScroll() {
  const journey = document.querySelector(".journey, .story-page");
  const steps = document.querySelectorAll(".journey-step, .story-step");
  const progress = document.querySelector(".journey-progress, .story-progress");
  if (!journey || steps.length === 0) return;

  const updateProgress = () => {
    if (!progress) return;

    const rect = journey.getBoundingClientRect();
    const viewportPoint = window.innerHeight * 0.58;
    const total = rect.height - window.innerHeight * 0.2;
    const drawn = Math.min(Math.max(viewportPoint - rect.top, 0), total);
    progress.style.height = `${(drawn / total) * 100}%`;
  };

  const activateSteps = () => {
    const activeLine = window.innerHeight * 0.58;

    steps.forEach((step) => {
      const rect = step.getBoundingClientRect();
      const reached = rect.top < activeLine;
      const current = rect.top < activeLine && rect.bottom > activeLine * 0.55;

      step.classList.toggle("is-past", reached);
      step.classList.toggle("is-visible", current);
    });

    updateProgress();
  };

  activateSteps();
  window.addEventListener("scroll", activateSteps, { passive: true });
  window.addEventListener("resize", activateSteps);
}

function changeIntro() {
  const text = document.getElementById("intro");
  if (!text) return;

  const firstMessage =
    "훌륭한 개발자가 되고 싶은 마음으로 HTML, CSS, JavaScript를 배우며 만든 실습과 기록을 한곳에 모은 개인 홈페이지입니다.";
  const secondMessage =
    "웹페이지 제작을 공부하고, 앞으로는 백엔드 서버 구동까지 스스로 학습하고 싶습니다.";

  text.textContent = text.textContent.trim() === firstMessage ? secondMessage : firstMessage;
}

function pickRandomItem() {
  const topic = document.getElementById("quizTopic");
  const question = document.getElementById("quizQuestion");
  const options = document.getElementById("quizOptions");
  const result = document.getElementById("randomResult");
  if (!topic || !question || !options || !result) return;

  const index = Math.floor(Math.random() * quizQuestions.length);
  currentQuiz = quizQuestions[index];
  topic.textContent = `TOPIC ${currentQuiz.topic}`;
  question.textContent = currentQuiz.question;
  result.textContent = `${currentQuiz.topic} 퀴즈가 등장했습니다. 정답을 선택하세요.`;
  result.classList.remove("is-perfect", "is-miss");
  options.innerHTML = "";

  currentQuiz.options.forEach((option) => {
    const button = document.createElement("button");
    button.className = "quiz-option";
    button.type = "button";
    button.textContent = option;
    button.addEventListener("click", function () {
      checkQuizAnswer(button, option);
    });
    options.appendChild(button);
  });
}

function checkQuizAnswer(selectedButton, selectedAnswer) {
  const options = document.getElementById("quizOptions");
  const result = document.getElementById("randomResult");
  if (!currentQuiz || !options || !result) return;

  quizTryCount += 1;
  const isCorrect = selectedAnswer === currentQuiz.answer;
  if (isCorrect) {
    quizCorrectCount += 1;
  }

  options.querySelectorAll(".quiz-option").forEach((button) => {
    button.disabled = true;
    if (button.textContent === currentQuiz.answer) {
      button.classList.add("is-correct");
    }
  });

  if (!isCorrect) {
    selectedButton.classList.add("is-wrong");
  }

  result.textContent = isCorrect
    ? `PERFECT! ${currentQuiz.topic} 감각이 좋습니다.`
    : `MISS! 정답은 ${currentQuiz.answer}입니다. ${currentQuiz.hint}`;
  result.classList.toggle("is-perfect", isCorrect);
  result.classList.toggle("is-miss", !isCorrect);
  updateQuizScore();
}

function updateQuizScore() {
  const score = document.getElementById("quizScore");
  if (!score) return;

  score.textContent = `SCORE ${quizCorrectCount} / ${quizTryCount}`;
}

function recalculatePizzaTotal() {
  const checks = document.querySelectorAll(".menu-check");
  const quantities = document.querySelectorAll(".menu-qty");
  const total = document.getElementById("pizzaTotal");
  if (!total) return;

  let amount = 0;

  checks.forEach((check, index) => {
    if (!check.checked) return;

    const quantity = Math.max(parseInt(quantities[index].value, 10) || 1, 1);
    amount += parseInt(check.value, 10) * quantity;
  });

  total.textContent = `${amount.toLocaleString()}원`;
  total.dataset.amount = amount;
}

function resetPizzaOrder() {
  const result = document.getElementById("pizzaResult");
  recalculatePizzaTotal();
  if (!result) return;

  result.textContent = "메뉴를 골라 주문 미션을 시작하세요.";
  result.classList.remove("is-perfect", "is-miss");
}

function checkPizzaAddress() {
  const address = document.getElementById("pizzaAddress");
  const result = document.getElementById("pizzaResult");
  if (!address || !result || address.value.trim()) return;

  result.textContent = "MISS! 배달 주소를 입력해 주세요.";
  result.classList.remove("is-perfect");
  result.classList.add("is-miss");
}

function validatePizzaOrder(event) {
  event.preventDefault();

  const address = document.getElementById("pizzaAddress");
  const total = document.getElementById("pizzaTotal");
  const result = document.getElementById("pizzaResult");
  if (!address || !total || !result) return;

  const amount = parseInt(total.dataset.amount || "0", 10);
  if (amount === 0) {
    result.textContent = "MISS! 메뉴를 하나 이상 선택해 주세요.";
    result.classList.remove("is-perfect");
    result.classList.add("is-miss");
    return;
  }

  if (!address.value.trim()) {
    result.textContent = "MISS! 배달 주소를 입력해 주세요.";
    result.classList.remove("is-perfect");
    result.classList.add("is-miss");
    address.focus();
    return;
  }

  result.textContent = `PERFECT! 주문 완료, 총 결제 금액은 ${amount.toLocaleString()}원입니다.`;
  result.classList.remove("is-miss");
  result.classList.add("is-perfect");
}

function moveArcadeCar(event) {
  const track = document.getElementById("carTrack");
  const car = document.getElementById("arcadeCar");
  if (!track || !car) return;

  const keys = ["ArrowLeft", "ArrowUp", "ArrowRight", "ArrowDown"];
  if (!keys.includes(event.key)) return;

  event.preventDefault();
  const maxX = track.clientWidth - car.offsetWidth;
  const maxY = track.clientHeight - car.offsetHeight;

  if (event.key === "ArrowLeft") arcadeCarX -= arcadeCarStep;
  if (event.key === "ArrowUp") arcadeCarY -= arcadeCarStep;
  if (event.key === "ArrowRight") arcadeCarX += arcadeCarStep;
  if (event.key === "ArrowDown") arcadeCarY += arcadeCarStep;

  arcadeCarX = Math.min(Math.max(arcadeCarX, 0), maxX);
  arcadeCarY = Math.min(Math.max(arcadeCarY, 0), maxY);
  updateArcadeCarPosition();
}

function resetArcadeCar() {
  arcadeCarX = 20;
  arcadeCarY = 20;
  updateArcadeCarPosition();

  const track = document.getElementById("carTrack");
  if (track) {
    track.focus();
  }
}

function updateArcadeCarPosition() {
  const car = document.getElementById("arcadeCar");
  const info = document.getElementById("carInfo");
  if (!car || !info) return;

  car.style.left = `${arcadeCarX}px`;
  car.style.top = `${arcadeCarY}px`;
  info.textContent = `현재 좌표 (x, y) = (${arcadeCarX}, ${arcadeCarY})`;
}

function calculateDday() {
  const input = document.getElementById("targetDate");
  const result = document.getElementById("ddayResult");
  if (!input || !result) return;

  if (!input.value) {
    result.textContent = "목표 날짜를 먼저 선택해 주세요.";
    return;
  }

  const today = new Date();
  const target = new Date(`${input.value}T00:00:00`);
  today.setHours(0, 0, 0, 0);

  const diffMs = target.getTime() - today.getTime();
  const diffDay = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDay === 0) {
    result.textContent = "오늘이 바로 D-Day입니다.";
  } else if (diffDay > 0) {
    result.textContent = `목표일까지 D-${diffDay}일 남았습니다.`;
  } else {
    result.textContent = `목표일로부터 D+${Math.abs(diffDay)}일 지났습니다.`;
  }
}

function initializeStyleGame() {
  const player = document.getElementById("playerTarget");
  const example = document.getElementById("exampleTarget");
  if (!player || !example) return;

  resetStyleTarget(player);
  resetStyleTarget(example);
  updateStyleGameProgress();
}

function startStyleGame() {
  styleGameOrder = shuffleEffects(styleGameEffects);
  styleGameIndex = 0;
  styleGameStartedAt = Date.now();
  styleGameActive = true;
  styleGameLocked = false;
  clearInterval(styleGameTimer);
  styleGameTimer = setInterval(updateStyleGameTimer, 100);

  updateStyleGameTimer();
  updateStyleGameStatus("정답 화면을 보고 같은 스타일을 만드세요.", "");
  loadStyleGameRound();
}

function playStyleRound(effect) {
  if (styleGameLocked) {
    return;
  }

  if (!styleGameActive) {
    updateStyleGameStatus("게임 시작을 먼저 눌러주세요.", "is-miss");
    return;
  }

  const player = document.getElementById("playerTarget");
  if (!player) return;

  applyStyleEffect(player, effect);

  if (effect === styleGameOrder[styleGameIndex]) {
    styleGameLocked = true;
    styleGameIndex += 1;
    updateStyleGameProgress();

    if (styleGameIndex === styleGameOrder.length) {
      finishStyleGame();
      return;
    }

    updateStyleGameStatus("PERFECT! 다음 정답 화면으로 넘어갑니다.", "is-perfect");
    setTimeout(loadStyleGameRound, 650);
  } else {
    styleGameLocked = true;
    updateStyleGameStatus("MISS! 내 화면을 초기화하고 다시 맞춰보세요.", "is-miss");
    setTimeout(function () {
      resetPlayerStyle();
      styleGameLocked = false;
    }, 450);
  }
}

function loadStyleGameRound() {
  const player = document.getElementById("playerTarget");
  const example = document.getElementById("exampleTarget");
  if (!player || !example) return;

  resetStyleTarget(player);
  resetStyleTarget(example);
  applyStyleEffect(example, styleGameOrder[styleGameIndex]);
  updateStyleGameProgress();
  styleGameLocked = false;
}

function finishStyleGame() {
  styleGameActive = false;
  styleGameLocked = false;
  clearInterval(styleGameTimer);
  styleGameTimer = null;

  const seconds = ((Date.now() - styleGameStartedAt) / 1000).toFixed(1);
  updateStyleGameTimer(seconds);
  updateStyleGameStatus(`ALL PERFECT! 완료 시간 ${seconds}초`, "is-finished");
}

function resetPlayerStyle() {
  const player = document.getElementById("playerTarget");
  if (!player) return;

  resetStyleTarget(player);
}

function resetStyleTarget(target) {
  if (!target) return;

  target.classList.remove("is-color", "is-size", "is-background", "is-hidden");
}

function applyStyleEffect(target, effect) {
  if (!target) return;

  const className = `is-${effect}`;
  target.classList.toggle(className);
}

function updateStyleGameProgress() {
  const progress = document.getElementById("gameProgress");
  if (!progress) return;

  progress.textContent = `진행 ${styleGameIndex} / ${styleGameEffects.length}`;
}

function updateStyleGameTimer(fixedSeconds) {
  const timer = document.getElementById("gameTimer");
  if (!timer) return;

  const seconds =
    fixedSeconds || ((Date.now() - styleGameStartedAt) / 1000).toFixed(1);
  timer.textContent = `시간 ${seconds}초`;
}

function updateStyleGameStatus(message, className) {
  const status = document.getElementById("gameStatus");
  if (!status) return;

  status.classList.remove("is-perfect", "is-miss", "is-finished");
  if (className) {
    status.classList.add(className);
  }
  status.textContent = message;
}

function shuffleEffects(effects) {
  const result = effects.slice();

  for (let index = result.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    const current = result[index];
    result[index] = result[randomIndex];
    result[randomIndex] = current;
  }

  return result;
}

function deleteMessage(event) {
  const item = event.target.closest("li");
  const list = document.getElementById("messageList");
  if (!item || !list || !list.contains(item)) return;

  list.removeChild(item);
}

function showMessage(event) {
  event.preventDefault();

  const name = document.getElementById("senderName");
  const message = document.getElementById("senderMessage");
  const result = document.getElementById("formResult");
  const list = document.getElementById("messageList");
  if (!name || !message || !result || !list) return;

  const sender = name.value.trim() || "방문자";
  const body = message.value.trim();

  if (!body) {
    result.textContent = `${sender}님, 메시지를 입력하면 댓글 목록에 추가됩니다.`;
    message.focus();
    return;
  }

  const item = document.createElement("li");
  const senderName = document.createElement("strong");
  const messageText = document.createElement("span");

  senderName.textContent = sender;
  messageText.textContent = body;
  item.append(senderName, messageText);
  list.appendChild(item);

  result.textContent = `${sender}님의 댓글이 추가되었습니다. 목록을 클릭하면 삭제할 수 있습니다.`;
  message.value = "";
  message.focus();
}
