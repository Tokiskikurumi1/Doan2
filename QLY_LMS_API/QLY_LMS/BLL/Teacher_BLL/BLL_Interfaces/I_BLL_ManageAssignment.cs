using QLY_LMS.Models.MTeacher.Request;
using QLY_LMS.Models.MTeacher.Response;

namespace QLY_LMS.BLL.Teacher_BLL.BLL_Interfaces
{
    public interface I_BLL_ManageAssignment
    {
        List<Assignment> GetAssignments(int videoID, int teacherID, out string Mess);
        List<Assignment> getAllAssignment(int teacherID);
        List<Assignment> getAssignmentById(int assignmentID, int teacherID, out string Mess);
        bool CreateAssignment(AssignmentRequest req, int teacherID, out string Mess);
        bool UpdateAssignment(Assignment req, int teacherID, out string Mess);
        bool DeleteAssignment(int assignmentID, int teacherID, out string Mess);
    }
}
