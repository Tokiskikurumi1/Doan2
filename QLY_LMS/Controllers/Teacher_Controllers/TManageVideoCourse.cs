using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QLY_LMS.BLL.Teacher_BLL.BLL_Interfaces;
using QLY_LMS.Models.MTeacher;

namespace QLY_LMS.Controllers.Teacher_Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TManageVideoCourse : Controller
    {
        private readonly I_BLL_ManageVideoCourse _IManageVideoCourse;

        public TManageVideoCourse(I_BLL_ManageVideoCourse IbanageVideoCourse)
        {
            _IManageVideoCourse = IbanageVideoCourse;
        }
        [Route("get-all-video")]
        [HttpGet]
        public IActionResult get_All_Video(int CId)
        {
            var courseId = _IManageVideoCourse.getAllVideo(CId);

            if(courseId == null)
            {
                return BadRequest("khoá học chưa có video!");
            }
            return Ok(courseId);
        }
        //public IActionResult Index()
        //{
        //    return View();
        //}
    }
}
