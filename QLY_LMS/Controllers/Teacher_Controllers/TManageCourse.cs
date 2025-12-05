using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using QLY_LMS.BLL.Teacher_BLL.BLL_Interfaces;
using QLY_LMS.DAL.Admin.Implementations;
using QLY_LMS.Modal;
using QLY_LMS.Models.MTeacher;

namespace QLY_LMS.Controllers.Teacher_Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize(Roles = "2")]
    public class Teacher : ControllerBase
    {
        private readonly I_BLL_ManageCourse _ImanageCoure;
        
        public Teacher (I_BLL_ManageCourse course)
        {
            _ImanageCoure = course;
        }

        [Authorize(Roles = "Teacher")]
        [Route("get-all-course")]
        [HttpGet]
        public IActionResult GetAll()
        {
            var teacherId = int.Parse(User.FindFirst("userID").Value);

            var courses = _ImanageCoure.getAllCoures(teacherId);

            if (courses == null || !courses.Any())
                return BadRequest("Không tồn tại khóa học của giảng viên!");

            return Ok(courses);
        }



        //[Route("get-by-id/{id}")]
        //[HttpGet]
        //public User_table GetByID(int id)
        //{
        //    var user = _ImanageCoure.GetUserById(id);
        //    return _User.GetUserById(id);

        //}

        [Authorize(Roles = "Teacher")]
        [HttpPost("create-new-course")]
        public IActionResult Create([FromBody] Course model)
        {
            var teacherId = int.Parse(User.FindFirst("userID").Value);

            model.teacherID = teacherId;

            var course = _ImanageCoure.createCourse(model);

            return Ok("Thêm khóa học thành công!");
        }


        [Authorize(Roles = "Teacher")]
        [HttpPut("update-course/{courseID}")]
        public IActionResult Update(int courseID, [FromBody] Course model)
        {
            var teacherId = int.Parse(User.FindFirst("userID").Value);

            // Gán teacherID từ token
            model.teacherID = teacherId;

            // Kiểm tra quyền sở hữu
            bool allowed = _ImanageCoure.CheckCourseOfTeacher(courseID, teacherId);
            if (!allowed)
                return BadRequest("Bạn không có quyền sửa khóa học này!");

            var result = _ImanageCoure.updateCourse(courseID, model);
            return Ok("Cập nhật thành công!");
        }



        [Route("delete-course")]
        [HttpPost]
        public IActionResult Delete(int courseID, int teacherID)
        {
            //var user = _ImanageCoure.(courseID, teacherID);
            //if (user == null)
            //    return NotFound("Không tìm thấy user");

            bool result = _ImanageCoure.deleteCourse(courseID, teacherID);
            return result
                ? Ok("Xóa thành công")
                : BadRequest("Xóa thất bại");
        }
    }
}
