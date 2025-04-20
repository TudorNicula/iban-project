using IbanApi.Persistence.Entities;

namespace IbanApi.Persistence
{
    public static class DbInitializer
    {
        public static void SeedAdmin(AppDbContext context)
        {
            if (!context.Users.Any(u => u.Email == "admin@example.com"))
            {
                var admin = new User
                {
                    FullName = "Admin User",
                    Email = "admin@example.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("parola123"),
                    RoleId = 1,
                    AssignedRaion = null
                };

                context.Users.Add(admin);
                context.SaveChanges();
                Console.WriteLine("[SEED] Admin user created ✅");
            }
            else
            {
                Console.WriteLine("[SEED] Admin user already exists ✅");
            }
        }
    }
}
