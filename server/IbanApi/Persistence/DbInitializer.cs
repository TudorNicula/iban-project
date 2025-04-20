using IbanApi.Persistence.Entities;

namespace IbanApi.Persistence
{
    public static class DbInitializer
    {
        public static void SeedAdmin(AppDbContext context)
        {
            
            if (!context.Roles.Any())
            {
                context.Roles.AddRange(
                    new Role { Name = "Admin" },
                    new Role { Name = "Operator" },
                    new Role { Name = "OperatorRaion" }

                );
                context.SaveChanges();
                Console.WriteLine("[SEED] Roles created ✅");
            }

            
            if (!context.Users.Any(u => u.Email == "admin@example.com"))
            {
                var adminRoleId = context.Roles.First(r => r.Name == "Admin").Id;
                var admin = new User
                {
                    FullName = "Admin User",
                    Email = "admin@example.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("parola123"),
                    RoleId = adminRoleId,
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
