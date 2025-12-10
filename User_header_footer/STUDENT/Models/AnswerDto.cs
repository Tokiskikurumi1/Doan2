namespace STUDENT.DTOs
{
    public class AnswerDto
    {
        public int AnswerID { get; set; }
        public int QuestionID { get; set; }
        public string AnswerText { get; set; } = string.Empty;
        public bool IsCorrect { get; set; }
        public int AnswerIndex { get; set; }
    }
}
# Update 2026-01-10 17:57:45
