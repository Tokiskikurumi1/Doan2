using QLY_LMS.Models.MTeacher;
using QLY_LMS.Models.MTeacher.Request;

namespace QLY_LMS.BLL.Teacher_BLL.BLL_Interfaces
{
    public interface I_BLL_Question
    {
        List<Question> GetAllQuestion(int assignmentID, int teacherID);
        bool CreateQuestion(QuestionRequest question, int teacherID, out string Mess);
        bool UpdateQuestion(Question question, int teacherID, out string Mess);
        bool DeleteQuestion(int questionID, int teacherID, out string Mess);
    }
}
