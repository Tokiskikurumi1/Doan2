namespace QLY_LMS.Models.MTeacher
{
    public class Assignment
    {
        public int AssignmentID { get; set; }
        public string AssignmentName { get; set; }
        public string AssignmentCourse { get; set; }
        public string AssignmentType { get; set; }
        public DateTime? AssignmentDeadline { get; set; }
        public int AssignmentDuration { get; set; }
        public string AssginmentDes { get; set; }
        public byte AssignmentStatus { get; set; }
        public int CourseID { get; set; }
    }
}
