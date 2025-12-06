using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QLY_LMS.BLL.Teacher_BLL.BLL_Interfaces;
using QLY_LMS.Controllers.Teacher_Controllers;
using QLY_LMS.Models.MTeacher;

[Authorize(Roles = "Teacher")]
[Route("api/[controller]")]
[ApiController]
public class VideoController : ControllerBase
{
    private readonly I_BLL_ManageVideoCourse _service;

    public VideoController(I_BLL_ManageVideoCourse service)
    {
        _service = service;
    }

    private int GetTeacherID()
    {
        return int.Parse(User.FindFirst("userID").Value);

    }


    [HttpGet("get-all-video/{courseID}")]
    public IActionResult GetAll(int courseID)
    {
        int teacherID = GetTeacherID();

        return Ok(_service.GetAllVideo(courseID, teacherID));
    }

    [HttpPost("create-new-video")]
    public IActionResult Create(Video_course video)
    {
        int teacherID = GetTeacherID();

        _service.CreateVideo(video, teacherID);

        return Ok(new { message = "created" });
    }

    [HttpPut("update-video")]
    public IActionResult Update(Video_course video)
    {
        int teacherID = GetTeacherID();

        _service.UpdateVideo(video, teacherID);

        return Ok(new { message = "updated" });
    }

    [HttpDelete("delete-video/{videoID}")]
    public IActionResult Delete(int videoID)
    {
        int teacherID = GetTeacherID();

        _service.DeleteVideo(videoID, teacherID);

        return Ok(new { message = "deleted" });
    }
}
