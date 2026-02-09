function getTodayKey() {
    return new Date().toISOString().split("T")[0];
  }
  
  function getVotes() {
    return JSON.parse(localStorage.getItem("votes")) || { A: 0, B: 0 };
  }
  
  function saveVotes(votes) {
    localStorage.setItem("votes", JSON.stringify(votes));
  }
  
  function hasVotedToday() {
    return localStorage.getItem("votedDate") === getTodayKey();
  }
  
  function setVotedToday() {
    localStorage.setItem("votedDate", getTodayKey());
  }
  
  function isToday(dateString) {
    const today = new Date().toISOString().split("T")[0];
    return dateString === today;
  }
  