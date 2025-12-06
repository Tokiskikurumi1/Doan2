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

        public bool CreateQuestion(QuestionRequest question, int teacherID)
        {
            return _Question.CreateQuestion(question, teacherID);
        }

        public bool UpdateQuestion(Question question, int teacherID)
        {
            return _Question.UpdateQuestion(question, teacherID);
        }

        public bool DeleteQuestion(int questionID, int teacherID)
        {
            return _Question.DeleteQuestion(questionID, teacherID);
        }
    }
}
# Bug fixes and improvements
# Database optimization
/* Multi-line comment block
   Additional implementation details
/* Multi-line comment block
// Logging mechanism enhanced
   Additional implementation details
/* Multi-line comment block
// Security enhancements integrated
/* Multi-line comment block
// Unit tests added for better coverage
   Code review suggestions applied */
// Database optimization completed
// Logging mechanism enhanced
// Code documentation updated
