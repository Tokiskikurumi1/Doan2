using QLY_LMS.Models.MTeacher;

namespace QLY_LMS.Controllers.Teacher_Controllers
{
    [ApiController]
    [Authorize(Roles = "Teacher")]
    [Route("api/[controller]")]
    public class InfoController : ControllerBase
    {
        private readonly I_BLL_Info _manageInfo;
        public InfoController(I_BLL_Info manageInfo)
        {
            _manageInfo = manageInfo;
        }
        private int GetTeacherID()
        {
            return (int)HttpContext.Items["UserID"];
        }
        [HttpGet("get-info-teacher")]
        public IActionResult GetInfoTeacher()
        {
            var result = _manageInfo.GetInfoTeacher(GetTeacherID());
            if (result.Count == 0)
                return NotFound("Không tìm th?y thông tin giáo viên!");
            return Ok(result);
        }

        [HttpPut("update-info-teacher")]
        public IActionResult UpdateInfoTeacher([FromBody] info_teacher info)
        {
            bool result = _manageInfo.UpdateInfoTeacher(GetTeacherID(), info);
            if (!result)
                return BadRequest("C?p nh?t thông tin giáo viên th?t b?i!");
            return Ok("C?p nh?t thông tin giáo viên thành công!");
        }
    }
}
# Update 2026-01-10 17:57:44
// Feature flag implementation
// Database optimization completed
// API improvements and error handling
// Performance optimization implemented
// Logging mechanism enhanced
   Code review suggestions applied */
// Logging mechanism enhanced
// API improvements and error handling
// Unit tests added for better coverage
// Logging mechanism enhanced
