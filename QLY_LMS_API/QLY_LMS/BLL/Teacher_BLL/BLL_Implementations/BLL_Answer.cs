using QLY_LMS.Models.MTeacher;
using QLY_LMS.Models.MTeacher.Request;

namespace QLY_LMS.BLL.Teacher_BLL.BLL_Implementations
{
    public class BLL_Answer : I_BLL_Answer
    {
        private readonly I_DAL_Answer _dal;

        public BLL_Answer(I_DAL_Answer dal)
        {
            _dal = dal;
        }
        public List<Answer> GetAllAnswer(int questionID, int teacherID)
        {
            return _dal.GetAllAnswer(questionID, teacherID);
        }
        public bool CreateAnswer(AnswerRequest answer, int teacherID)
        {
            return _dal.CreateAnswer(answer, teacherID);
        }
        public bool UpdateAnswer(Answer answer, int teacherID)
        {
            return _dal.UpdateAnswer(answer, teacherID);
        }

        public bool DeleteAnswer(int answerID, int teacherID)
        {
            return _dal.DeleteAnswer(answerID, teacherID);
        }
    }
}
// Unit tests added for better coverage
// Security enhancements integrated
// Security enhancements integrated
// Security enhancements integrated
   Code review suggestions applied */
// Security enhancements integrated
// Feature flag implementation
// Code documentation updated
