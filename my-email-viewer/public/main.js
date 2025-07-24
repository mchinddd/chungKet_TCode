tailwind.config = {
  theme: {
    extend: {
      colors: {
        primary: "#4f46e5",
        secondary: "#06b6d4",
        dark: "#1e293b",
        light: "#f8fafc",
      },
    },
  },
};

document.addEventListener("DOMContentLoaded", () => {
  // --- Mobile menu toggle ---
  const mobileMenuBtn = document.getElementById("mobile-menu-button");
  const mobileMenu = document.getElementById("mobile-menu");
  const iconOpen = document.getElementById("mobile-menu-open-icon");
  const iconClose = document.getElementById("mobile-menu-close-icon");

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener("click", () => {
      const isOpen = !mobileMenu.classList.contains("hidden");
      mobileMenu.classList.toggle("hidden");
      iconOpen?.classList.toggle("hidden", !isOpen);
      iconClose?.classList.toggle("hidden", isOpen);
    });
  }

  // --- Tab switch (Link/Email/Phone) ---
  const tabs = document.querySelectorAll(".checker-tab");
  const tabContents = {
    link: document.getElementById("link-tab-content"),
    email: document.getElementById("email-tab-content"),
    phone: document.getElementById("phone-tab-content"),
  };

  // quiz
  const totalQuestions = 5;
  let currentQuestion = 1;
  let score = 0;

  const correctAnswers = {
    q1: "b",
    q2: "a",
    q3: "b",
    q4: "a",
    q5: "b",
  };

  const progressBar = document.getElementById("progress-bar");
  const currentQuestionText = document.getElementById("current-question");
  const scoreText = document.getElementById("quiz-score");
  const prevBtn = document.getElementById("quiz-prev");
  const nextBtn = document.getElementById("quiz-next");
  const submitBtn = document.getElementById("quiz-submit");

  // Popup elements
  const quizModal = document.getElementById("quiz-result-modal");
  const quizScoreResult = document.getElementById("quiz-score-result");
  const quizCloseBtn = document.getElementById("quiz-result-close");
  const quizRetryBtn = document.getElementById("quiz-retry");

  function activateTab(selectedTab) {
    // Reset style for all tabs
    tabs.forEach((t) => {
      t.classList.remove("border-blue-500", "text-blue-600", "font-semibold");
      t.classList.add("border-transparent", "text-gray-500");
    });

    // Highlight active tab
    selectedTab.classList.remove("border-transparent", "text-gray-500");
    selectedTab.classList.add(
      "border-blue-500",
      "text-blue-600",
      "font-semibold"
    );

    // Show only selected tab content
    Object.values(tabContents).forEach((el) => el?.classList.add("hidden"));
    tabContents[selectedTab.dataset.tab]?.classList.remove("hidden");
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => activateTab(tab));
  });

  function showQuestion(index) {
    document
      .querySelectorAll(".quiz-question")
      .forEach((q) => q.classList.add("hidden"));
    document.getElementById(`question-${index}`).classList.remove("hidden");
    currentQuestionText.textContent = index;
    progressBar.style.width = `${(index / totalQuestions) * 100}%`;
    prevBtn.classList.toggle("hidden", index === 1);
    nextBtn.classList.toggle("hidden", index === totalQuestions);
    submitBtn.classList.toggle("hidden", index !== totalQuestions);
  }

  nextBtn.addEventListener("click", () => {
    if (currentQuestion < totalQuestions) {
      currentQuestion++;
      showQuestion(currentQuestion);
    }
  });

  prevBtn.addEventListener("click", () => {
    if (currentQuestion > 1) {
      currentQuestion--;
      showQuestion(currentQuestion);
    }
  });

  submitBtn.addEventListener("click", () => {
    score = 0;
    for (let i = 1; i <= totalQuestions; i++) {
      const selected = document.querySelector(`input[name="q${i}"]:checked`);
      if (selected && selected.value === correctAnswers[`q${i}`]) {
        score++;
      }
    }
    scoreText.textContent = score;
    quizScoreResult.textContent = score;
    quizModal.classList.remove("hidden", "opacity-0");
    quizModal.classList.add("flex");
  });

  quizCloseBtn.addEventListener("click", () => {
    quizModal.classList.add("hidden");
    quizModal.classList.remove("flex");
  });

  quizRetryBtn.addEventListener("click", () => {
    // Reset quiz
    document
      .querySelectorAll("input[type='radio']")
      .forEach((el) => (el.checked = false));
    score = 0;
    currentQuestion = 1;
    showQuestion(currentQuestion);
    quizModal.classList.add("hidden");
    quizModal.classList.remove("flex");
  });

  showQuestion(currentQuestion);

  // Chọn mặc định tab Link khi mở trang
  const defaultTab = document.querySelector('.checker-tab[data-tab="link"]');
  if (defaultTab) activateTab(defaultTab);
});
