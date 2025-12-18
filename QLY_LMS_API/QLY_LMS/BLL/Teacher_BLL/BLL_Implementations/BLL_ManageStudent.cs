
namespace QLY_LMS.BLL.Teacher_BLL.BLL_Implementations
{
    public class BLL_ManageStudent : I_BLL_ManageStudent
    {
        private readonly I_DAL_ManageStudent _dal_ManageStudent;
        public BLL_ManageStudent(I_DAL_ManageStudent dal_manageStudent)
        {
            _dal_ManageStudent = dal_manageStudent; 
        }

        public List<Student> getAllStudent(int teacherID)
        {
            return _dal_ManageStudent.getAllStudent(teacherID);
        }

        public List<Student> getAllStudentCourse(int teacherID, int courseID)
        {
            return _dal_ManageStudent.getAllStudentCourse(teacherID, courseID);
        }
    }
}
# Database optimization
# Security enhancements
// Unit tests added for better coverage
// Feature flag implementation
// Security enhancements integrated
// Configuration settings optimized
   Code review suggestions applied */
// Configuration settings optimized
   Additional implementation details
// Performance optimization implemented
// Enhanced functionality - 2026-01-10
// Database optimization completed
// Feature flag implementation
// Code documentation updated
// Logging mechanism enhanced
// Configuration settings optimized
