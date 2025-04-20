using MediatR;
using Microsoft.EntityFrameworkCore;
using IbanApi.Persistence;
using IbanApi.Persistence.Entities;
using IbanApi.Features.Locations.Queries;

namespace IbanApi.Features.Locations.Handlers
{
    public class GetRaioaneHandler : IRequestHandler<GetRaioaneQuery, List<Raion>>
    {
        private readonly AppDbContext _db;
        public GetRaioaneHandler(AppDbContext db) => _db = db;

        public async Task<List<Raion>> Handle(GetRaioaneQuery req, CancellationToken ct) =>
            await _db.Raioane.OrderBy(r => r.Name).ToListAsync(ct);
    }
}