const fakeData = {
  adminStats: {
    students: 1240,
    courses: 52,
    teachers: 15,
    revenue: "120,000,000 VND",
  },
  teacherCourses: [
    { name: "Lập trình C#", students: 40 },
    { name: "SQL Cơ bản", students: 35 },
    { name: "Flutter cho người mới", students: 25 },
  ],
  attendance: [
    { date: "2025-10-10", present: 35, absent: 5 },
    { date: "2025-10-09", present: 37, absent: 3 },
  ],
  grades: [
    { name: "Nguyễn Văn A", grade: 9.0 },
    { name: "Trần Thị B", grade: 8.5 },
    { name: "Lê Văn C", grade: 7.8 },
  ],
};

/*Fake dashborad */

// Giả lập dữ liệu
const stats = {
  users: 1245,
  courses: 37,
  sessions: 8230,
  revenue: 95600000,
};

const newUsers = [
  { name: "Nguyễn Văn A", email: "a@gmail.com", date: "2025-10-01" },
  { name: "Trần Thị B", email: "b@gmail.com", date: "2025-10-03" },
  { name: "Lê Văn C", email: "c@gmail.com", date: "2025-10-07" },
  { name: "Phạm Thị D", email: "d@gmail.com", date: "2025-10-10" },
];

const revenueData = [8, 10, 5, 15, 12, 20, 25, 22, 18, 30, 28, 35];

/*fake user-manage */
const users = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    email: "a@gmail.com",
    role: "teacher",
    created: "2024-10-01",
    status: "Hoạt động",
  },
  {
    id: 2,
    name: "Trần Thị B",
    email: "b@gmail.com",
    role: "student",
    created: "2024-10-03",
    status: "Khóa",
  },
  {
    id: 3,
    name: "Lê Văn C",
    email: "c@gmail.com",
    role: "student",
    created: "2024-10-05",
    status: "Hoạt động",
  },
];

/* fake course */
const courses = [
  {
    name: "HTML cơ bản",
    teacher: "Nguyễn Minh",
    students: 30,
    status: "Hoạt động",
  },
  {
    name: "C# nâng cao",
    teacher: "Trần An",
    students: 25,
    status: "Hoạt động",
  },
  {
    name: "SQL Server",
    teacher: "Lê Bình",
    students: 20,
    status: "Tạm dừng",
  },
];

/*fake test */
const tests = [
  {
    id: 1,
    name: "Kiểm tra giữa kỳ",
    course: "Java Cơ bản",
    date: "2024-10-01",
    status: "Đang hoạt động",
  },
  {
    id: 2,
    name: "Cuối kỳ Python",
    course: "Python Nâng cao",
    date: "2024-11-02",
    status: "Ẩn",
  },
];

/*fake paying */
const payments = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    course: "Java Cơ bản",
    amount: "500,000đ",
    method: "VNPay",
    date: "2024-09-15",
    status: "Hoàn tất",
  },
  {
    id: 2,
    name: "Trần Thị B",
    course: "Python Nâng cao",
    amount: "750,000đ",
    method: "Momo",
    date: "2024-10-02",
    status: "Đang xử lý",
  },
];

/*fake report */
const reportData = {
  users: { teachers: 12, students: 105, active: 95, locked: 10 },
  courses: { total: 18, active: 14, upcoming: 3, closed: 1 },
  payments: { revenue: "18,250,000đ", pending: "2,500,000đ" },
};

const container = document.getElementById("reportContainer");
const select = document.getElementById("reportType");
