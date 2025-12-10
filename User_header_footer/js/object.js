

export class User {
  constructor({
    id = null,
    username,
    yourname,
    email,
    phone = "",
    dob = "",
    province = "",
    district = "",
    gender = "",
    password = "",
    role = "",
    joinDate = null,   
    avatar = ""        
  }) {

    const usernameRegex = /^[a-zA-Z0-9]{4,12}$/;
    if (!username || !usernameRegex.test(username)) {
      throw new Error("Tên tài khoản phải từ 4-12 ký tự, chỉ gồm chữ và số");
    }

    const nameRegex = /^[\p{L}\s]+$/u;
    if (!yourname || !nameRegex.test(yourname)) {
      throw new Error("Họ và tên chỉ được chứa chữ cái và khoảng trắng");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      throw new Error("Email không hợp lệ");
    }

    const phoneRegex = /^\+84\d{9,10}$/;
    if (phone && !phoneRegex.test(phone)) {
      throw new Error("Số điện thoại phải có định dạng +84xxxxxxxxx");
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!password || !passwordRegex.test(password)) {
      throw new Error("Mật khẩu phải ít nhất 8 ký tự, gồm chữ và số");
    }

    if (!["student", "teacher"].includes(role)) {
      throw new Error("Vai trò phải là 'student' hoặc 'teacher'");
    }

    if (dob && isNaN(Date.parse(dob))) {
      throw new Error("Ngày sinh không hợp lệ");
    }

    if (gender && !["male", "female", "other"].includes(gender)) {
      throw new Error("Giới tính không hợp lệ");
    }


    this.id = id || Date.now().toString();
    this.username = username;
    this.yourname = yourname;
    this.email = email;
    this.phone = phone;
    this.dob = dob;
    this.province = province;
    this.district = district;
    this.gender = gender;
    this.password = password;
    this.role = role;

    this.joinDate = joinDate || Date.now();

    this.avatar = avatar || "";
  }

  save() {
    const users = UserManager.getAllUsers();

    if (Object.values(users).some((u) => u.username === this.username)) {
      throw new Error("Tên tài khoản đã tồn tại");
    }
    if (UserManager.isEmailTaken(this.email)) {
      throw new Error("Email đã được sử dụng");
    }

    users[this.id] = this;
    UserManager.saveAllUsers(users);
  }

  static loadCurrent() {
    const id = UserManager.getCurrentUser();
    const users = UserManager.getAllUsers();
    return id && users[id] ? new User(users[id]) : null;
  }
}

export class UserManager {
  static getAllUsers() {
    try {
      return JSON.parse(localStorage.getItem("listusers")) || {};
    } catch {
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

  static isEmailTaken(email) {
    return Object.values(this.getAllUsers()).some((u) => u.email === email);
  }

  static validateLogin(username, password, role = null) {
    const user = Object.values(this.getAllUsers()).find((u) => u.username === username);
    if (!user) return false;
    if (user.password !== password) return false;
    if (role && user.role !== role) return false;
    return true;
  }
}



export class Course {
  constructor({
    id = null,
    teacherId,
    teacherName,
    name,
    type,
    date,
    detail = "",
    price = 0,
    status = "draft",
    image = "./img/course.png",
    students = [],
    videos = [],
    assignments = []
  }) {
    this.id = id || Date.now().toString();
    this.teacherId = teacherId;
    this.teacherName = teacherName;
    this.name = name;
    this.type = type;
    this.date = date;
    this.detail = detail;
    this.price = price;
    this.status = status;
    this.image = image;
    this.students = students;
    this.videos = videos;
    this.assignments = assignments;
  }
}

export class CourseManager {
  static key = "courses";

  static getAll() {
    try {
      const raw = JSON.parse(localStorage.getItem(this.key));
      return raw ? raw : {};
    } catch {
      return {};
    }
  }

  static saveAll(courses) {
    localStorage.setItem(this.key, JSON.stringify(courses));
  }

  static add(course) {
    const courses = this.getAll();
    courses[course.id] = course;
    this.saveAll(courses);
  }

  static getById(id) {
    return this.getAll()[id] || null;
  }
}

export class Video {
  constructor({ id = null, title, url, status = "Chưa hoàn thành" }) {
    this.id = id || Date.now().toString();
    this.title = title;
    this.url = url;
    this.status = status;
  }
}

export class VideoManager {
  static addVideoToCourse(courseId, video) {
    const courses = CourseManager.getAll();
    if (!courses[courseId]) return;

    courses[courseId].videos.push(video);
    CourseManager.saveAll(courses);
  }
}


export class Assignment {
  constructor({
    id = null,
    teacherId,
    courseId,
    videoId,
    videoTitle,
    title,
    description,
    duration,
    deadline,
    type = "Quizz",
    status = "draft",
    questions = [],
    createdAt = new Date().toISOString()
  }) {
    this.id = id || Date.now().toString();
    this.teacherId = teacherId;
    this.courseId = courseId;
    this.videoId = videoId;
    this.videoTitle = videoTitle;
    this.title = title;
    this.description = description;
    this.duration = duration;
    this.deadline = deadline;
    this.type = type;
    this.status = status;
    this.questions = questions;
    this.createdAt = createdAt;
  }
}

export class AssignmentManager {
  static addAssignment(courseId, assignment) {
    const courses = CourseManager.getAll();
    if (!courses[courseId]) return;

    courses[courseId].assignments.push(assignment);
    CourseManager.saveAll(courses);
  }
}

export class CourseReader {
  constructor(options = {}) {
    this.coursesKey = options.coursesKey || "courses";
    this.selectedCourseIdKey = options.selectedCourseIdKey || "selectedCourseId";
    this.teacherNameKey = options.teacherNameKey || "savedUsername";

    this._rawCourses = this._loadRawCourses();
    this.selectedCourseId = localStorage.getItem(this.selectedCourseIdKey) || null;
    this.teacherName = localStorage.getItem(this.teacherNameKey) || "";
  }

  _loadRawCourses() {
    try {
      const raw = JSON.parse(localStorage.getItem(this.coursesKey));
      if (!raw) return {};
      return raw;
    } catch {
      return {};
    }
  }

  getAllCourses() {
    return JSON.parse(JSON.stringify(this._rawCourses));
  }

  getCourseById(id) {
    return this._rawCourses[id] ? JSON.parse(JSON.stringify(this._rawCourses[id])) : null;
  }

  getSelectedCourse() {
    return this.getCourseById(this.selectedCourseId);
  }

  getCourseDetails(id = null) {
    const course = id ? this.getCourseById(id) : this.getSelectedCourse();
    if (!course) return null;

    return {
      ...course,
      price: Number(course.price) || 0,
      videos: course.videos || [],
      assignments: course.assignments || [],
      students: course.students || []
    };
  }

  getVideos(id = null) {
    const course = id ? this.getCourseById(id) : this.getSelectedCourse();
    return course?.videos || [];
  }

  reload() {
    this._rawCourses = this._loadRawCourses();
    this.selectedCourseId = localStorage.getItem(this.selectedCourseIdKey) || null;
    this.teacherName = localStorage.getItem(this.teacherNameKey) || "";
  }
}