using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QLY_LMS.BLL.Teacher_BLL.BLL_Interfaces;
using QLY_LMS.Models.MTeacher;

namespace QLY_LMS.Controllers.Teacher_Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Teacher")]
    public class Teacher : ControllerBase
    {
        private readonly I_BLL_ManageCourse _ImanageCourse;

        public Teacher(I_BLL_ManageCourse course)
        {
            _ImanageCourse = course;
        }

        private int getTeacherID()
        {
            return (int)HttpContext.Items["UserID"];
        }
        // ==================== GET ALL COURSE ====================
        [HttpGet("get-all-course")]
        public IActionResult GetAll()
        {
            int teacherId = getTeacherID();

            var courses = _ImanageCourse.getAllCoures(teacherId);

            if (courses == null || !courses.Any())
                return BadRequest("Không tồn tại khóa học của giảng viên!");

            return Ok(courses);
        }

        // ==================== CREATE COURSE ====================
        [HttpPost("create-new-course")]
        public IActionResult Create([FromBody] CourseRequest model)
        {
            int teacherId = getTeacherID();

            model.teacherID = teacherId;  

            var result = _ImanageCourse.createCourse(model);

            return Ok("Thêm khóa học thành công!");
        }

        // ==================== UPDATE COURSE ====================
        [HttpPut("update-course/{courseID}")]
        public IActionResult Update(int courseID, [FromBody] Course model)
        {
            int teacherId = getTeacherID();

            model.teacherID = teacherId;

            var result = _ImanageCourse.updateCourse(courseID, model);
            return Ok("Cập nhật thành công!");
        }

        // ==================== DELETE COURSE ====================
        [HttpDelete("delete-course/{courseID}")]
        public IActionResult Delete(int courseID)
        {
            int teacherId = getTeacherID();

            //bool allowed = _ImanageCourse.CheckCourseOfTeacher(courseID, teacherId);
            //if (!allowed)
            //    return BadRequest("Bạn không có quyền xóa khóa học này!");

            bool result = _ImanageCourse.deleteCourse(courseID, teacherId);

            return result
                ? Ok("Xóa thành công")
                : BadRequest("Xóa thất bại");
        }
    }
}
