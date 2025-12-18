using System.Reflection;

namespace QLY_LMS.BLL.Teacher_BLL.BLL_Implementations
{
    public class BLL_ManageCourse : I_BLL_ManageCourse
    {
        private readonly I_DAL_ManageCourse _manageCourse;
        public BLL_ManageCourse(I_DAL_ManageCourse manageCourse)
        {
            _manageCourse = manageCourse;
        }

        public bool createCourse(CourseRequest courses)
        {
            //Mess = string.Empty;
            //if (string.IsNullOrEmpty(courses.courseName) || string.IsNullOrEmpty(courses.courseType) || 
            //    string.IsNullOrEmpty(courses.courseDes) || string.IsNullOrEmpty(courses.courseStatus))
            //{
            //    Mess = "Không du?c d? tr?ng d? li?u!";
            //    return false;
            //}
            //if (courses.coursePrice < 0)
            //{
            //    Mess = "Giá không du?c nh? hon 0!";
            //    return false;
            //}
            return _manageCourse.createCourse(courses);
        }

        public List<Course> getAllCoures(int TId)
        {
            return _manageCourse.getAllCoures(TId);
        }

        public bool updateCourse(int courseID, Course course)
        {
            return _manageCourse.updateCourse(courseID, course);
        }

        public bool deleteCourse(int courseID, int teacherID) 
        { 
            return _manageCourse.deleteCourse(courseID, teacherID);
        }

        public List<Course> getCourseByName(int teacherID, string nameCourse)
        {
            return _manageCourse.getCourseByName(teacherID, nameCourse);
        }
        public List<Course> getCousreByID(int teacherID, int courseID)
        {
            return _manageCourse.getCourseByID(teacherID, courseID);
        }
        public bool CheckCourseOfTeacher(int teacherID, int courseID)
        {
            return _manageCourse.CheckCourseOfTeacher(teacherID, courseID);
        }

        
    }
}
/* Multi-line comment block
   Additional implementation details
// Logging mechanism enhanced
// Bug fixes and code refactoring
// Security enhancements integrated
// Bug fixes and code refactoring
// Configuration settings optimized
// Unit tests added for better coverage
// Security enhancements integrated
// Bug fixes and code refactoring
// Security enhancements integrated
// Security enhancements integrated
/* Multi-line comment block
// Configuration settings optimized
// Code documentation updated
// Unit tests added for better coverage
// Security enhancements integrated
// Code documentation updated
// Security enhancements integrated
/* Multi-line comment block
// Code documentation updated
// Performance optimization implemented
// Bug fixes and code refactoring
// Code documentation updated
// Logging mechanism enhanced
