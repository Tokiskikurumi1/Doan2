namespace STUDENT.DTOs
{
    public class ChangePasswordDto
    {
        public string Account { get; set; } = string.Empty;
        public string OldPassword { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
    }
}
