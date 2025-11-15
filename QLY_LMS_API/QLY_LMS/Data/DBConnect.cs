using System;
using System.Data.SqlClient;

namespace QLY_LMS.Data
{
    public class DBConnect
    {
        //private string Conn = @"Data Source=KURUMI\KURUMI;Initial Catalog=QUAN_LY_ENGLISH;Persist Security Info=True;User ID=sa;Password=Tokisakikurumi1@;";
        private string Conn = @"Data Source=KURUMI\KURUMI;Initial Catalog=LMS;Persist Security Info=True;User ID=sa;Password=Tokisakikurumi1@;";

        public SqlConnection GetConnection()
        {
            return new SqlConnection(Conn);
        }
    }
}


# API improvements
# Security enhancements
# Feature enhancement 2026-01-10 18:02:39
# Security enhancements
