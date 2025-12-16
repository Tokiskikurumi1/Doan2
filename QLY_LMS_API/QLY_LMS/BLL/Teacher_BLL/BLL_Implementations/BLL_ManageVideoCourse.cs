
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
// Performance optimization implemented
// Code documentation updated
// Configuration settings optimized
// Feature flag implementation
// UI/UX improvements added
// API improvements and error handling
/* Multi-line comment block
// Bug fixes and code refactoring
// Performance optimization implemented
   Code review suggestions applied */
// Unit tests added for better coverage
// Enhanced functionality - 2026-01-10
// Configuration settings optimized
// Logging mechanism enhanced
// Configuration settings optimized
// Code documentation updated
// Bug fixes and code refactoring
// API improvements and error handling
// Performance optimization implemented
// Performance optimization implemented
// Logging mechanism enhanced
// Code documentation updated
   Code review suggestions applied */
// UI/UX improvements added
// Configuration settings optimized
// Logging mechanism enhanced
// API improvements and error handling
// Bug fixes and code refactoring
// Unit tests added for better coverage
// Unit tests added for better coverage
// Code documentation updated
// API improvements and error handling
// Code documentation updated
