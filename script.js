document.addEventListener("DOMContentLoaded", function () {
  const year = document.getElementById("year");
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  const targetDate = document.getElementById("targetDate");
  if (targetDate) {
    targetDate.value = "2026-06-20";
  }
});

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
  const input = document.getElementById("randomItems");
  const result = document.getElementById("randomResult");
  if (!input || !result) return;

  const items = input.value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  if (items.length === 0) {
    result.textContent = "항목을 하나 이상 입력해 주세요.";
    return;
  }

  const index = Math.floor(Math.random() * items.length);
  result.textContent = `오늘의 선택은 "${items[index]}" 입니다.`;
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

function showMessage(event) {
  event.preventDefault();

  const name = document.getElementById("senderName");
  const message = document.getElementById("senderMessage");
  const result = document.getElementById("formResult");
  if (!name || !message || !result) return;

  const sender = name.value.trim() || "방문자";
  const body = message.value.trim();

  result.textContent = body
    ? `${sender}님의 메시지를 확인했습니다: ${body}`
    : `${sender}님, 메시지를 입력하면 이곳에서 바로 확인할 수 있습니다.`;
}
