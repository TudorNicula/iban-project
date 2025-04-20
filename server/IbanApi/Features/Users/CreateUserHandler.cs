using IbanApi.Persistence;
using IbanApi.Persistence.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace IbanApi.Features.Users
{
    public class CreateUserHandler : IRequestHandler<CreateUserCommand, int>
    {
        private readonly AppDbContext _context;
        public CreateUserHandler(AppDbContext context) => _context = context;

        public async Task<int> Handle(CreateUserCommand request, CancellationToken cancellationToken)
        {
            // Check unique email
            if (await _context.Users.AnyAsync(u => u.Email == request.Email, cancellationToken))
                throw new System.Exception("Email deja existent.");

            var roleEntity = await _context.Roles
                .FirstOrDefaultAsync(r => r.Name == request.Role, cancellationToken)
                ?? throw new KeyNotFoundException("Rol invalid.");

            var user = new User
            {
                FullName = request.FullName,
                Email = request.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                RoleId = roleEntity.Id,
                AssignedRaion = request.Role == "OperatorRaion" ? request.AssignedRaion : null
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync(cancellationToken);
            return user.Id;
        }
    }
}