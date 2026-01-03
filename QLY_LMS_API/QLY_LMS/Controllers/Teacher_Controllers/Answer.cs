using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QLY_LMS.BLL.Teacher_BLL.BLL_Interfaces;
using QLY_LMS.Models.MTeacher;
using QLY_LMS.Models.MTeacher.Request;

namespace QLY_LMS.Controllers.Teacher_Controllers
{
    [ApiController]
    [Authorize(Roles = "Teacher")]
    [Route("api/[controller]")]
    public class AnswerController : ControllerBase
    {
        private readonly I_BLL_Answer _manageAnswer;

        public AnswerController(I_BLL_Answer manageAnswer)
        {
            _manageAnswer = manageAnswer;
        }

        private int GetTeacherID()
        {
            return (int)HttpContext.Items["UserID"];
        }

        [HttpGet("get-all-answer/{questionID}")]
        public IActionResult GetAllAnswers(int questionID)
        {
            var result = _manageAnswer.GetAllAnswer(questionID, GetTeacherID(), out string Mess);
            if (!string.IsNullOrEmpty(Mess))
            {
                return BadRequest(Mess);
            }
            if (result.Count == 0)
            {
                return NotFound("Không tìm thấy đáp án cho câu hỏi này!");
            }
            return Ok(result);
        }

        [HttpPost("create-answer")]
        public IActionResult Create([FromBody] AnswerRequest req)
        {
            var resutl = _manageAnswer.CreateAnswer(req, GetTeacherID(), out string Mess);
            if (!resutl)
            {
                return BadRequest(Mess);
            }
            return Ok("Tạo đáp án thành công!");
        }

        [HttpPut("update-answer")]
        public IActionResult Update([FromBody] Answer req)
        {
            var result = _manageAnswer.UpdateAnswer(req, GetTeacherID(), out string Mess);
            if (!result)
            {
                return BadRequest(Mess);
            }
            return Ok("Cập nhật đáp án thành công!");
        }

        [HttpDelete("delete-answer/{answerID}")]
        public IActionResult Delete(int answerID)
        {
            var result = _manageAnswer.DeleteAnswer(answerID, GetTeacherID(), out string Mess);
            if (!result)
            {
                return BadRequest(Mess);
            }
            return Ok("Xóa đáp án thành công!");
        }
    }
}
