using MediatR;

namespace IbanApi.Features.Iban
{
    public class DeleteIbanCommand : IRequest
    {
        public int Id { get; set; }
    }
}
