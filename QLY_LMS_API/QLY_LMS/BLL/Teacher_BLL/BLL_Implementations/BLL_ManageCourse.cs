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

        public bool createCourse(CourseRequest courses, out string Mess)
        {
            Mess = string.Empty;
            if(courses.coursePrice <= 0)
            {
                Mess = "Giá tiền khóa học không được nhỏ hơn 0!";
                return false;
            }
            if (courses.courseStatus != "incomplete" && courses.courseStatus != "completed")
            {
                Mess = "Trạng thái khóa học chỉ được là completed hoặc incomplete!";
                return false;
            }
            return _manageCourse.createCourse(courses, out Mess);
        }

        public List<Course> getAllCoures(int TId)
        {
            return _manageCourse.getAllCoures(TId);
        }

        public bool updateCourse(int courseID, Course course, out string Mess)
        {
            if (course.coursePrice <= 0)
            {
                Mess = "Giá tiền khóa học không được nhỏ hơn 0!";
                return false;
            }
            if (course.courseStatus != "incomplete" && course.courseStatus != "completed")
            {
                Mess = "Trạng thái khóa học chỉ được là completed hoặc incomplete!";
                return false;
            }
            return _manageCourse.updateCourse(courseID, course, out Mess);
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
