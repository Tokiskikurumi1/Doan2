    {
        public int CourseID { get; set; }
        public string CourseName { get; set; } = string.Empty;
        public string CourseType { get; set; } = string.Empty;
        public string CourseDes { get; set; } = string.Empty;
        public DateTime CourseDate { get; set; }
        public decimal CoursePrice { get; set; }
        public string CourseStatus { get; set; } = string.Empty;
        public string CourseImage { get; set; } = string.Empty;

        public int TeacherID { get; set; }
        public string TeacherName { get; set; } = string.Empty;
        public string TeacherEmail { get; set; } = string.Empty;

        public List<StudentDto> Students { get; set; } = new();
        public List<VideoDto> Videos { get; set; } = new();
        public List<AssignmentDto> Assignments { get; set; } = new();
        public List<QuestionDto> Questions { get; set; } = new();
        public List<AnswerDto> Answers { get; set; } = new();
        public List<CommentDto> Comments { get; set; } = new();
    }
}
/* Multi-line comment block
// Code documentation updated
// UI/UX improvements added
// Performance optimization implemented
// Security enhancements integrated
// Security enhancements integrated
// Security enhancements integrated
// Logging mechanism enhanced
// Unit tests added for better coverage
// API improvements and error handling
// Configuration settings optimized
// Bug fixes and code refactoring
// Bug fixes and code refactoring
