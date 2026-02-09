// ==== Data & UI Elements ====

const qIndex = new Date().getDate() % questions.length;
const currentQuestion = questions[qIndex];

const questionText = document.getElementById("question-text");
const optionAButton = document.getElementById("optionA");
const optionBButton = document.getElementById("optionB");

const resultsSection = document.getElementById("results-section");
const resultA = document.getElementById("resultA");
const resultB = document.getElementById("resultB");

const commentsSection = document.getElementById("comments-section");
const commentInput = document.getElementById("comment-input");
const postCommentBtn = document.getElementById("post-comment");
const commentList = document.getElementById("comment-list");

// ==== Helper Functions ====

function getTodayKey() {
  return new Date().toISOString().split("T")[0];
}

// ==== Voting State ====

let votes = JSON.parse(localStorage.getItem("votes")) || { A: 0, B: 0 };
let hasVoted = localStorage.getItem("votedDate") === getTodayKey();

// ==== Comments State ====

let comments = JSON.parse(localStorage.getItem("comments")) || [];

// ==== Initialize UI ====

function initUI() {
  // Show current question and options
  questionText.textContent = currentQuestion.question;
  optionAButton.textContent = currentQuestion.optionA;
  optionBButton.textContent = currentQuestion.optionB;

  if (hasVoted) {
    lockVoting();
    updateResults();
    showComments();
    renderComments();
  } else {
    resultsSection.classList.add("hidden");
    commentsSection.classList.add("hidden");
  }
}

// ==== Voting Functions ====

function updateResults() {
  const totalVotes = votes.A + votes.B || 1;
  const percentA = Math.round((votes.A / totalVotes) * 100);
  const percentB = 100 - percentA;

  resultA.textContent = `A: ${percentA}%`;
  resultB.textContent = `B: ${percentB}%`;

  resultsSection.classList.remove("hidden");
}

function lockVoting() {
  optionAButton.disabled = true;
  optionBButton.disabled = true;
}

function showComments() {
  commentsSection.classList.remove("hidden");
}

function vote(option) {
  if (hasVoted) return;

  if (option === "A") {
    votes.A += 1;
  } else if (option === "B") {
    votes.B += 1;
  }

  localStorage.setItem("votes", JSON.stringify(votes));
  localStorage.setItem("votedDate", getTodayKey());
  hasVoted = true;

  lockVoting();
  updateResults();
  showComments();
  renderComments();
}

// ==== Comments Functions ====

function saveComments() {
  localStorage.setItem("comments", JSON.stringify(comments));
}

function renderComments() {
  // Sort comments by upvotes descending
  comments.sort((a, b) => b.upvotes - a.upvotes);

  commentList.innerHTML = "";

  comments.forEach((comment, index) => {
    const li = document.createElement("li");
    li.textContent = comment.text;

    // Upvote button
    const upvoteBtn = document.createElement("button");
    upvoteBtn.textContent = `⬆️ ${comment.upvotes}`;
    upvoteBtn.style.marginLeft = "10px";

    upvoteBtn.addEventListener("click", () => {
      comments[index].upvotes++;
      saveComments();
      renderComments();
    });

    li.appendChild(upvoteBtn);
    commentList.appendChild(li);
  });
}

postCommentBtn.addEventListener("click", () => {
  const text = commentInput.value.trim();

  if (text === "") {
    alert("Comment can’t be empty!");
    return;
  }

  comments.push({ text, upvotes: 0 });
  saveComments();
  renderComments();

  commentInput.value = "";
});

// ==== Countdown Timer ====

function updateCountdown() {
  const now = new Date();
  const tomorrow = new Date();
  tomorrow.setHours(24, 0, 0, 0); // next midnight

  const diff = tomorrow - now;

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  const format = n => (n < 10 ? "0" + n : n);

  const countdownText = `New choice drops in ${format(hours)}:${format(minutes)}:${format(seconds)}`;

  document.getElementById("countdown").textContent = countdownText;
}

// ==== Event Listeners ====

optionAButton.addEventListener("click", () => vote("A"));
optionBButton.addEventListener("click", () => vote("B"));

// ==== Initialize everything on page load ====

initUI();
updateCountdown();
setInterval(updateCountdown, 1000);
