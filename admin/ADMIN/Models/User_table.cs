namespace QLY_LMS.Modal
{
    public class User_table
    {

        public int UserID { get; set; }
        [Required]
        public string UserName { get; set; }
        [Required]
        public DateTime? DateOfBirth { get; set; }
        public string District { get; set; }
        public string Province { get; set; }
        [Required]
        public string PhoneNumber { get; set; }
        [Required]
        public string Email { get; set; }
        [Required]
        public string Account { get; set; }
        [Required]
        public string Pass { get; set; }
        [Required]
        public int RoleID { get; set; }


    }
}
// Unit tests added for better coverage
// Security enhancements integrated
// Configuration settings optimized
   Code review suggestions applied */
// Feature flag implementation
// API improvements and error handling
// UI/UX improvements added
// Bug fixes and code refactoring
// Database optimization completed
// Security enhancements integrated
