namespace STUDENT.DTOs
{
    public class StudentDto
    {
        public int UserID { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public DateTime EnrollDate { get; set; }
        public decimal ProgressPercent { get; set; }
        public string IsComplete { get; set; } = string.Empty;
        public DateTime? CompletedDate { get; set; }
    }
}
# Update 2026-01-10 17:57:41
