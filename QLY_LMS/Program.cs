using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using QLY_LMS.BLL.Admin_BLL.BLL_Implementations;
using QLY_LMS.BLL.Admin_BLL.BLL_Interfaces;
using QLY_LMS.BLL.Teacher_BLL.BLL_Implementations;
using QLY_LMS.BLL.Teacher_BLL.BLL_Interfaces;
using QLY_LMS.DAL.Admin.Implementations;
using QLY_LMS.DAL.Admin.Interfaces;
using QLY_LMS.DAL.Teacher_DAL.Implementations;
using QLY_LMS.DAL.Teacher_DAL.Interfaces;
using QLY_LMS.Data;
using System.Text;

namespace QLY_LMS
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // ===== ĐĂNG KÝ JWT AUTH CHO QLY_LMS API =====
            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,

                        ValidIssuer = "lms_api",
                        ValidAudience = "lms_user",
                        IssuerSigningKey = new SymmetricSecurityKey(
                            Encoding.UTF8.GetBytes("THIS_IS_SUPER_LONG_JWT_SECRET_KEY_1234567890"))   // 🔥 PHẢI GIỐNG AuthService + Gateway
                    };
                });

            builder.Services.AddAuthorization();

            // ===== ĐĂNG KÝ SERVICE + DAL =====
            builder.Services.AddScoped<DBConnect>();

            // BLL
            builder.Services.AddScoped<IUserBLL, UserBLL>();
            builder.Services.AddScoped<I_BLL_ManageCourse, BLL_ManageCourse>();
            builder.Services.AddScoped<I_BLL_ManageVideoCourse, BLL_ManageVideoCourse>();

            // DAL
            builder.Services.AddScoped<IUserDAL, UserDAL>();
            builder.Services.AddScoped<I_DAL_ManageCourse, DAL_ManageCourse>();
            builder.Services.AddScoped<I_DAL_ManageVideoCourse, DAL_ManageVideoCourse>();

            // CONTROLLER + SWAGGER
            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            // ====  BẬT AUTHENTICATION TRƯỚC AUTHORIZATION ====
            app.UseAuthentication();
            app.UseAuthorization();
            app.UseMiddleware<UserContextMiddleware>();
            app.UseMiddleware<TeacherCourseAuthorizationMiddleware>();

            app.MapControllers();

            app.Run();
        }
    }
}
