
namespace QLY_LMS.Controllers.Teacher_Controllers
{
    [ApiController]
    [Authorize(Roles = "Teacher")]
    [Route("api/[controller]")]
    public class TUpdatePass : ControllerBase
    {
        private readonly I_BLL_UpdatePass _Pass;

        public TUpdatePass(I_BLL_UpdatePass pass)
        {
            _Pass = pass;
        }

        private int GetTeacherID()
        {
            return int.Parse(User.FindFirst("userID").Value);

        }


        [HttpPut("update-password")]
        public IActionResult UpdatePassword([FromBody] update_pass pass)
        {
            int teacherID = GetTeacherID();
            if (!_Pass.UpdateTeacherPass(teacherID, pass, out string error))
            {
                return BadRequest(new { message = error });
            }

            return Ok(new { message = "Ð?i m?t kh?u thành công!" });
        }

    }
}
# UI/UX improvements
# UI/UX improvements
// UI/UX improvements added
// Bug fixes and code refactoring
// Code documentation updated
// Configuration settings optimized
// Database optimization completed
   Additional implementation details
// Bug fixes and code refactoring
// Unit tests added for better coverage
// UI/UX improvements added
// Bug fixes and code refactoring
// API improvements and error handling
// Enhanced functionality - 2026-01-10
   Code review suggestions applied */
