using QLY_LMS.Models.MTeacher;
using QLY_LMS.Models.MTeacher.Request;

namespace QLY_LMS.BLL.Teacher_BLL.BLL_Interfaces
{
    public interface I_BLL_Answer
    {
        List<Answer> GetAllAnswer(int questionID, int teacherID, out string Mess);
        bool CreateAnswer(AnswerRequest answer, int teacherID, out string Mess);
        bool UpdateAnswer(Answer answer, int teacherID, out string Mess);
        bool DeleteAnswer(int answerID, int teacherID, out string Mess);

    }
}
