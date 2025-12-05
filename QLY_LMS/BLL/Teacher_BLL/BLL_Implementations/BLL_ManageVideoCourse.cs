using QLY_LMS.BLL.Teacher_BLL.BLL_Interfaces;
using QLY_LMS.DAL.Teacher_DAL.Interfaces;
using QLY_LMS.Models.MTeacher;

namespace QLY_LMS.BLL.Teacher_BLL.BLL_Implementations
{
    public class BLL_ManageVideoCourse : I_BLL_ManageVideoCourse
    {
        private readonly I_DAL_ManageVideoCourse _ManageCourse;

        public BLL_ManageVideoCourse(I_DAL_ManageVideoCourse MAnageCourse)
        {
            _ManageCourse = MAnageCourse;
        }

        public List<Video_course> getAllVideo(int CId)
        {
            return _ManageCourse.getAllVideo(CId);
        }
    }
}
