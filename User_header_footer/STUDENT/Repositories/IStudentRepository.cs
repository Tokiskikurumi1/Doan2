using STUDENT.DTOs;

namespace STUDENT.Repositories
{
    public interface IStudentRepository
    {
        Task<UserLoginDto?> LoginAsync(string account, string pass);
        Task<UserDto?> GetUserByIdAsync(int userId);
        Task UpdateUserAsync(UserDto user);
        Task ChangePasswordAsync(string account, string oldPassword, string newPassword);
        Task<IEnumerable<CourseDto>> GetUserCoursesAsync(int userId);
        Task<IEnumerable<CourseDto>> GetUnenrolledCoursesAsync(int userId);
        Task<EnrollResultDto> EnrollCourseAsync(int userId, int courseId);

        Task<IEnumerable<ScoreDto>> GetScoresAsync(int studentId, int? assignmentId = null);
        Task<CourseFullInfoDto?> GetCourseFullInfoAsync(int courseId); 
        Task<AssignmentDto?> GetAssignmentInfoAsync(int assignmentId); 
        Task AddCommentAsync(AddCommentDto comment);
        Task UpdateCommentAsync(UpdateCommentDto comment);
        Task DeleteCommentAsync(int commentId, int userId);
        Task SaveScoreAsync(SaveScoreDto scoreDto);
        Task<IEnumerable<CourseDto>> GetAllCoursesAsync();
        Task<IEnumerable<CommentDto>> GetCommentsByVideoIdAsync(int videoId);
    }
}
