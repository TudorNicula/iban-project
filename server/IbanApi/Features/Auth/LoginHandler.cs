using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using IbanApi.Persistence;

namespace IbanApi.Features.Auth
{
    public class LoginHandler : IRequestHandler<LoginRequest, string>
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;

        public LoginHandler(AppDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        public async Task<string> Handle(LoginRequest request, CancellationToken cancellationToken)
        {
            var user = await _context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Email == request.Email, cancellationToken);
            Console.WriteLine($"[DEBUG] Email: {request.Email}");
            Console.WriteLine($"[DEBUG] Parola: {request.Password}");
            if (user == null)
            {
                Console.WriteLine("[DEBUG] User not found.");
                throw new UnauthorizedAccessException("Email sau parolă invalidă.");
            }

            Console.WriteLine($"[DEBUG] Hash in DB: {user.PasswordHash}");
            Console.WriteLine($"[DEBUG] Match: {BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash)}");

            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
                throw new UnauthorizedAccessException("Email sau parolă invalidă.");

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role.Name),
                new Claim("AssignedRaion", user.AssignedRaion ?? "")

            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.UtcNow.AddHours(8),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
