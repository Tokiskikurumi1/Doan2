namespace STUDENT.DTOs
{
    public class ScoreDto
    {
        public int ScoreID { get; set; }
        public int CourseID { get; set; }
        public string CourseName { get; set; } = string.Empty;
        public int AssignmentID { get; set; }
        public string AssignmentName { get; set; } = string.Empty;
        public string Subject { get; set; } = string.Empty;
        public int Correct { get; set; }
        public int Total { get; set; }
        public decimal Score { get; set; }
        public DateTime Date { get; set; }
    }
}
