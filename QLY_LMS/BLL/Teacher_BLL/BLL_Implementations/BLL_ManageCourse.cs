using Microsoft.AspNetCore.Http.HttpResults;
using QLY_LMS.BLL.Teacher_BLL.BLL_Interfaces;
using QLY_LMS.DAL.Teacher_DAL.Implementations;
using QLY_LMS.DAL.Teacher_DAL.Interfaces;
using QLY_LMS.DTO;
using QLY_LMS.Models.MTeacher;
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

        public bool createCourse(Course courses)
        {
            //Mess = string.Empty;
            //if (string.IsNullOrEmpty(courses.courseName) || string.IsNullOrEmpty(courses.courseType) || 
            //    string.IsNullOrEmpty(courses.courseDes) || string.IsNullOrEmpty(courses.courseStatus))
            //{
            //    Mess = "Không được để trống dữ liệu!";
            //    return false;
            //}
            //if (courses.coursePrice < 0)
            //{
            //    Mess = "Giá không được nhỏ hơn 0!";
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

        public bool CheckCourseOfTeacher(int courseID, int teacherID)
        {
            return _manageCourse.CheckCourseOfTeacher(courseID, teacherID);
        }
    }
}
