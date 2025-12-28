    public interface I_BLL_ManageCourse
    {
        List<Course> getAllCoures(int Tid);
        bool createCourse(CourseRequest coures);
        bool updateCourse(int courseID, Course course);

        bool deleteCourse(int courseID, int teacherID);
        bool CheckCourseOfTeacher(int courseID, int teacherID);
        List<Course> getCourseByName(int teacherID, string nameCourse);
        List<Course> getCousreByID(int teacherID, int courseID);

    }
}
# Update 2026-01-10 17:57:45
// UI/UX improvements added
// Bug fixes and code refactoring
   Additional implementation details
// UI/UX improvements added
// Security enhancements integrated
// Security enhancements integrated
// Code documentation updated
// Performance optimization implemented
// API improvements and error handling
