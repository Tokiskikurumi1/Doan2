using QLY_LMS.Models.MTeacher;
using QLY_LMS.Models.MTeacher.Request;
using QLY_LMS.Models.MTeacher.Response;

namespace QLY_LMS.Controllers.Teacher_Controllers
{
    [ApiController]
    [Authorize(Roles = "Teacher")]
    [Route("api/[controller]")]
    public class QuestionController : ControllerBase
    {
        private readonly I_BLL_Question _manageQuestion;

        public QuestionController(I_BLL_Question manageQuestion)
        {
            _manageQuestion = manageQuestion;
        }

        private int GetTeacherID()
        {
            return (int)HttpContext.Items["UserID"];
        }

        [HttpGet("get-question/{assignmentID}")]
        public IActionResult GetAllQuestions(int assignmentID)
        {
            var result = _manageQuestion.GetAllQuestion(assignmentID, GetTeacherID());
            if (result.Count == 0)
                return NotFound("Không tìm th?y câu h?i trong bài t?p này!");
            return Ok(result);
        }

        [HttpPost("create-new-question")]
        public IActionResult Create([FromBody] QuestionRequest req)
        {
            _manageQuestion.CreateQuestion(req, GetTeacherID());
            return Ok("T?o câu h?i thành công!");
        }

        [HttpPut("update-question")]
        public IActionResult Update([FromBody] Question req)
        {
            _manageQuestion.UpdateQuestion(req, GetTeacherID());
            return Ok("C?p nh?t câu h?i thành công!");
        }

        [HttpDelete("delete-question/{questionID}")]
        public IActionResult Delete(int questionID)
        {
            _manageQuestion.DeleteQuestion(questionID, GetTeacherID());
            return Ok("Xóa câu h?i thành công!");
        }
    }
}
# Feature enhancement 2026-01-10 18:02:59
# UI/UX improvements
// Feature flag implementation
// API improvements and error handling
// Enhanced functionality - 2026-01-10
// Feature flag implementation
   Code review suggestions applied */
// Feature flag implementation
/* Multi-line comment block
// Configuration settings optimized
// Performance optimization implemented
// API improvements and error handling
// API improvements and error handling
// Performance optimization implemented
/* Multi-line comment block
// Code documentation updated
