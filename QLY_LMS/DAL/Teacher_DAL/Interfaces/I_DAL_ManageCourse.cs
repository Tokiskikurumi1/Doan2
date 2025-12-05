using QLY_LMS.Models.MTeacher;

namespace QLY_LMS.DAL.Teacher_DAL.Interfaces
{
    public interface I_DAL_ManageCourse
    {
        List<Course> getAllCoures(int Tid);
        bool createCourse(Course coures);   
        bool updateCourse(int courseID,Course course);
        bool deleteCourse(int courseID, int teacherID);
        bool CheckCourseOfTeacher(int courseID, int teacherID);

    }
}
