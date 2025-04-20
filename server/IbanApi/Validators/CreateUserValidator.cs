using FluentValidation;
using IbanApi.Features.Users;

namespace IbanApi.Validators
{
    public class CreateUserValidator : AbstractValidator<CreateUserCommand>
    {
        public CreateUserValidator()
        {
            RuleFor(x => x.FullName).NotEmpty();
            RuleFor(x => x.Email).NotEmpty().EmailAddress();
            RuleFor(x => x.Password).NotEmpty().MinimumLength(6);
            RuleFor(x => x.Role).NotEmpty().Must(r => new[] { "Admin", "Operator", "OperatorRaion" }.Contains(r))
                .WithMessage("Rol invalid.");
            When(x => x.Role == "OperatorRaion", () =>
                RuleFor(x => x.AssignedRaion).NotEmpty()
            );
        }
    }
}
