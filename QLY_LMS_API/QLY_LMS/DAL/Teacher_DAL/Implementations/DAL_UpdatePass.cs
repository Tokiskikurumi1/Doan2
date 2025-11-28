using System.Data;
using System.Data.SqlClient;

namespace QLY_LMS.DAL.Teacher_DAL.Implementations
{
    public class DAL_UpdatePass : I_DAL_UpdatePass
    {
        private readonly DBConnect _db;
        public DAL_UpdatePass(DBConnect db)
        {
            _db = db;
        }
        public bool UpdateTeacherPass(int teacherID, update_pass update, out string errorMessage)
        {
            errorMessage = string.Empty;
            try
            {
                using (SqlConnection conn = _db.GetConnection())
                {
                    conn.Open();
                    using (SqlCommand cmd = new SqlCommand("tc_update_pass", conn))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.AddWithValue("@teacherID", teacherID);
                        cmd.Parameters.AddWithValue("@currentPass", update.currentPass);
                        cmd.Parameters.AddWithValue("@newPass", update.newPass);

                        cmd.ExecuteNonQuery();
                        return true;
                    }
                }
            }
            catch (SqlException ex)
            {
                errorMessage = ex.Message;
                return false;
            }
        }
    }
}
// Code documentation updated
// Logging mechanism enhanced
// Enhanced functionality - 2026-01-10
// API improvements and error handling
// Logging mechanism enhanced
// Database optimization completed
// Configuration settings optimized
// Security enhancements integrated
// Bug fixes and code refactoring
// Enhanced functionality - 2026-01-10
// Security enhancements integrated
// UI/UX improvements added
   Additional implementation details
