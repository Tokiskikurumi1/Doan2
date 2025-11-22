using Dapper;
using STUDENT.DTOs;

namespace STUDENT.Repositories
{
    public class StudentRepository : IStudentRepository
    {
        private readonly string _connectionString;

        public StudentRepository(IConfiguration config)
        {
            _connectionString = config.GetConnectionString("LMSConnection")
                ?? throw new ArgumentNullException(nameof(config));
        }

        // Đăng nhập
        public async Task<UserLoginDto?> LoginAsync(string account, string pass)
        {
            using var conn = new SqlConnection(_connectionString);

            return await conn.QueryFirstOrDefaultAsync<UserLoginDto>(
                "sp_login",
                new { Account = account, Pass = pass },
                commandType: CommandType.StoredProcedure);
        }

        // Lấy thông tin người dùng theo ID
        public async Task<UserDto?> GetUserByIdAsync(int userId)
        {
            using var conn = new SqlConnection(_connectionString);

            var result = await conn.QueryAsync<UserDto>(
                "sp_get_current_user",
                new { userID = userId },
                commandType: CommandType.StoredProcedure);

            return result.FirstOrDefault();
        }

        // Cập nhật thông tin người dùng
        public async Task UpdateUserAsync(UserDto user)
        {
            using var conn = new SqlConnection(_connectionString);

            await conn.ExecuteAsync(
                "sp_update_user",
                new
                {
                    userID = user.UserID,
                    userName = user.UserName,
                    Date_of_Birth = user.DateOfBirth,
                    gender = user.Gender,
                    district = user.District,
                    province = user.Province,
                    phoneNumber = user.PhoneNumber,
                    Email = user.Email
                },
                commandType: CommandType.StoredProcedure);
        }

        // Đổi mật khẩu
        public async Task ChangePasswordAsync(string account, string oldPassword, string newPassword)
        {
            using var conn = new SqlConnection(_connectionString);

            await conn.ExecuteAsync(
                "sp_change_password",
                new { Account = account, OldPassword = oldPassword, NewPassword = newPassword },
                commandType: CommandType.StoredProcedure);
        }

        // Lấy danh sách khoá học của user
        public async Task<IEnumerable<CourseDto>> GetUserCoursesAsync(int userId)
        {
            using var conn = new SqlConnection(_connectionString);

            return await conn.QueryAsync<CourseDto>(
                "sp_get_user_courses",
                new { userID = userId },
                commandType: CommandType.StoredProcedure);
        }

        // Lấy danh sách khoá học chưa đăng ký của user
        public async Task<IEnumerable<CourseDto>> GetUnenrolledCoursesAsync(int userId)
        {
            using var conn = new SqlConnection(_connectionString);

            var sql = @"
                SELECT
                    c.courseID,
                    c.courseName,
                    c.courseType,
                    c.courseDes,
                    c.courseDate,
                    c.coursePrice,
                    c.courseStatus,
                    c.courseImage,
                    u.userName AS teacherName
                FROM COURSE c
                INNER JOIN USER_TABLE u ON c.teacherID = u.userID
                WHERE c.courseID NOT IN (
                    SELECT courseID FROM STUDENT_COURSE WHERE userID = @userID
                )";

            return await conn.QueryAsync<CourseDto>(sql, new { userID = userId });
        }

        // Đăng ký khoá học
        public async Task<EnrollResultDto> EnrollCourseAsync(int userId, int courseId)
        {
            using var conn = new SqlConnection(_connectionString);

            return await conn.QueryFirstAsync<EnrollResultDto>(
                "sp_enroll_course",
                new
                {
                    userID = userId,
                    courseID = courseId
                },
                commandType: CommandType.StoredProcedure
            );
        }



        // Lấy điểm của sinh viên
        public async Task<IEnumerable<ScoreDto>> GetScoresAsync(int studentId, int? assignmentId = null)
        {
            using var conn = new SqlConnection(_connectionString);

            return await conn.QueryAsync<ScoreDto>(
                "sp_get_scores",
                new { studentID = studentId, assignmentID = assignmentId },
                commandType: CommandType.StoredProcedure);
        }

