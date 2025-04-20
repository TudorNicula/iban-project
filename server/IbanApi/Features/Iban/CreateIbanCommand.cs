using MediatR;

namespace IbanApi.Features.Iban
{
    public class CreateIbanCommand : IRequest<int>
    {
        public string Iban { get; set; } = string.Empty;
        public int Year { get; set; }
        public string CodEco { get; set; } = string.Empty;
        public string Raion { get; set; } = string.Empty;
        public string Localitate { get; set; } = string.Empty;
        public string CreatedBy { get; set; } = string.Empty;
    }
}
