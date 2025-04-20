using IbanApi.Persistence;
using IbanApi.Persistence.Dto;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace IbanApi.Features.Users
{
    public class GetUsersHandler : IRequestHandler<GetUsersQuery, List<UserDto>>
    {
        private readonly AppDbContext _context;
        public GetUsersHandler(AppDbContext context) => _context = context;

        public async Task<List<UserDto>> Handle(GetUsersQuery request, CancellationToken cancellationToken)
        {
            return await _context.Users
                .Include(u => u.Role)
                .Select(u => new UserDto
                {
                    Id = u.Id,
                    FullName = u.FullName,
                    Email = u.Email,
                    Role = u.Role.Name,
                    AssignedRaion = u.AssignedRaion
                })
                .ToListAsync(cancellationToken);
        }
    }
}