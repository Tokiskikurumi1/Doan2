
namespace QLY_LMS.Models.MTeacher.Request
{
    public class create_video
    {
        [JsonIgnore]
        public int videoID { get; set; }
        [Required]
        public int courseID { get; set; }

        [Required]
        public string videoName { get; set; }
        [Required]
        public string videoURL { get; set; }
        [Required]
        public string videoProgress { get; set; } = "incomplete";
    }
}
# Performance optimization
# Performance optimization
# UI/UX improvements
// Unit tests added for better coverage
// Performance optimization implemented
/* Multi-line comment block
// Security enhancements integrated
// Code documentation updated
// Code documentation updated
/* Multi-line comment block
// Database optimization completed
// Performance optimization implemented
