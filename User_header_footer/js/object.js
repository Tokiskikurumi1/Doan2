export class User {
  constructor({
    id = null,
    username,
    yourname,
    email,
    phone = "",
    dob = "", // ngày sinh
    province = "",
    district = "",
    password = "",
    role = ""
  }) {
    //username
    const usernameRegex = /^[a-zA-Z0-9]{4,12}$/;
    if (!username || !usernameRegex.test(username)) {
      throw new Error("Tên tài khoản phải từ 4-12 ký tự, chỉ gồm chữ và số");
    }

    //họ tên
    const nameRegex = /^[\p{L}\s]+$/u;
    if (!yourname || !nameRegex.test(yourname)) {
      throw new Error("Họ và tên chỉ được chứa chữ cái và khoảng trắng");
    }

    //email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      throw new Error("Email không hợp lệ");
    }

    //số điện thoại
    const phoneRegex = /^\+84\d{9,10}$/;
    if (phone && !phoneRegex.test(phone)) {
      throw new Error("Số điện thoại phải có định dạng +84xxxxxxxxx");
    }

    //mật khẩu
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!password || !passwordRegex.test(password)) {
      throw new Error("Mật khẩu phải ít nhất 8 ký tự, gồm chữ và số");
    }

    //role
    if (!["student", "teacher"].includes(role)) {
      throw new Error("Vai trò phải là 'student' hoặc 'teacher'");
    }

    //ngày sinh
    if (dob && isNaN(Date.parse(dob))) {
      throw new Error("Ngày sinh không hợp lệ");
    }

    this.id = id || Date.now().toString();
    this.username = username;
    this.yourname = yourname;
    this.email = email;
    this.phone = phone;
    this.dob = dob;
    this.province = province;
    this.district = district;
    this.password = password;
    this.role = role;
  }

  save() {
    const users = UserManager.getAllUsers();

    // kiểm tra trùng username
    const exists = Object.values(users).some((u) => u.username === this.username);
    if (exists) {
      throw new Error("Tên tài khoản đã tồn tại");
    }

    if (UserManager.isEmailTaken(this.email)) {
      throw new Error("Email đã được sử dụng");
    }

    users[this.id] = this; // lưu theo id
    UserManager.saveAllUsers(users);
  }

  static loadCurrent() {
    const id = UserManager.getCurrentUser();
    const users = UserManager.getAllUsers();
    if (id && users[id]) {
      return new User(users[id]);
    }
    return null;
  }
}

export class UserManager {
  static getAllUsers() {
    try {
      return JSON.parse(localStorage.getItem("listusers")) || {};
    } catch (e) {
      console.error("Lỗi đọc dữ liệu:", e);
      return {};
    }
  }

  static saveAllUsers(users) {
    localStorage.setItem("listusers", JSON.stringify(users));
  }

  static getCurrentUser() {
    return localStorage.getItem("currentUser");
  }

  static setCurrentUser(id) {
    localStorage.setItem("currentUser", id);
  }

  static userExistsById(id) {
    return !!this.getAllUsers()[id];
  }

  static userExistsByUsername(username) {
    return Object.values(this.getAllUsers()).some((u) => u.username === username);
  }

  static isEmailTaken(email) {
    return Object.values(this.getAllUsers()).some((u) => u.email === email);
  }

  static validateLogin(username, password, role = null) {
    const users = this.getAllUsers();
    const user = Object.values(users).find((u) => u.username === username);
    if (!user) return false;
    if (user.password !== password) return false;
    if (role && user.role !== role) return false;
    return true;
  }

  static getPasswordByEmail(email) {
    const users = this.getAllUsers();
    const user = Object.values(users).find((u) => u.email === email);
    return user ? user.password : null;
  }

  static getUserById(id) {
    return this.getAllUsers()[id] || null;
  }

  static getUserByUsername(username) {
    return Object.values(this.getAllUsers()).find((u) => u.username === username) || null;
  }
}
export class CourseReader {
  /**
   * options:
   *  - coursesKey: key lưu courses trong localStorage (mặc định "courses")
   *  - selectedCourseIdKey: key lưu selectedCourseId (mặc định "selectedCourseId")
   *  - teacherNameKey: key lưu tên giáo viên (mặc định "savedUsername")
   */
  constructor(options = {}) {
    this.coursesKey = options.coursesKey || "courses";
    this.selectedCourseIdKey = options.selectedCourseIdKey || "selectedCourseId";
    this.teacherNameKey = options.teacherNameKey || "savedUsername";

    this._rawCourses = this._loadRawCourses();
    this.selectedCourseId = localStorage.getItem(this.selectedCourseIdKey) || null;
    this.teacherName = localStorage.getItem(this.teacherNameKey) || "";
  }

  // ----- Nội bộ: đọc courses từ localStorage, trả về mảng (bảo toàn cấu trúc lưu trữ) -----
  _loadRawCourses() {
    try {
      const raw = JSON.parse(localStorage.getItem(this.coursesKey));
      if (!raw) return [];
      // nếu lưu dưới dạng object keyed-by-id, chuyển về mảng
      if (!Array.isArray(raw) && typeof raw === "object") {
        return Object.values(raw);
      }
      return raw;
    } catch (e) {
      console.error("CourseReader: lỗi đọc courses từ localStorage", e);
      return [];
    }
  }

  // ----- Lấy tất cả courses (mảng) -----
  getAllCourses() {
    // trả về clone để tránh sửa nhầm dữ liệu gốc
    return JSON.parse(JSON.stringify(this._rawCourses));
  }

  // ----- Lấy course theo id (trả về null nếu không tìm thấy) -----
  getCourseById(id) {
    if (!id) return null;
    const found = this._rawCourses.find(c => String(c.id) === String(id));
    return found ? JSON.parse(JSON.stringify(found)) : null;
  }

  // ----- Lấy course đang được chọn (theo selectedCourseId) -----
  getSelectedCourse() {
    if (!this.selectedCourseId) return null;
    return this.getCourseById(this.selectedCourseId);
  }

  // ----- Lấy chi tiết course (object chuẩn) cho id hoặc selected -----
  getCourseDetails(id = null) {
    const course = id ? this.getCourseById(id) : this.getSelectedCourse();
    if (!course) return null;

    // chuẩn hóa các trường thường dùng
    return {
      id: course.id,
      name: course.name || "",
      type: course.type || "",
      date: course.date || "",
      price: typeof course.price === "number" ? course.price : (Number(course.price) || 0),
      detail: course.detail || "",
      status: course.status || "",
      teacher: course.teacher || this.teacherName || "",
      videos: Array.isArray(course.videos) ? course.videos.map(v => ({
        id: v.id,
        title: v.title,
        url: v.url
      })) : []
    };
  }

  // ----- Lấy danh sách video của course (theo id hoặc selected) -----
  getVideos(id = null) {
    const course = id ? this.getCourseById(id) : this.getSelectedCourse();
    if (!course) return [];
    return Array.isArray(course.videos) ? JSON.parse(JSON.stringify(course.videos)) : [];
  }

  // ----- Tải lại dữ liệu từ localStorage (nếu cần refresh) -----
  reload() {
    this._rawCourses = this._loadRawCourses();
    this.selectedCourseId = localStorage.getItem(this.selectedCourseIdKey) || null;
    this.teacherName = localStorage.getItem(this.teacherNameKey) || "";
  }
}
