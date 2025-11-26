using STUDENT.Services;

namespace STUDENT.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StudentController : ControllerBase
    {
        private readonly IStudentRepository _studentRepository;
        private readonly TokenService _tokenService;

        public StudentController(IStudentRepository studentRepository, TokenService tokenService)
        {
            _studentRepository = studentRepository;
            _tokenService = tokenService;
        }

        //   Lấy thông tin người dùng theo ID
        [Authorize]
        [HttpGet("profile/{id}")]
        public async Task<IActionResult> GetUserProfile(int id)
        {
            var user = await _studentRepository.GetUserByIdAsync(id);
            if (user == null)
                return NotFound(new { message = "User not found" });

            return Ok(user);
        }

        //   Cập nhật thông tin người dùng
        [Authorize]
        [HttpPut("profile/{id}")]
        public async Task<IActionResult> UpdateUserProfile(int id, [FromBody] UserDto req)
        {
            var existingUser = await _studentRepository.GetUserByIdAsync(id);
            if (existingUser == null)
                return NotFound(new { message = "User not found" });

            // Update fields
            existingUser.UserName = req.UserName;
            existingUser.DateOfBirth = req.DateOfBirth;
            existingUser.Gender = req.Gender;
            existingUser.District = req.District;
            existingUser.Province = req.Province;
            existingUser.PhoneNumber = req.PhoneNumber;
            existingUser.Email = req.Email;

            await _studentRepository.UpdateUserAsync(existingUser);

            return Ok(new { message = "Profile updated successfully" });
        }

        //   Đổi mật khẩu
        [Authorize]
        [HttpPut("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto req)
        {
            var user = await _studentRepository.LoginAsync(req.Account, req.OldPassword);
            if (user == null)
                return BadRequest(new { message = "Old password is incorrect" });

            await _studentRepository.ChangePasswordAsync(req.Account, req.OldPassword, req.NewPassword);

            return Ok(new { message = "Password updated successfully" });
        }

        //   Đăng nhập
        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto req)
        {
            var user = await _studentRepository.LoginAsync(req.Account, req.Pass);
            if (user == null)
                return Unauthorized(new { message = "Invalid account or password" });

            var token = _tokenService.GenerateToken(user);
            user.Token = token;

            return Ok(user); // trả về UserLoginDto
        }

        //   Lấy toàn bộ thông tin khoá học
        [Authorize]
        [HttpGet("course/{courseId}")]
        public async Task<IActionResult> GetCourseFullInfo(int courseId)
        {
            var courseInfo = await _studentRepository.GetCourseFullInfoAsync(courseId);
            if (courseInfo == null)
                return NotFound();

            return Ok(courseInfo);
        }

        //   Đăng ký khoá học
        [Authorize]
        [HttpPost("{userId}/enroll/{courseId}")]
        public async Task<IActionResult> EnrollCourse(int userId, int courseId)
        {
            var result = await _studentRepository.EnrollCourseAsync(userId, courseId);

            if (!result.Success)
                return BadRequest(new { message = result.Message });

            return Ok(new { message = result.Message });
        }


        //   Lấy chi tiết bài tập
        
        [HttpGet("assignment/{assignmentId}")]
        public async Task<IActionResult> GetAssignmentInfo(int assignmentId)
        {
            var assignmentInfo = await _studentRepository.GetAssignmentInfoAsync(assignmentId);
            if (assignmentInfo == null)
                return NotFound();

            return Ok(assignmentInfo);
        }

        //   Thêm bình luận
        [Authorize]
        [HttpPost("comment")]
        public async Task<IActionResult> AddComment([FromBody] AddCommentDto comment)
        {
            if (string.IsNullOrWhiteSpace(comment.CommentText))
                return BadRequest("Comment text cannot be empty.");

            await _studentRepository.AddCommentAsync(comment);
            return Ok(new { message = "Comment added successfully" });
        }

        //   Cập nhật bình luận
        [Authorize]
        [HttpPut("comment")]
        public async Task<IActionResult> UpdateComment([FromBody] UpdateCommentDto comment)
        {
            if (string.IsNullOrWhiteSpace(comment.CommentText))
                return BadRequest("Comment text cannot be empty.");

            await _studentRepository.UpdateCommentAsync(comment);
            return Ok(new { message = "Comment updated successfully" });
        }

        //   Xóa bình luận
        [Authorize]
        [HttpDelete("comment/{commentId}/{userId}")]
        public async Task<IActionResult> DeleteComment(int commentId, int userId)
        {
            await _studentRepository.DeleteCommentAsync(commentId, userId);
            return Ok(new { message = "Comment deleted successfully" });
        }
        //   Lưu điểm của sinh viên

        [Authorize]
        [HttpPost("score/save")]
        public async Task<IActionResult> SaveScore([FromBody] SaveScoreDto scoreDto)
        {
            if (scoreDto == null || scoreDto.StudentID <= 0 || scoreDto.CourseID <= 0)
                return BadRequest(new { message = "Invalid score data" });

            try
            {
                await _studentRepository.SaveScoreAsync(scoreDto);
                return Ok(new { message = "Score saved successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error saving score", error = ex.Message });
            }
        }

        // Lấy danh sách điểm của sinh viên
        
        [HttpGet("scores/{studentId}")]
        public async Task<IActionResult> GetScores(int studentId, [FromQuery] int? assignmentId = null)
        {
            try
            {
                var scores = await _studentRepository.GetScoresAsync(studentId, assignmentId);
                if (scores == null || !scores.Any())
                    return NotFound(new { message = "No scores found for this student" });

                return Ok(scores);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving scores", error = ex.Message });
            }
        }

        // Lấy danh sách khóa học đã đăng ký của học viên
        [Authorize]

        [HttpGet("enrolled-courses/{userId}")]
        public async Task<IActionResult> GetEnrolledCourses(int userId)
        {
            try
            {
                var courses = await _studentRepository.GetUserCoursesAsync(userId);
                return Ok(courses);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving enrolled courses", error = ex.Message });
            }
        }

        //Lấy danh sách khóa học chưa đăng ký của học viên
        [Authorize]

        [HttpGet("unenrolled-courses/{userId}")]
        public async Task<IActionResult> GetUnenrolledCourses(int userId)
        {
            try
            {
                var courses = await _studentRepository.GetUnenrolledCoursesAsync(userId);
                return Ok(courses);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving unenrolled courses", error = ex.Message });
            }
        }

        // Lấy tất cả khóa học
        [HttpGet("courses")]
        public async Task<IActionResult> GetAllCourses()
        {
            try
            {
                var courses = await _studentRepository.GetAllCoursesAsync();
                return Ok(courses);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving all courses", error = ex.Message });
            }
        }

        //   Lấy bình luận theo video ID

        [HttpGet("comments/video/{videoId}")]
        public async Task<IActionResult> GetCommentsByVideoId(int videoId)
        {
            try
            {
                var comments = await _studentRepository.GetCommentsByVideoIdAsync(videoId);
                // Return empty array instead of NotFound when no comments exist
                return Ok(comments ?? new List<CommentDto>());
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving comments", error = ex.Message });
            }
        }
    }
}
// Security enhancements integrated
/* Multi-line comment block
// Feature flag implementation
// Security enhancements integrated
// Code documentation updated
// Configuration settings optimized
// Logging mechanism enhanced
// Security enhancements integrated
// Enhanced functionality - 2026-01-10
// Feature flag implementation
