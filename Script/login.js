const modalOverlay = document.getElementById("modalOverlay");
const closeModal = document.getElementById("closeModal");

const loginTab = document.getElementById("loginTab");
const registerTab = document.getElementById("registerTab");

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

// OPEN MODAL
function openAuth(type) {
  modalOverlay.classList.add("show");

  if (type === "register") {
    loginForm.classList.add("hidden");
    registerForm.classList.remove("hidden");

    registerTab.classList.add("active");
    loginTab.classList.remove("active");
  } else {
    registerForm.classList.add("hidden");
    loginForm.classList.remove("hidden");

    loginTab.classList.add("active");
    registerTab.classList.remove("active");
  }
}

// CLOSE MODAL
closeModal.addEventListener("click", function () {
  modalOverlay.classList.remove("show");
});

// CLOSE WHEN CLICKING OUTSIDE
modalOverlay.addEventListener("click", function (e) {
  if (e.target === modalOverlay) {
    modalOverlay.classList.remove("show");
  }
});

// SWITCH TO LOGIN
loginTab.addEventListener("click", function () {
  loginForm.classList.remove("hidden");
  registerForm.classList.add("hidden");

  loginTab.classList.add("active");
  registerTab.classList.remove("active");
});

// SWITCH TO REGISTER
registerTab.addEventListener("click", function () {
  registerForm.classList.remove("hidden");
  loginForm.classList.add("hidden");

  registerTab.classList.add("active");
  loginTab.classList.remove("active");
});

// SHOW/HIDE LOGIN PASSWORD
const showLoginPass = document.getElementById("showLoginPass");
const loginPassword = document.getElementById("loginPassword");

showLoginPass.addEventListener("change", function () {
  if (this.checked) {
    loginPassword.type = "text";
  } else {
    loginPassword.type = "password";
  }
});