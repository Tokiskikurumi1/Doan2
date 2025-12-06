using QLY_LMS.Models.MTeacher;

namespace QLY_LMS.DAL.Teacher_DAL.Interfaces
{
    public interface I_DAL_ManageVideoCourse
    {
        List<Video_course> GetAllVideo(int courseID, int teacherID);
        bool CreateVideo(Video_course video, int teacherID);
        bool UpdateVideo(Video_course video, int teacherID);
        bool DeleteVideo(int videoID, int teacherID);
    }
}
