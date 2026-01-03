using QLY_LMS.BLL.Teacher_BLL.BLL_Interfaces;
using QLY_LMS.DAL.Teacher_DAL.Interfaces;
using QLY_LMS.Models.MTeacher.Request;
using QLY_LMS.Models.MTeacher.Response;

namespace QLY_LMS.BLL.Teacher_BLL.BLL_Implementations
{
    public class BLL_ManageAssignment: I_BLL_ManageAssignment
    {
        private readonly I_DAL_Assignment _dal;

        public BLL_ManageAssignment(I_DAL_Assignment dal)
        {
            _dal = dal;
        }

        public List<Assignment> GetAssignments(int videoID, int teacherID, out string Mess)
        {
            return _dal.GetAssignments(videoID, teacherID, out Mess);
        }

        public List<Assignment> getAllAssignment(int teacherID)
        {
            return _dal.getAllAssignment(teacherID);
        }

        public List<Assignment> getAssignmentById(int assignmentID, int teacherID, out string Mess)
        {
            return _dal.getAssignmentById(assignmentID, teacherID, out Mess);
        }

        public bool CreateAssignment(AssignmentRequest req, int teacherID, out string Mess)
        {
            if(req.assignmentType != "Quizz" && req.assignmentType != "Reading" && req.assignmentType != "Rewrite")
            {
                Mess = "Dạng bài tập chỉ được là Quizz, Reading, Rewrite!";
                return false;
            }
            if(req.assignmentStatus != "incomplete" && req.assignmentStatus != "completed")
            {
                Mess = "Trạng thái bài tập chỉ được là incomplete hoặc complete!";
                return false;
            }
            return _dal.CreateAssignment(req, teacherID, out Mess);
        }

        public bool UpdateAssignment(Assignment req, int teacherID, out string Mess)
        {
            if (req.assignmentType != "Quizz" && req.assignmentType != "Reading" && req.assignmentType != "Rewrite")
            {
                Mess = "Dạng bài tập chỉ được là Quizz, Reading, Rewrite!";
                return false;
            }
            if (req.assignmentStatus != "incomplete" && req.assignmentStatus != "completed")
            {
                Mess = "Trạng thái bài tập chỉ được là incomplete hoặc complete!";
                return false;
            }
            return _dal.UpdateAssignment(req, teacherID, out Mess);
        }
        public bool DeleteAssignment(int assignmentID, int teacherID, out string Mess)
        {
            return _dal.DeleteAssignment(assignmentID, teacherID, out Mess);
        }
    }
}
