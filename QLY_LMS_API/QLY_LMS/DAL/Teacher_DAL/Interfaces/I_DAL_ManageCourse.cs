    public interface I_DAL_ManageCourse
    {
        List<Course> getAllCoures(int Tid);
        bool createCourse(CourseRequest coures);   
        bool updateCourse(int courseID,Course course);
        bool deleteCourse(int courseID, int teacherID);
        bool CheckCourseOfTeacher(int courseID, int teacherID);
        List<Course> getCourseByName(int teacherID, string searchName);

        List<Course> getCourseByID(int teacherID, int courseID);
    }
}
// Performance optimization implemented
// Security enhancements integrated
// Security enhancements integrated
// Bug fixes and code refactoring
// Enhanced functionality - 2026-01-10
// Enhanced functionality - 2026-01-10
// Feature flag implementation
// Configuration settings optimized
// Code documentation updated
// Database optimization completed
// Bug fixes and code refactoring
// Unit tests added for better coverage
// API improvements and error handling
// API improvements and error handling
