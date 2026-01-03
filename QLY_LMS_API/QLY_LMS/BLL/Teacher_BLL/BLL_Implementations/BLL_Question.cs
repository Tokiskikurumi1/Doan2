using QLY_LMS.BLL.Teacher_BLL.BLL_Interfaces;
using QLY_LMS.DAL.Teacher_DAL.Interfaces;
using QLY_LMS.Models.MTeacher;
using QLY_LMS.Models.MTeacher.Request;

namespace QLY_LMS.BLL.Teacher_BLL.BLL_Implementations
{
    public class BLL_Question : I_BLL_Question
    {
        private readonly I_DAL_Question _Question;
        public BLL_Question(I_DAL_Question question)
        {
            _Question = question;
        }

        public List<Question> GetAllQuestion(int assignmentID, int teacherID)
        {
            return _Question.GetAllQuestion(assignmentID, teacherID);
        }

        public bool CreateQuestion(QuestionRequest question, int teacherID, out string Mess)
        {
            return _Question.CreateQuestion(question, teacherID, out Mess);
        }

        public bool UpdateQuestion(Question question, int teacherID, out string Mess)
        {
            return _Question.UpdateQuestion(question, teacherID, out Mess);
        }

        public bool DeleteQuestion(int questionID, int teacherID, out string Mess)
        {
            return _Question.DeleteQuestion(questionID, teacherID, out Mess);
        }
    }
}
