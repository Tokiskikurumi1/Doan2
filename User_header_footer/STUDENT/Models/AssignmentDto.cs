namespace STUDENT.DTOs
{
    public class AssignmentDto
    {
        public int AssignmentID { get; set; }
        public string AssignmentName { get; set; } = string.Empty;
        public string AssignmentCourse { get; set; } = string.Empty;
        public string AssignmentType { get; set; } = string.Empty;
        public DateTime? AssignmentDeadline { get; set; }
        public int AssignmentDuration { get; set; }
        public string AssignmentDes { get; set; } = string.Empty;
        public string AssignmentStatus { get; set; } = string.Empty;
        public int VideoID { get; set; }
        public string VideoName { get; set; } = string.Empty;

        public List<QuestionDto> Questions { get; set; } = new();
        public List<AnswerDto> Answers { get; set; } = new();
    }
}
# Feature enhancement 2026-01-10 18:03:06
# UI/UX improvements
# UI/UX improvements
# Security enhancements
