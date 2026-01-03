using System.ComponentModel.DataAnnotations;

namespace QLY_LMS.Models.MTeacher
{
    public class Answer
    {
        public int answerID { get; set; }
        public int questionID { get; set; }
        [Required(ErrorMessage = "Câu trả lời không được để trống")]
        public string answerText { get; set; }
        [Required(ErrorMessage = "Đúng/sai không được để trống")]
        public bool isCorrect { get; set; }
        [Required(ErrorMessage = "Vị trí câu trả lời không được để trống")]
        public int answerIndex { get; set; }
    }
}
