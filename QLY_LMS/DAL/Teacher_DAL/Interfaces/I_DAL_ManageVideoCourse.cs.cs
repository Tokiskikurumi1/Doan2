using QLY_LMS.Models.MTeacher;

namespace QLY_LMS.DAL.Teacher_DAL.Interfaces
{
    public interface I_DAL_ManageVideoCourse
    {
        List<Video_course> getAllVideo(int CId);
        bool createVideo (Video_course video);
        bool updateVideo (Video_course video);
        bool deleteVideo (Video_course video);
    }
}
