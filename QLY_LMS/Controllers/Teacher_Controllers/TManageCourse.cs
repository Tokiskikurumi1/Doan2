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

        // ==================== GET ALL COURSE ====================
        [HttpGet("get-all-course")]
        public IActionResult GetAll()
        {
            int teacherId = int.Parse(User.FindFirst("userID").Value);

            var courses = _ImanageCourse.getAllCoures(teacherId);

            if (courses == null || !courses.Any())
                return BadRequest("Không tồn tại khóa học của giảng viên!");

            return Ok(courses);
        }

        // ==================== CREATE COURSE ====================
        [HttpPost("create-new-course")]
        public IActionResult Create([FromBody] CourseRequest model)
        {
            int teacherId = int.Parse(User.FindFirst("userID").Value);

            model.teacherID = teacherId;  // Force teacherID từ token

            var result = _ImanageCourse.createCourse(model);

            return Ok("Thêm khóa học thành công!");
        }

        // ==================== UPDATE COURSE ====================
        [HttpPut("update-course/{courseID}")]
        public IActionResult Update(int courseID, [FromBody] Course model)
        {
            int teacherId = int.Parse(User.FindFirst("userID").Value);

            // Kiểm tra quyền sở hữu khóa học
            bool allowed = _ImanageCourse.CheckCourseOfTeacher(courseID, teacherId);
            if (!allowed)
                return BadRequest("Bạn không có quyền sửa khóa học này!");

            model.teacherID = teacherId;

            var result = _ImanageCourse.updateCourse(courseID, model);
            return Ok("Cập nhật thành công!");
        }

        // ==================== DELETE COURSE ====================
        [HttpDelete("delete-course/{courseID}")]
        public IActionResult Delete(int courseID)
        {
            int teacherId = int.Parse(User.FindFirst("userID").Value);

            bool allowed = _ImanageCourse.CheckCourseOfTeacher(courseID, teacherId);
            if (!allowed)
                return BadRequest("Bạn không có quyền xóa khóa học này!");

            bool result = _ImanageCourse.deleteCourse(courseID, teacherId);

            return result
                ? Ok("Xóa thành công")
                : BadRequest("Xóa thất bại");
        }
    }
}
