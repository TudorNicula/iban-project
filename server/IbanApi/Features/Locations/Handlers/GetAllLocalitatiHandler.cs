using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.EntityFrameworkCore;
using IbanApi.Persistence;
using IbanApi.Persistence.Entities;
using IbanApi.Features.Locations.Queries;

namespace IbanApi.Features.Locations.Handlers
{
    
    
    
    public class GetAllLocalitatiHandler : IRequestHandler<GetAllLocalitatiQuery, List<Localitate>>
    {
        private readonly AppDbContext _db;
        public GetAllLocalitatiHandler(AppDbContext db) => _db = db;

        public async Task<List<Localitate>> Handle(GetAllLocalitatiQuery request, CancellationToken cancellationToken)
        {
            return await _db.Localitati
                            .OrderBy(l => l.Name)
                            .ToListAsync(cancellationToken);
        }
    }
}