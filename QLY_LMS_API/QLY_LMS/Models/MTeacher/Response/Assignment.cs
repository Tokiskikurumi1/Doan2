using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace QLY_LMS.Models.MTeacher.Response
{
    public class Assignment
    {
        //[JsonIgnore]
        public int assignmentID { get; set; }
        public int videoID { get; set; }
        [JsonIgnore]
        public int teacherID { get; set; }
        [Required(ErrorMessage = "Tên bài tập không được để trống")]
        public string assignmentName { get; set; }
        [Required(ErrorMessage = "Khóa học không được để trống")]
        public string assignmentCourse { get; set; }
        [Required(ErrorMessage = "Dạng bài tập không được để trống")]
        public string assignmentType { get; set; }
        [Required(ErrorMessage = "Hạn nộp không được để trống")]
        public DateTime? assignmentDeadline { get; set; }
        [Required(ErrorMessage = "Thời gian không được để trống")]
        public int assignmentDuration { get; set; }
        [Required(ErrorMessage = "Mô tả bài tập không được để trống")]
        public string assignmentDes { get; set; }
        [Required(ErrorMessage = "Trạng thái bài tập không được để trống")]
        public string assignmentStatus { get; set; } = "incomplete";
    }
}
