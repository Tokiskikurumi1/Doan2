namespace STUDENT.DTOs
{
    public class VideoDto
    {
        public int VideoID { get; set; }
        public string VideoName { get; set; } = string.Empty;
        public string VideoURL { get; set; } = string.Empty;
        public string VideoProgress { get; set; } = string.Empty;
    }
}
