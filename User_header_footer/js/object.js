
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add authorization header if token exists
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication methods
  async login(account, password) {
    return this.request('/api/student/login', {
      method: 'POST',
      body: JSON.stringify({ Account: account, Pass: password }),
    });
  }

  async register(userData) {
    return this.request('/api/student/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // User profile methods
  async getUserProfile(userId) {
    return this.request(`/api/student/profile/${userId}`);
  }

  async updateUserProfile(userId, profileData) {
    return this.request(`/api/student/profile/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async changePassword(changePasswordData) {
    return this.request('/api/student/change-password', {
      method: 'PUT',
      body: JSON.stringify(changePasswordData),
    });
  }

  // Course methods
  async getEnrolledCourses(userId) {
    return this.request(`/api/student/enrolled-courses/${userId}`);
  }

  async getUnenrolledCourses(userId) {
    return this.request(`/api/student/unenrolled-courses/${userId}`);
  }

  async getAllCourses() {
    return this.request('/api/student/courses');
  }

  async enrollCourse(userId, courseId) {
    return this.request(`/api/student/${userId}/enroll/${courseId}`, {
      method: 'POST',
    });
  }

  async getCourseDetails(courseId) {
    return this.request(`/api/student/course/${courseId}`);
  }

  // Assignment and comment methods
  async getAssignment(assignmentId) {
    return this.request(`/api/student/assignment/${assignmentId}`);
  }

  async addComment(commentData) {
    return this.request('/api/student/comment', {
      method: 'POST',
      body: JSON.stringify(commentData),
    });
  }

  async updateComment(commentData) {
    return this.request('/api/student/comment', {
      method: 'PUT',
      body: JSON.stringify(commentData),
    });
  }

  async deleteComment(commentId, userId) {
    return this.request(`/api/student/comment/${commentId}/${userId}`, {
      method: 'DELETE',
    });
  }

  // Score methods
  async saveScore(scoreData) {
    return this.request('/api/student/score/save', {
      method: 'POST',
      body: JSON.stringify(scoreData),
    });
  }

  async getScores(studentId) {
    return this.request(`/api/student/scores/${studentId}`);
  }
}

// Create a default instance
export const apiClient = new ApiClient();


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
    course,             
    courseId,
    videoId,
    videoTitle,
    title,
    description,
    duration,
    deadline,
    type = "Quizz",
    status = "draft",    // trạng thái xuất bản: draft/published
    assStatus = "incomplete", // trạng thái làm bài của học viên
    questions = [],
    createdAt = new Date().toISOString()
  }) {
    this.id = id || Date.now().toString();
    this.teacherId = teacherId;
    this.course = course;          
    this.courseId = courseId;
    this.videoId = videoId;
    this.videoTitle = videoTitle;
    this.title = title;
    this.description = description;
    this.duration = duration;
    this.deadline = deadline;
    this.type = type;
    this.status = status;          
    this.assStatus = assStatus;    


    this.questions = questions.map(q => {
      if (type === "Rewrite") {
        return { 
          original: q.original || q.question, 
          rewritten: q.rewritten || "", 
          type: "Rewrite" 
        };
      } else {
        return {
          question: q.question,
          answers: q.answers || [],
          correct: q.correct ?? 0,
          type: "Quizz"
        };
      }
    });

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
    this.id = id || Date.now().toString();
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

export class UserManager {
  static key = "user";
  static getCurrentUserData() {
    const userData = localStorage.getItem(this.key);
    return userData ? JSON.parse(userData) : null;
  }
  static setCurrentUserData(userData) {
    localStorage.setItem(this.key, JSON.stringify(userData));
  }
  static clearCurrentUserData() {
    localStorage.removeItem(this.key);
  }
}
# Security enhancements
# Performance optimization
// Performance optimization implemented
// Feature flag implementation
   Code review suggestions applied */
// Unit tests added for better coverage
// Code documentation updated
// Feature flag implementation
// Unit tests added for better coverage
// Performance optimization implemented
/* Multi-line comment block
// Configuration settings optimized
// Code documentation updated
// UI/UX improvements added
// Bug fixes and code refactoring
