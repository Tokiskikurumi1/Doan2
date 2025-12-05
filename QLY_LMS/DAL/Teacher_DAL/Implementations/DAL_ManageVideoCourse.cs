using QLY_LMS.DAL.Teacher_DAL.Interfaces;
using QLY_LMS.Data;
using QLY_LMS.Models.MTeacher;
using System.Data.SqlClient;
using System.Data;
using System.Security.Cryptography;

namespace QLY_LMS.DAL.Teacher_DAL.Implementations
{
    public class DAL_ManageVideoCourse : I_DAL_ManageVideoCourse
    {
        private readonly DBConnect _db;
        public DAL_ManageVideoCourse(DBConnect db)
        {
            _db = db;
        }
        public bool createVideo(Video_course video)
        {
            using (var conn = _db.GetConnection())
            {
                using (var cmd = new SqlCommand("tc_video_create", conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@courseID", video.courseID);
                    cmd.Parameters.AddWithValue("@videoName", video.videoName);
                    cmd.Parameters.AddWithValue("@videoURL", video.videoURL);
                    cmd.Parameters.AddWithValue("@videoProgress", video.videoProgress);


                    conn.Open();
                    cmd.ExecuteNonQuery();

                    return true;
                }
            }
            throw new NotImplementedException();
        }

        public bool deleteVideo(Video_course video)
        {
            throw new NotImplementedException();
        }

        public List<Video_course> getAllVideo(int CId)
        {
            var videoList = new List<Video_course>();

            using (SqlConnection conn = _db.GetConnection())
            {
                using (SqlCommand cmd = new SqlCommand("tc_video_getAll", conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@CId", CId);

                    conn.Open();
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            videoList.Add(new Video_course
                            {
                                videoID = reader.GetInt32("videoID"),
                                courseID = reader.GetInt32("courseID"),
                                videoName = reader.GetString("videoName"),
                                videoURL = reader.GetString("videoURL"),
                                videoProgress = reader.GetString("videoProgress")
                            });
                        }
                    }
                }
            }
            return videoList;
        }

        public bool updateVideo(Video_course video)
        {
            throw new NotImplementedException();
        }
    }
}
