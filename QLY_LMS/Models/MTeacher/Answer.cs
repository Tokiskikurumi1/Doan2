namespace QLY_LMS.Models.MTeacher
{
    public class Answer
    {
        public int AnswerID { get; set; }
        public int QuestionID { get; set; }
        public string AnswerText { get; set; }
        public bool IsCorrect { get; set; }
        public int AnswerIndex { get; set; }
    }
}
