using IbanApi.Persistence;
using IbanApi.Persistence.Entities;
using MediatR;

namespace IbanApi.Features.Iban
{
    public class CreateIbanHandler : IRequestHandler<CreateIbanCommand, int>
    {
        private readonly AppDbContext _context;

        public CreateIbanHandler(AppDbContext context)
        {
            _context = context;
        }

        public async Task<int> Handle(CreateIbanCommand request, CancellationToken cancellationToken)
        {
            var entity = new IbanCode
            {
                Iban = request.Iban,
                Year = request.Year,
                CodEco = request.CodEco,
                Raion = request.Raion,
                Localitate = request.Localitate,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = request.CreatedBy
            };

            _context.IbanCodes.Add(entity);
            await _context.SaveChangesAsync(cancellationToken);

            return entity.Id;
        }
    }
}
