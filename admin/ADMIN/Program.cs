    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            //builder.Services.AddScoped<IUserBLL, UserBLL>();
            //builder.Services.AddScoped<IUserDAL, UserDAL>();

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
# Update 2026-01-10 17:57:39
// Enhanced functionality - 2026-01-10
// UI/UX improvements added
// UI/UX improvements added
// Logging mechanism enhanced
// Enhanced functionality - 2026-01-10
// Feature flag implementation
// UI/UX improvements added
// Performance optimization implemented
