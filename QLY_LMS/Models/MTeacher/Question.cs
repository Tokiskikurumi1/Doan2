namespace QLY_LMS.Models.MTeacher
{
    public class Question
    {
        public int QuestionID { get; set; }
        public int AssignmentID { get; set; }
        public string QuestionType { get; set; }
        public string Content { get; set; }
        public string Original { get; set; }
        public string Rewritten { get; set; }
        public int QuestionIndex { get; set; }
    }
}
