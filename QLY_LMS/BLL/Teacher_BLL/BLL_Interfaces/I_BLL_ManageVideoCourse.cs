using QLY_LMS.Models.MTeacher;

namespace QLY_LMS.BLL.Teacher_BLL.BLL_Interfaces
{
    public interface I_BLL_ManageVideoCourse
    {
        List<Video_course> GetAllVideo(int courseID, int teacherID);
        bool CreateVideo(Video_course video, int teacherID);
        bool UpdateVideo(Video_courseRequest video, int teacherID);
        bool DeleteVideo(int videoID, int teacherID);

    }
}
