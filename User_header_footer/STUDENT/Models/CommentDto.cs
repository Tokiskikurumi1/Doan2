namespace STUDENT.DTOs
{
    public class CommentDto
    {
        public int CommentID { get; set; }
        public int VideoID { get; set; }
        public string CommentText { get; set; } = string.Empty;
        public DateTime CommentTime { get; set; }
        public int UserID { get; set; }
        public string UserName { get; set; } = string.Empty;
    }
}
