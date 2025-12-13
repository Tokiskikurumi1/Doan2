
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
    users[this.id] = this;
    UserManager.saveAllUsers(users);
  }
}

export class UserManager {
  static getAllUsers() {
    return JSON.parse(localStorage.getItem("listusers")) || {};
  }

  static saveAllUsers(users) {
    localStorage.setItem("listusers", JSON.stringify(users));
  }

  static getCurrentUserData() {
    const raw = localStorage.getItem("currentUserData");
    return raw ? JSON.parse(raw) : null;
  }

  static setCurrentUserData(userObj) {
    localStorage.setItem("currentUserData", JSON.stringify(userObj));
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
    videos = []
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
  }
}
export class CourseManager {
  static key = "courses";

  static getAll() {
    let raw = JSON.parse(localStorage.getItem(this.key));

    if (Array.isArray(raw)) {
      const obj = {};
      raw.forEach(c => obj[String(c.id)] = c);
      raw = obj;
      localStorage.setItem(this.key, JSON.stringify(obj));
    }

    return raw || {};
  }

  static saveAll(courses) {
    localStorage.setItem(this.key, JSON.stringify(courses));
  }

  static getById(id) {
    return this.getAll()[String(id)] || null;
  }
}
export class Video {
  constructor({ id = null, title, url, status = "Chưa hoàn thành", assignments = [] }) {
    this.id = id || Date.now().toString();
    this.title = title;
    this.url = url;
    this.status = status;
    this.assignments = assignments;
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
  static addAssignment(courseId, videoId, assignment) {
    const courses = CourseManager.getAll();
    const course = courses[courseId];
    if (!course) return;

    const video = course.videos.find(v => String(v.id) === String(videoId));
    if (!video) return;

    video.assignments.push(assignment);
    CourseManager.saveAll(courses);
  }
}

export class Comment {
  constructor({
    id = null,
    videoId,
    userId,
    name,
    avatar,
    text,
    time = new Date().toLocaleString("vi-VN")
  }) {
    this.id = id || Date.now();
    this.videoId = String(videoId);
    this.userId = userId;
    this.name = name;
    this.avatar = avatar;
    this.text = text;
    this.time = time;
  }
}

export class CommentManager {
  static key = "comments";

  static getAll() {
    return JSON.parse(localStorage.getItem(this.key)) || {};
  }

  static saveAll(comments) {
    localStorage.setItem(this.key, JSON.stringify(comments));
  }

  static getByVideo(videoId) {
    const all = this.getAll();
    return all[String(videoId)] || [];
  }

  static addComment(comment) {
    const all = this.getAll();
    const videoId = String(comment.videoId);

    if (!all[videoId]) all[videoId] = [];
    all[videoId].push(comment);

    this.saveAll(all);
  }

  static deleteComment(videoId, commentId) {
    const all = this.getAll();
    const list = all[String(videoId)] || [];

    all[String(videoId)] = list.filter(c => c.id !== commentId);
    this.saveAll(all);
  }
}
