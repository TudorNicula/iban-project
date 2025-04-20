using IbanApi.Persistence;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace IbanApi.Features.Iban
{
    public class DeleteIbanHandler : IRequestHandler<DeleteIbanCommand>
    {
        private readonly AppDbContext _context;

        public DeleteIbanHandler(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Unit> Handle(DeleteIbanCommand request, CancellationToken cancellationToken)
        {
            var iban = await _context.IbanCodes
                .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);

            if (iban == null)
                throw new KeyNotFoundException("IBAN not found.");

            _context.IbanCodes.Remove(iban);
            await _context.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}
