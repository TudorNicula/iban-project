using MediatR;
using Microsoft.EntityFrameworkCore;
using IbanApi.Persistence;
using IbanApi.Persistence.Entities;
using IbanApi.Features.Locations.Queries;

namespace IbanApi.Features.Locations.Handlers
{
    public class GetLocalitatiByRaionHandler : IRequestHandler<GetLocalitatiByRaionQuery, List<Localitate>>
    {
        private readonly AppDbContext _db;
        public GetLocalitatiByRaionHandler(AppDbContext db) => _db = db;

        public async Task<List<Localitate>> Handle(GetLocalitatiByRaionQuery req, CancellationToken ct) =>
            await _db.Localitati
                     .Where(l => l.RaionId == req.RaionId)
                     .OrderBy(l => l.Name)
                     .ToListAsync(ct);
    }
}