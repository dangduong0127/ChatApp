const registerForm = document.getElementById("register-form");

registerForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const data = {
    firstName: registerForm.firstName.value,
    lastName: registerForm.lastName.value,
    email: registerForm.email.value,
    phone: registerForm.phone.value,
    password: registerForm.password.value,
    confirmPassword: registerForm.confirmPassword.value,
  };
  // Validate func
  function validate() {
    if (
      data.firstName.trim() === "" ||
      data.lastName.trim() === "" ||
      data.email.trim() === "" ||
      data.phone.trim() === "" ||
      data.password.trim() === ""
    ) {
      alert("Vui lòng điền đầy đủ thông tin");
      return false;
    }
    // Đoạn mã  emailPattern là một biểu thức chính quy được sử dụng
    // để kiểm tra xem một chuỗi có phải là một địa chỉ email hợp lệ hay không
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(data.email)) {
      alert("Email không hợp lệ");
      return false;
    }

    const phonePattern = /^\d+$/;
    if (!phonePattern.test(data.phone)) {
      alert("Số điện thoại chỉ được chứa số");
      return false;
    }

    if (data.password.length < 6) {
      alert("Mật khẩu phải chứa ít nhất 6 ký tự");
      return false;
    }
    if (data.password !== data.confirmPassword) {
      alert("Mật khẩu không trùng nhau!!!");
      return false;
    }
    // Kiểm tra mật khẩu có chứa ít nhất một chữ hoa, một chữ thường và một ký tự đặc biệt
    const passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])/;
    if (!passwordPattern.test(data.password)) {
      alert(
        "Mật khẩu phải chứa ít nhất một chữ hoa, một chữ thường và một ký tự đặc biệt"
      );
      return false;
    }

    return true;
  }

  if (validate()) {
    async function register() {
      try {
        const userCredential = await auth.createUserWithEmailAndPassword(
          data.email,
          data.password
        );
        const user = userCredential.user;
        console.log(userCredential);
        await auth.currentUser.sendEmailVerification();

        await auth.currentUser.updateProfile({
          displayName: data.firstName + data.lastName,
          photoURL: `https://avatars.dicebear.com/api/initials/${encodeURIComponent(
            data.firstName
          )}.svg`,
        });

        // Lưu thông tin bổ sung của người dùng vào Firestore
        await db.collection("users").doc(user.uid).set(data);

        alert("Đăng ký thành công!!");
      } catch (err) {
        alert("Đã xảy ra lỗi: " + err.message);
        throw err;
      }
    }
    register();
  }
});
