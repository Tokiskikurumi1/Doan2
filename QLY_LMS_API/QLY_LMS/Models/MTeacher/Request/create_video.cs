using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace QLY_LMS.Models.MTeacher.Request
{
    public class create_video
    {
        [JsonIgnore]
        public int videoID { get; set; }
        [Required]
        public int courseID { get; set; }

        [Required(ErrorMessage = "Tên video không được để trống!")]
        public string videoName { get; set; }
        [Required(ErrorMessage = "Link video không được để trống!")]
        public string videoURL { get; set; }
        [Required]
        public string videoProgress { get; set; } = "incomplete";
    }
}
