using System.ComponentModel.DataAnnotations;

namespace QLY_LMS.Models.MTeacher.Request
{
    public class AssignmentRequest
    {
        public int videoID { get; set; }
        [Required(ErrorMessage = "Tên bài tập không được để trống")]
        public string assignmentName { get; set; }
        [Required(ErrorMessage = "Khóa học không được để trống")]
        public string assignmentCourse { get; set; }
        [Required(ErrorMessage = "Dạng bài tập không được để trống")]
        public string assignmentType { get; set; }  // Quiz, Reading, Rewrite
        [Required(ErrorMessage = "Hạn nộp không được để trống")]
        public DateTime assignmentDeadline { get; set; }
        [Required(ErrorMessage = "Thời gian không được để trống")]
        public int assignmentDuration { get; set; }
        [Required(ErrorMessage = "Mô tả bài tập không được để trống")]
        public string assginmentDes { get; set; }
        [Required(ErrorMessage = "Trạng thái bài tập không được để trống")]
        public string assignmentStatus { get; set; } = "incomplete";
    }

}
