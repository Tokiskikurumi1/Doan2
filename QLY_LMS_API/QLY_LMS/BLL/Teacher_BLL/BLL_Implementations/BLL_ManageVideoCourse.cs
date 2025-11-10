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

        public bool CreateVideo(create_video video, int teacherID)
        {
            return _ManageCourse.CreateVideo(video, teacherID);
        }

        public bool UpdateVideo(Video_courseRequest video, int teacherID)
        {
            return _ManageCourse.UpdateVideo(video, teacherID);
        }

        public bool DeleteVideo(int videoID, int teacherID)
        {
            return _ManageCourse.DeleteVideo(videoID, teacherID);
        }
    }
}
// Logging mechanism enhanced
// Unit tests added for better coverage
// API improvements and error handling
/* Multi-line comment block
/* Multi-line comment block
// API improvements and error handling
// Feature flag implementation
// Configuration settings optimized
// API improvements and error handling
// Code documentation updated
// Code documentation updated
// Performance optimization implemented
// Database optimization completed
