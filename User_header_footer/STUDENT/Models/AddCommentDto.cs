namespace STUDENT.DTOs
{
    public class AddCommentDto
    {
        public int UserID { get; set; }
        public int VideoID { get; set; }
        public string CommentText { get; set; } = string.Empty;
    }
}
