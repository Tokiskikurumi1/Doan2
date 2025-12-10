function changePassword() {
      var newPass = document.getElementById('newPassword').value;
      var confirmPass = document.getElementById('confirmPassword').value;
      var error = document.getElementById('errorMessage');
      var success = document.getElementById('successMessage');

      error.style.display = 'none';
      success.style.display = 'none';

      if (!newPass || !confirmPass) {
        error.textContent = 'Vui lòng nhập đầy đủ mật khẩu.';
        error.style.display = 'block';
        return;
      }

      if (newPass.length < 8) {
        error.textContent = 'Mật khẩu mới phải có ít nhất 8 ký tự.';
        error.style.display = 'block';
        return;
      }

      if (newPass !== confirmPass) {
        error.textContent = 'Mật khẩu nhập lại không khớp.';
        error.style.display = 'block';
        return;
      }
      success.style.display = 'block';
    }
    document.getElementById("avatarInput").addEventListener("change", function () {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      document.getElementById("avatarPreview").src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
});
