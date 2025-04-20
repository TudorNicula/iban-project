using FluentValidation;
using IbanApi.Features.Iban;

namespace IbanApi.Validators
{
    public class IbanValidator : AbstractValidator<CreateIbanCommand>
    {
        public IbanValidator()
        {
            RuleFor(x => x.Iban)
                .Length(24).WithMessage("IBAN-ul trebuie să conțină exact 24 caractere.")
                .Must(x => x.StartsWith("MD")).WithMessage("IBAN-ul trebuie să înceapă cu 'MD'")
                .Matches(@"^MD[A-Z0-9]{8}[0-9]{14}$")
                .WithMessage("Structura IBAN-ului nu este corectă: ultimele 14 caractere trebuie să fie cifre și orice literă trebuie să fie uppercase.");

            RuleFor(x => x.Year).GreaterThan(2000);
            RuleFor(x => x.CodEco).NotEmpty();
            RuleFor(x => x.Raion).NotEmpty();
            RuleFor(x => x.Localitate).NotEmpty();
        }
    }
}
