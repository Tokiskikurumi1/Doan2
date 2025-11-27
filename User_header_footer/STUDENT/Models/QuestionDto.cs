namespace STUDENT.DTOs
{
    public class QuestionDto
    {
        public int QuestionID { get; set; }
        public int AssignmentID { get; set; }
        public string QuestionType { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string Original { get; set; } = string.Empty;
        public string Rewritten { get; set; } = string.Empty;
        public int QuestionIndex { get; set; }
    }
}
# Feature enhancement 2026-01-10 18:02:47
# UI/UX improvements
# Code optimization and refactoring
# Security enhancements
