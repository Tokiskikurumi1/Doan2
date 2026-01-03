using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QLY_LMS.BLL.Teacher_BLL.BLL_Interfaces;
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
            {
                return NotFound("Không tìm thấy câu hỏi trong bài tập này!");
            }
            return Ok(result);
        }

        [HttpPost("create-new-question")]
        public IActionResult Create([FromBody] QuestionRequest req)
        {
            var result = _manageQuestion.CreateQuestion(req, GetTeacherID(), out string Mess);
            if (!result)
            {
                return BadRequest(Mess);
            }
            return Ok("Tạo câu hỏi thành công!");
        }

        [HttpPut("update-question")]
        public IActionResult Update([FromBody] Question req)
        {
            var result = _manageQuestion.UpdateQuestion(req, GetTeacherID(), out string Mess);
            if (!result)
            {
                return BadRequest(Mess);
            }
            return Ok("Cập nhật câu hỏi thành công!");
        }

        [HttpDelete("delete-question/{questionID}")]
        public IActionResult Delete(int questionID)
        {
            var result = _manageQuestion.DeleteQuestion(questionID, GetTeacherID(), out string Mess);
            if (!result)
            {
                return BadRequest(Mess);
            }
            return Ok("Xóa câu hỏi thành công!");
        }
    }
}
