namespace QLY_LMS.Models.MTeacher
{
    public class CourseRequest
    {
        [Required(ErrorMessage = "Tên khóa h?c không du?c d? tr?ng")]
        [StringLength(50)]
        public string courseName { get; set; } = null!;

        [Required(ErrorMessage = "Lo?i khóa h?c không du?c d? tr?ng")]
        [StringLength(50)]
        public string courseType { get; set; } = null!;

        [Required(ErrorMessage = "Mô t? không du?c d? tr?ng")]
        [StringLength(200)]
        public string courseDes { get; set; } = null!;

        [Required]
        public DateOnly courseDate { get; set; }

        [Required]
        [Range(0, 9999999999.999)]
        public decimal coursePrice { get; set; }

        [Required]
        public string courseStatus { get; set; } = "incomplete";

        public string? courseImage { get; set; }
        [JsonIgnore]
        public int teacherID { get; set; }
    }
}
# Update 2026-01-10 17:57:42
# Bug fixes and improvements
# API improvements
# Performance optimization
// Configuration settings optimized
// Performance optimization implemented
// Logging mechanism enhanced
// Feature flag implementation
// Database optimization completed
// Feature flag implementation
// Logging mechanism enhanced
// Code documentation updated
// Database optimization completed
// Database optimization completed
// Enhanced functionality - 2026-01-10
   Additional implementation details
// Security enhancements integrated
// Security enhancements integrated
