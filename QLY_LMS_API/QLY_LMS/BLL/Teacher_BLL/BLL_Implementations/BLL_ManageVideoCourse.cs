using QLY_LMS.BLL.Teacher_BLL.BLL_Interfaces;
using QLY_LMS.DAL.Teacher_DAL.Interfaces;
using QLY_LMS.Models.MTeacher;
using QLY_LMS.Models.MTeacher.Request;

namespace QLY_LMS.BLL.Teacher_BLL.BLL_Implementations
{
    public class BLL_ManageVideoCourse : I_BLL_ManageVideoCourse
    {
        private readonly I_DAL_ManageVideoCourse _ManageCourse;

        public BLL_ManageVideoCourse(I_DAL_ManageVideoCourse dal)
        {
            _ManageCourse = dal;
        }

        public List<Video_course> GetAllVideo(int courseID, int teacherID)
        {
            return _ManageCourse.GetAllVideo(courseID, teacherID);

        }

        public bool CreateVideo(create_video video, int teacherID, out string Mess)
        {

            if (video.videoProgress != "incomplete" && video.videoProgress != "completed")
            {
                Mess = "Trạng thái video chỉ được là completed hoặc incomplete!";
                return false;
            }

            return _ManageCourse.CreateVideo(video, teacherID, out Mess);
        }

        public bool UpdateVideo(Video_courseRequest video, int teacherID, out string Mess)
        {
            if (video.videoProgress != "incomplete" && video.videoProgress != "completed")
            {
                Mess = "Trạng thái video chỉ được là completed hoặc incomplete!";
                return false;
            }
            return _ManageCourse.UpdateVideo(video, teacherID, out Mess);
        }

        public bool DeleteVideo(int videoID, int teacherID, out string Mess)
        {
            return _ManageCourse.DeleteVideo(videoID, teacherID, out Mess);
        }
    }
}
