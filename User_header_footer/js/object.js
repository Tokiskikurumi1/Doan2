// object.js
// Course model + CourseManager để chuẩn hóa thao tác với localStorage

export class Course {
  constructor({
    id = null,
    name = "",
    type = "",       // ví dụ: "course" hoặc "book"
    date = "",
    detail = "",
    price = 0,
    status = "draft", // ví dụ: draft, published
    videos = [],     // mảng {id, title, url}
    teacher = "",    // username hoặc tên giáo viên
    rating = 0,
    level = ""       // easy, medium, hard
  } = {}) {
    this.id = id || Date.now().toString();
    this.name = name;
    this.type = type;
    this.date = date;
    this.detail = detail;
    this.price = price;
    this.status = status;
    this.videos = Array.isArray(videos) ? videos : [];
    this.teacher = teacher;
    this.rating = rating;
    this.level = level;
  }
}

export class CourseManager {
  static COURSES_KEY = "courses";
  static SELECTED_KEY = "selectedCourseId";
  static SAVED_USERNAME_KEY = "savedUsername";

  // Lấy mảng courses (raw array)
  static getAllCourses() {
    try {
      return JSON.parse(localStorage.getItem(this.COURSES_KEY)) || [];
    } catch (e) {
      console.error("CourseManager: lỗi đọc courses từ localStorage", e);
      return [];
    }
  }

  // Lưu mảng courses
  static saveAllCourses(courses) {
    localStorage.setItem(this.COURSES_KEY, JSON.stringify(courses || []));
  }

  // Lấy course theo id (trả về tham chiếu tới phần tử trong mảng)
  static getCourseById(id) {
    const courses = this.getAllCourses();
    return courses.find((c) => String(c.id) === String(id)) || null;
  }

  // Lấy course đang được chọn (dựa trên selectedCourseId)
  static getSelectedCourse() {
    const id = this.getSelectedCourseId();
    if (!id) return null;
    return this.getCourseById(id);
  }

  // Lưu (cập nhật) một course object (course phải có id)
  // Nếu course không tồn tại sẽ ném lỗi
  static saveCourse(course) {
    if (!course || !course.id) throw new Error("CourseManager.saveCourse: course không hợp lệ");
    const courses = this.getAllCourses();
    const idx = courses.findIndex((c) => String(c.id) === String(course.id));
    if (idx === -1) {
      // nếu không tìm thấy, thêm mới
      courses.push(course);
    } else {
      courses[idx] = course;
    }
    this.saveAllCourses(courses);
  }

  // Thêm course mới (trả về course đã thêm)
  static addCourse(courseData = {}) {
    const courses = this.getAllCourses();
    const course = courseData instanceof Course ? courseData : new Course(courseData);
    courses.push(course);
    this.saveAllCourses(courses);
    return course;
  }

  // Xóa course theo id
  static deleteCourse(id) {
    let courses = this.getAllCourses();
    courses = courses.filter((c) => String(c.id) !== String(id));
    this.saveAllCourses(courses);
  }

  // Set / get selectedCourseId
  static setSelectedCourseId(id) {
    if (id === null || id === undefined) {
      localStorage.removeItem(this.SELECTED_KEY);
    } else {
      localStorage.setItem(this.SELECTED_KEY, String(id));
    }
  }

  static getSelectedCourseId() {
    return localStorage.getItem(this.SELECTED_KEY);
  }

  // Lưu / lấy tên giáo viên đã lưu (savedUsername)
  static setSavedUsername(username) {
    if (username === null || username === undefined) {
      localStorage.removeItem(this.SAVED_USERNAME_KEY);
    } else {
      localStorage.setItem(this.SAVED_USERNAME_KEY, String(username));
    }
  }

  static getSavedUsername() {
    return localStorage.getItem(this.SAVED_USERNAME_KEY);
  }

  // ===== Video helpers (thao tác trực tiếp trên courses array) =====

  // Thêm video vào course (trả về video mới)
  static addVideoToCourse(courseId, { id = null, title = "", url = "" } = {}) {
    const courses = this.getAllCourses();
    const idx = courses.findIndex((c) => String(c.id) === String(courseId));
    if (idx === -1) throw new Error("CourseManager.addVideoToCourse: Course không tồn tại");
    const video = { id: id || Date.now(), title, url };
    courses[idx].videos = courses[idx].videos || [];
    courses[idx].videos.push(video);
    this.saveAllCourses(courses);
    return video;
  }

  // Cập nhật video trong course (videoData phải có id)
  static updateVideoInCourse(courseId, videoData = {}) {
    if (!videoData || !videoData.id) throw new Error("CourseManager.updateVideoInCourse: videoData không hợp lệ");
    const courses = this.getAllCourses();
    const idx = courses.findIndex((c) => String(c.id) === String(courseId));
    if (idx === -1) throw new Error("CourseManager.updateVideoInCourse: Course không tồn tại");
    const videos = courses[idx].videos || [];
    const vidIdx = videos.findIndex((v) => String(v.id) === String(videoData.id));
    if (vidIdx === -1) throw new Error("CourseManager.updateVideoInCourse: Video không tồn tại");
    videos[vidIdx] = { ...videos[vidIdx], ...videoData };
    courses[idx].videos = videos;
    this.saveAllCourses(courses);
    return videos[vidIdx];
  }

  // Xóa video khỏi course
  static deleteVideoFromCourse(courseId, videoId) {
    const courses = this.getAllCourses();
    const idx = courses.findIndex((c) => String(c.id) === String(courseId));
    if (idx === -1) throw new Error("CourseManager.deleteVideoFromCourse: Course không tồn tại");
    courses[idx].videos = (courses[idx].videos || []).filter((v) => String(v.id) !== String(videoId));
    this.saveAllCourses(courses);
  }

  // Trả về index của course trong mảng (hoặc -1)
  static findCourseIndexById(id) {
    const courses = this.getAllCourses();
    return courses.findIndex((c) => String(c.id) === String(id));
  }
}

// ========================== Backwards compatibility helpers ==========================
// Các hàm này giúp chuyển mã hiện tại (detail_course.js) sang dùng CourseManager
// Nếu bạn muốn giữ nguyên detail_course.js hiện tại, chỉ cần thay thế các thao tác localStorage
// bằng các hàm tương ứng của CourseManager.

// Ví dụ sử dụng tương đương với mã gốc:
// let courses = CourseManager.getAllCourses();
// const courseId = CourseManager.getSelectedCourseId();
// const nameTeacher = CourseManager.getSavedUsername();
// const course = CourseManager.getCourseById(courseId);

// Hoặc để lấy tham chiếu trực tiếp:
// const coursesRef = CourseManager.getAllCourses();
// const courseRef = coursesRef.find(c => String(c.id) === String(courseId));
// (sau đó sửa courseRef và gọi CourseManager.saveAllCourses(coursesRef) hoặc CourseManager.saveCourse(courseRef))

// ========================== Export mặc định (tuỳ chọn) ==========================
// Không export mặc định để giữ rõ ràng các export named
