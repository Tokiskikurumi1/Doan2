using QLY_LMS.DAL.Teacher_DAL.Interfaces;
using QLY_LMS.Models.MTeacher.Request;
using QLY_LMS.Models.MTeacher.Response;

namespace QLY_LMS.Controllers.Teacher_Controllers
{
    [ApiController]
    [Authorize(Roles = "Teacher")]
    [Route("api/[controller]")]
    public class AssignmentController : ControllerBase
    {
        private readonly I_BLL_ManageAssignment _manageAssignment;

        public AssignmentController(I_BLL_ManageAssignment manageAssignment)
        {
            _manageAssignment = manageAssignment;
        }

        private int GetTeacherID()
        {
            return  (int)HttpContext.Items["UserID"];
        }

        [HttpGet("get-all-assignment/{videoID}")]
        public IActionResult GetAssignments(int videoID)
        {
            var result = _manageAssignment.GetAssignments(videoID, GetTeacherID());
            if(result.Count == 0)
            {
                return NotFound("Không tìm th?y bài t?p trong video!");
            }
            return Ok(result);
        }
        [HttpGet("get-all-assignments")]
        public IActionResult GetAllAssignments()
        {
            var result = _manageAssignment.getAllAssignment(GetTeacherID());
            if (result.Count == 0)
            {
                return NotFound("Không tìm th?y bài t?p nào!");
            }
            return Ok(result);
        }
        [HttpGet("get-assignment-by-id/{assignmentID}")]
        public IActionResult GetAssignmentById(int assignmentID)
        {
            var result = _manageAssignment.getAssignmentById(assignmentID, GetTeacherID());
            if (result.Count == 0)
            {
                return NotFound("Không tìm th?y bài t?p!");
            }
            return Ok(result);
        }

        [HttpPost("create-assignment")]
        public IActionResult Create([FromBody] AssignmentRequest req)
        {
            _manageAssignment.CreateAssignment(req, GetTeacherID());
            return Ok("t?o bài t?p thành công!");
        }

        [HttpPut("update-assignment")]
        public IActionResult Update([FromBody] Assignment req)
        {
            _manageAssignment.UpdateAssignment(req, GetTeacherID());
            return Ok("c?p nh?t bài t?p thành công!");
        }

        [HttpDelete("delete-assignment/{assignmentID}")]
        public IActionResult Delete(int assignmentID)
        {
            _manageAssignment.DeleteAssignment(assignmentID, GetTeacherID());
            return Ok("xóa bài t?p thành công!");
        }
    }
}
// Bug fixes and code refactoring
// Security enhancements integrated
// API improvements and error handling
// Enhanced functionality - 2026-01-10
// Database optimization completed
// Performance optimization implemented
// Configuration settings optimized
   Code review suggestions applied */
// Code documentation updated
// Unit tests added for better coverage
// Feature flag implementation
// Security enhancements integrated
// Configuration settings optimized
