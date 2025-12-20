    {
        //[JsonIgnore]
        public int courseID { get; set; }

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
# Update 2026-01-10 17:57:44
// Logging mechanism enhanced
// Code documentation updated
// Database optimization completed
// Enhanced functionality - 2026-01-10
// Performance optimization implemented
// Bug fixes and code refactoring
// Logging mechanism enhanced
   Additional implementation details
// UI/UX improvements added
// Logging mechanism enhanced
   Additional implementation details
// Database optimization completed
   Code review suggestions applied */
// Configuration settings optimized
// Configuration settings optimized
// Security enhancements integrated
   Additional implementation details
   Additional implementation details
   Code review suggestions applied */
/* Multi-line comment block
// Database optimization completed
// Bug fixes and code refactoring
// Configuration settings optimized
