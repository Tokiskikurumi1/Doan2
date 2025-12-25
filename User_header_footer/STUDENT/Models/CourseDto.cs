namespace STUDENT.DTOs
{
    public class CourseDto
    {
        public int CourseID { get; set; }
        public string CourseName { get; set; } = string.Empty;
        public string CourseType { get; set; } = string.Empty;
        public string CourseDes { get; set; } = string.Empty;
        public DateTime CourseDate { get; set; }
        public decimal CoursePrice { get; set; }
        public string CourseStatus { get; set; } = string.Empty;
        public string CourseImage { get; set; } = string.Empty;

        public int TeacherID { get; set; }
        public string TeacherName { get; set; } = string.Empty;
        public string TeacherEmail { get; set; } = string.Empty;

        // Additional fields for enrolled courses
        public DateTime? EnrollDate { get; set; }
        public decimal? ProgressPercent { get; set; }
        public string? IsComplete { get; set; }
        public DateTime? CompletedDate { get; set; }
    }
}
