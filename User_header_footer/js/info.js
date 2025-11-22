import { User } from './object.js';

const inputYourname = document.querySelector(".input-yourname");
const inputUsername = document.querySelector(".input-username");
const inputEmail = document.querySelector(".input-email");
const inputPhone = document.querySelector(".input-phone");
const inputBob = document.querySelector(".input-bob");
const inputProvince = document.querySelector(".input-province");
const inputDistrict = document.querySelector(".input-district");

const currentUser = User.loadCurrent();

if (currentUser) {
  inputYourname.textContent = currentUser.yourname;
  inputUsername.textContent = currentUser.username;
  inputEmail.textContent = currentUser.email;
  inputPhone.textContent = currentUser.phone || "Chưa cập nhật";
  inputBob.textContent = currentUser.bob || "Chưa cập nhật";
  inputProvince.textContent = currentUser.province || "Chưa cập nhật";
  inputDistrict.textContent = currentUser.district || "Chưa cập nhật";
} else {
  console.error("Không tìm thấy thông tin người dùng hiện tại.");
}
