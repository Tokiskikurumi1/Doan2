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

const chartData = [
  { month: "Tháng 1", value: 120 },
  { month: "Đọc", value: 180 },
  { month: "Viết", value: 90 },
  { month: "Từ vựng", value: 220 },
  { month: "Ngữ pháp", value: 160 },
];

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
    id: 1,
    namecourse: "HTML cơ bản",
    desc: "Toeic 750+",
    role: "TOEIC",
    teacher: "Nguyễn Minh",
  },
  {
    id: 2,
    namecourse: "HTML cơ bản",
    desc: "Toeic 750+",
    role: "TOEIC",
    teacher: "Nguyễn Minh",
  },
  {
    id: 3,
    namecourse: "HTML cơ bản",
    desc: "Toeic 750+",
    role: "TOEIC",
    teacher: "Nguyễn Minh",
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

/*fake report */
const reportData = {
  users: { teachers: 12, students: 105, active: 95, locked: 10 },
  courses: { total: 18, active: 14, upcoming: 3, closed: 1 },
  payments: { revenue: "18,250,000đ", pending: "2,500,000đ" },
};

// ======================= DỮ LIỆU GIẢ (TẤT CẢ ĐÃ THANH TOÁN + CHUYỂN KHOẢN) =======================
const payments = [
  {
    id: "TX001",
    student: "Nguyễn Văn A",
    course: "IELTS",
    amount: 15000000,
    method: "Chuyển khoản",
    date: "2025-1-10",
    status: "Đã thanh toán",
  },
  {
    id: "TX002",
    student: "Trần Thị B",
    course: "TOEIC",
    amount: 12000000,
    method: "Chuyển khoản",
    date: "2025-2-11",
    status: "Đã thanh toán",
  },
  {
    id: "TX003",
    student: "Lê Minh C",
    course: "IELTS",
    amount: 20000000,
    method: "Chuyển khoản",
    date: "2025-3-12",
    status: "Đã thanh toán",
  },
  {
    id: "TX004",
    student: "Phạm Thị D",
    course: "TOEIC",
    amount: 18000000,
    method: "Chuyển khoản",
    date: "2025-4-15",
    status: "Đã thanh toán",
  },
  {
    id: "TX005",
    student: "Hoàng Văn E",
    course: "IELTS",
    amount: 22000000,
    method: "Chuyển khoản",
    date: "2025-5-18",
    status: "Đã thanh toán",
  },
  {
    id: "TX005",
    student: "Hoàng Văn E",
    course: "IELTS",
    amount: 22000000,
    method: "Chuyển khoản",
    date: "2025-11-18",
    status: "Đã thanh toán",
  },
  {
    id: "TX001",
    student: "Nguyễn Văn A",
    course: "IELTS",
    amount: 15000000,
    method: "Chuyển khoản",
    date: "2025-6-10",
    status: "Đã thanh toán",
  },
  {
    id: "TX002",
    student: "Trần Thị B",
    course: "TOEIC",
    amount: 12000000,
    method: "Chuyển khoản",
    date: "2025-7-11",
    status: "Đã thanh toán",
  },
  {
    id: "TX003",
    student: "Lê Minh C",
    course: "IELTS",
    amount: 20000000,
    method: "Chuyển khoản",
    date: "2025-8-12",
    status: "Đã thanh toán",
  },
  {
    id: "TX004",
    student: "Phạm Thị D",
    course: "TOEIC",
    amount: 18000000,
    method: "Chuyển khoản",
    date: "2025-9-15",
    status: "Đã thanh toán",
  },
  {
    id: "TX005",
    student: "Hoàng Văn E",
    course: "IELTS",
    amount: 22000000,
    method: "Chuyển khoản",
    date: "2025-10-18",
    status: "Đã thanh toán",
  },
  {
    id: "TX005",
    student: "Hoàng Văn E",
    course: "IELTS",
    amount: 22000000,
    method: "Chuyển khoản",
    date: "2025-11-18",
    status: "Đã thanh toán",
  },
  {
    id: "TX001",
    student: "Nguyễn Văn A",
    course: "IELTS",
    amount: 1500000,
    method: "Chuyển khoản",
    date: "2025-1-10",
    status: "Đã thanh toán",
  },
  {
    id: "TX002",
    student: "Trần Thị B",
    course: "TOEIC",
    amount: 1200000,
    method: "Chuyển khoản",
    date: "2025-2-11",
    status: "Đã thanh toán",
  },
  {
    id: "TX003",
    student: "Lê Minh C",
    course: "IELTS",
    amount: 2000000,
    method: "Chuyển khoản",
    date: "2025-3-12",
    status: "Đã thanh toán",
  },
  {
    id: "TX004",
    student: "Phạm Thị D",
    course: "TOEIC",
    amount: 1800000,
    method: "Chuyển khoản",
    date: "2025-4-15",
    status: "Đã thanh toán",
  },
  {
    id: "TX005",
    student: "Hoàng Văn E",
    course: "IELTS",
    amount: 2200000,
    method: "Chuyển khoản",
    date: "2025-5-18",
    status: "Đã thanh toán",
  },
  {
    id: "TX005",
    student: "Hoàng Văn E",
    course: "IELTS",
    amount: 2200000,
    method: "Chuyển khoản",
    date: "2025-11-18",
    status: "Đã thanh toán",
  },
  {
    id: "TX001",
    student: "Nguyễn Văn A",
    course: "IELTS",
    amount: 1500000,
    method: "Chuyển khoản",
    date: "2025-6-10",
    status: "Đã thanh toán",
  },
  {
    id: "TX002",
    student: "Trần Thị B",
    course: "TOEIC",
    amount: 1200000,
    method: "Chuyển khoản",
    date: "2025-7-11",
    status: "Đã thanh toán",
  },
  {
    id: "TX003",
    student: "Lê Minh C",
    course: "COMBO-2",
    amount: 2000000,
    method: "Chuyển khoản",
    date: "2025-8-12",
    status: "Đã thanh toán",
  },
  {
    id: "TX004",
    student: "Phạm Thị D",
    course: "COMBO-4",
    amount: 1800000,
    method: "Chuyển khoản",
    date: "2025-9-15",
    status: "Đã thanh toán",
  },
  {
    id: "TX005",
    student: "Hoàng Văn E",
    course: "BEGINNER",
    amount: 2200000,
    method: "Chuyển khoản",
    date: "2025-10-18",
    status: "Đã thanh toán",
  },
  {
    id: "TX005",
    student: "Hoàng Văn E",
    course: "Combo",
    amount: 2200000,
    method: "Chuyển khoản",
    date: "2025-11-18",
    status: "Đã thanh toán",
  },
];
