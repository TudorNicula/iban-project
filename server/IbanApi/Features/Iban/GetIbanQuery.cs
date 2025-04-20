using IbanApi.Persistence.Entities;
using MediatR;

namespace IbanApi.Features.Iban
{
    public class GetIbanQuery : IRequest<List<IbanCode>>
    {
        public int? Year { get; set; }
        public string? CodEco { get; set; }
        public string? Raion { get; set; }
        public string? Localitate { get; set; }
        public string? CurrentUserRole { get; set; }
        public string? CurrentUserRaion { get; set; }
    }
}