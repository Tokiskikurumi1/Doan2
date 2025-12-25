namespace STUDENT.DTOs
{
    public class SaveScoreDto
    {
        public int StudentID { get; set; }
        public int CourseID { get; set; }
        public int AssignmentID { get; set; }
        public string Subject { get; set; } = string.Empty;
        public int Correct { get; set; }
        public int Total { get; set; }
        public decimal Score { get; set; }
    }
}