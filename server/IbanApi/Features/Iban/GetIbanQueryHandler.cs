using IbanApi.Persistence;
using IbanApi.Persistence.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace IbanApi.Features.Iban
{
    public class GetIbanQueryHandler : IRequestHandler<GetIbanQuery, List<IbanCode>>
    {
        private readonly AppDbContext _context;

        public GetIbanQueryHandler(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<IbanCode>> Handle(GetIbanQuery request, CancellationToken cancellationToken)
        {
            var query = _context.IbanCodes.AsQueryable();

            if (request.Year.HasValue)
                query = query.Where(i => i.Year == request.Year.Value);

            if (!string.IsNullOrWhiteSpace(request.CodEco))
                query = query.Where(i => i.CodEco == request.CodEco);

            if (!string.IsNullOrWhiteSpace(request.Localitate))
                query = query.Where(i => i.Localitate == request.Localitate);

            if (request.CurrentUserRole == "OperatorRaion")
            {
                query = query.Where(i => i.Raion == request.CurrentUserRaion);
            }
            else if (!string.IsNullOrWhiteSpace(request.Raion))
            {
                query = query.Where(i => i.Raion == request.Raion);
            }

            return await query.ToListAsync(cancellationToken);
        }
    }
}
