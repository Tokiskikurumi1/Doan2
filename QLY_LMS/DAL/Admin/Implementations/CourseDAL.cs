using QLY_LMS.Models.MTeacher;

namespace QLY_LMS.DAL.Admin.Implementations
{
    public class CourseDAL
    {
        public interface ICourseRepository
        {
            List<Course> GetAllCourses();
        }
    }
}
