using FluentValidation;
using IbanApi.Features.Auth;

namespace IbanApi.Validators
{
    public class LoginValidator : AbstractValidator<LoginRequest>
    {
        public LoginValidator()
        {
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Emailul este obligatoriu.")
                .EmailAddress().WithMessage("Email invalid.");

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Parola este obligatorie.")
                .MinimumLength(6).WithMessage("Parola trebuie să aibă minim 6 caractere.");
        }
    }
}
