namespace STUDENT.DTOs
{
    public class UpdateCommentDto
    {
        public int CommentID { get; set; }
        public int UserID { get; set; }
        public string CommentText { get; set; } = string.Empty;
    }
}
