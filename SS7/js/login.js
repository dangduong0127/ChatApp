const loginForm = document.getElementById("login-form");

loginForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const email = loginForm.email.value;
  const password = loginForm.password.value;
  function validate() {
    if (email === "" || password === "") {
      alert("Vui lòng điền đầy đủ thông tin");
      return false;
    }
    return true;
  }
  if (validate()) {
    async function login() {
      try {
        const userCredential = await auth.signInWithEmailAndPassword(
          email,
          password
        );
        const user = userCredential.user;
        if (!user.emailVerified) {
          auth.signOut();
          alert("Vui lòng xác thực email!!!");
        } else {
          alert("Đăng nhập thành công!!!");
          window.location.href = "chatScreen.html";
        }
      } catch (err) {
        alert("Đã xảy ra lỗi: " + err.message);
      }
    }
    login();
  }
});
