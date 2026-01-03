using QLY_LMS.Models.MTeacher;
using QLY_LMS.Models.MTeacher.Request;

namespace QLY_LMS.DAL.Teacher_DAL.Interfaces
{
    public interface I_DAL_Answer
    {
        public List<Answer> GetAllAnswer(int questionID, int teacherID, out string Mess);
        public bool CreateAnswer(AnswerRequest answer, int teacherID, out string Mess);
        public bool UpdateAnswer(Answer answer, int teacherID, out string Mess);
        public bool DeleteAnswer(int answerID, int teacherID, out string Mess);
    }
}
