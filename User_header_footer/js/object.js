// object.js
export class User {
  constructor({ username, yourname, email, phone = "", bob = "", province = "", district = "", password = "", role = "Học viên" }) {
    this.username = username;
    this.yourname = yourname;
    this.email = email;
    this.phone = phone;
    this.bob = bob;
    this.province = province;
    this.district = district;
    this.password = password;
    this.role = role;
  }

  save() {
    const users = UserManager.getAllUsers();
    users[this.username] = this;
    UserManager.saveAllUsers(users);
  }

  static loadCurrent() {
    const username = UserManager.getCurrentUser();
    const users = UserManager.getAllUsers();
    if (username && users[username]) {
      return new User(users[username]);
    }
    return null;
  }
}

export class UserManager {
  static getAllUsers() {
    return JSON.parse(localStorage.getItem("listusers")) || {};
  }

  static saveAllUsers(users) {
    localStorage.setItem("listusers", JSON.stringify(users));
  }

  static getCurrentUser() {
    return localStorage.getItem("currentUser");
  }

  static setCurrentUser(username) {
    localStorage.setItem("currentUser", username);
  }

  static userExists(username) {
    return !!this.getAllUsers()[username];
  }

  static isEmailTaken(email) {
    return Object.values(this.getAllUsers()).some((u) => u.email === email);
  }

  static validateLogin(username, password) {
    const users = this.getAllUsers();
    return users[username]?.password === password;
  }

  static getPasswordByEmail(email) {
    const users = this.getAllUsers();
    for (let key in users) {
      if (users[key].email === email) return users[key].password;
    }
    return null;
  }
}
