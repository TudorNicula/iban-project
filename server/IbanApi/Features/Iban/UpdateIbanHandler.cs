using IbanApi.Persistence;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace IbanApi.Features.Iban
{
    public class UpdateIbanHandler : IRequestHandler<UpdateIbanCommand>
    {
        private readonly AppDbContext _context;

        public UpdateIbanHandler(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Unit> Handle(UpdateIbanCommand request, CancellationToken cancellationToken)
        {
            var iban = await _context.IbanCodes
                .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);

            if (iban == null)
                throw new KeyNotFoundException("IBAN not found.");

            iban.Iban = request.Iban;
            iban.Year = request.Year;
            iban.CodEco = request.CodEco;
            iban.Raion = request.Raion;
            iban.Localitate = request.Localitate;

            await _context.SaveChangesAsync(cancellationToken);
            return Unit.Value;
        }
    }
}
