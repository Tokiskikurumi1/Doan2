namespace STUDENT.DTOs
{
    public class UserDto
    {
        public int UserID { get; set; }
        public string UserName { get; set; } = string.Empty;
        public DateTime? DateOfBirth { get; set; }   // chuẩn PascalCase
        public string Gender { get; set; } = string.Empty;
        public string District { get; set; } = string.Empty;
        public string Province { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Account { get; set; } = string.Empty;
        public string Pass { get; set; } = string.Empty;
        public int RoleID { get; set; }
        public string RoleName { get; set; } = string.Empty;
    }
}
# Security enhancements
# Feature enhancement 2026-01-10 18:02:58
# Security enhancements
# Code optimization and refactoring
