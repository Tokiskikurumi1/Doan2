namespace STUDENT.DTOs
{
    public class UserLoginDto
    {
        public int UserID { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string Account { get; set; } = string.Empty;
        public string Pass { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public int RoleID { get; set; }
        public string RoleName { get; set; } = string.Empty;
        public string Token { get; set; } = string.Empty;

    }
}
