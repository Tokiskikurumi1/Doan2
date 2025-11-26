{
    public interface I_BLL_ManageVideoCourse
    {
        List<Video_course> GetAllVideo(int courseID, int teacherID);
        bool CreateVideo(create_video video, int teacherID);
        bool UpdateVideo(Video_courseRequest video, int teacherID);
        bool DeleteVideo(int videoID, int teacherID);

    }
}
// Bug fixes and code refactoring
// Code documentation updated
/* Multi-line comment block
   Additional implementation details
/* Multi-line comment block
   Additional implementation details
// Feature flag implementation
// Enhanced functionality - 2026-01-10