        // Lấy toàn bộ thông tin khoá học
        public async Task<CourseFullInfoDto?> GetCourseFullInfoAsync(int courseId)
        {
            using var conn = new SqlConnection(_connectionString);
            await conn.OpenAsync();

            using var multi = await conn.QueryMultipleAsync(
                "sp_course_full_info",
                new { courseID = courseId },
                commandType: CommandType.StoredProcedure);

            var course = multi.ReadFirstOrDefault<CourseDto>();
            if (course == null) return null;

            var students = multi.Read<StudentDto>().ToList();
            var videos = multi.Read<VideoDto>().ToList();
            var assignments = multi.Read<AssignmentDto>().ToList();
            var questions = multi.Read<QuestionDto>().ToList();
            var answers = multi.Read<AnswerDto>().ToList();
            var comments = multi.Read<CommentDto>().ToList();

            return new CourseFullInfoDto
            {
                CourseID = course.CourseID,
                CourseName = course.CourseName,
                CourseType = course.CourseType,
                CourseDes = course.CourseDes,
                CourseDate = course.CourseDate,
                CoursePrice = course.CoursePrice,
                CourseStatus = course.CourseStatus,
                CourseImage = course.CourseImage,
                TeacherID = course.TeacherID,
                TeacherName = course.TeacherName,
                TeacherEmail = course.TeacherEmail,
                Students = students,
                Videos = videos,
                Assignments = assignments,
                Questions = questions,
                Answers = answers,
                Comments = comments
            };
        }

        // Lấy chi tiết bài tập
        public async Task<AssignmentDto?> GetAssignmentInfoAsync(int assignmentId)
        {
            using var conn = new SqlConnection(_connectionString);

            using var multi = await conn.QueryMultipleAsync(
                "sp_get_assignment_info",
                new { assignmentID = assignmentId },
                commandType: CommandType.StoredProcedure);

            var assignment = multi.ReadFirstOrDefault<AssignmentDto>();
            if (assignment == null) return null;

            assignment.Questions = multi.Read<QuestionDto>().ToList();
            assignment.Answers = multi.Read<AnswerDto>().ToList();

            return assignment;
        }

        // Thêm bình luận
        public async Task AddCommentAsync(AddCommentDto comment)
        {
            using var conn = new SqlConnection(_connectionString);

            await conn.ExecuteAsync(
                "sp_add_comment",
                new
                {
                    comment.UserID,
                    comment.VideoID,
                    comment.CommentText
                },
                commandType: CommandType.StoredProcedure);
        }

        // Cập nhật bình luận
        public async Task UpdateCommentAsync(UpdateCommentDto comment)
        {
            using var conn = new SqlConnection(_connectionString);

            await conn.ExecuteAsync(
                "sp_update_comment",
                new
                {
                    comment.CommentID,
                    comment.UserID,
                    comment.CommentText
                },
                commandType: CommandType.StoredProcedure);
        }

        // Xóa bình luận
        public async Task DeleteCommentAsync(int commentId, int userId)
        {
            using var conn = new SqlConnection(_connectionString);

            await conn.ExecuteAsync(
                "sp_delete_comment",
                new
                {
                    CommentID = commentId,
                    UserID = userId
                },
                commandType: CommandType.StoredProcedure);
        }
        // Lưu điểm của sinh viên
public async Task SaveScoreAsync(SaveScoreDto scoreDto)
{
    using var conn = new SqlConnection(_connectionString);

    await conn.ExecuteAsync(
        "sp_save_score",
        new
        {
            StudentID = scoreDto.StudentID,
            CourseID = scoreDto.CourseID,
            AssignmentID = scoreDto.AssignmentID,
            Subject = scoreDto.Subject,
            Correct = scoreDto.Correct,
            Total = scoreDto.Total,
            Score = scoreDto.Score
        },
        commandType: CommandType.StoredProcedure);
}

        // Lấy tất cả khóa học
        public async Task<IEnumerable<CourseDto>> GetAllCoursesAsync()
        {
            using var conn = new SqlConnection(_connectionString);

            var sql = @"
                SELECT
                    c.courseID,
                    c.courseName,
                    c.courseType,
                    c.courseDes,
                    c.courseDate,
                    c.coursePrice,
                    c.courseStatus,
                    c.courseImage,
                    u.userName AS teacherName
                FROM COURSE c
                INNER JOIN USER_TABLE u ON c.teacherID = u.userID";

            return await conn.QueryAsync<CourseDto>(sql);
        }

        // Lấy bình luận theo video ID
        public async Task<IEnumerable<CommentDto>> GetCommentsByVideoIdAsync(int videoId)
        {
            using var conn = new SqlConnection(_connectionString);

            var sql = @"
                SELECT
                    c.commentID,
                    c.videoID,
                    c.commentText,
                    c.commentTime,
                    u.userID,
                    u.userName
                FROM COMMENTS c
                INNER JOIN USER_TABLE u ON c.userID = u.userID
                WHERE c.videoID = @videoId
                ORDER BY c.commentTime DESC";

            return await conn.QueryAsync<CommentDto>(sql, new { videoId });
        }


    }
}
# Database optimization
# Database optimization
# Database optimization
# UI/UX improvements
// Code documentation updated
// UI/UX improvements added
/* Multi-line comment block
// UI/UX improvements added
// API improvements and error handling
// Enhanced functionality - 2026-01-10
// Bug fixes and code refactoring
   Code review suggestions applied */
// API improvements and error handling
// Enhanced functionality - 2026-01-10
