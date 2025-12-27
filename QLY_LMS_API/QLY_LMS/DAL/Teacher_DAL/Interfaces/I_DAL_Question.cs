using QLY_LMS.Models.MTeacher;
using QLY_LMS.Models.MTeacher.Request;

namespace QLY_LMS.DAL.Teacher_DAL.Interfaces
{
    public interface I_DAL_Question
    {
        List<Question> GetAllQuestion(int assignmentID, int teacherID);
        bool CreateQuestion(QuestionRequest question, int teacherID);
        bool UpdateQuestion(Question question, int teacherID);
        bool DeleteQuestion(int questionID, int teacherID);
    }
}
# API improvements
# Feature enhancement 2026-01-10 18:03:07
# UI/UX improvements
