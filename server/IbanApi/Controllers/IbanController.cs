using System.Security.Claims;
using IbanApi.Features.Iban;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IbanApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class IbanController : ControllerBase
    {
        private readonly IMediator _mediator;

        public IbanController(IMediator mediator)
        {
            _mediator = mediator;
        }
        [HttpGet]
        [Authorize(Roles = "Admin,Operator,OperatorRaion")]

        public async Task<IActionResult> GetIbans(
            [FromQuery] int? year,
            [FromQuery] string? codEco,
            [FromQuery] string? raion,
            [FromQuery] string? localitate)
        {
            var role = User.FindFirst(ClaimTypes.Role)?.Value;
            var assignedRaion = User.FindFirst("AssignedRaion")?.Value;

            var query = new GetIbanQuery
            {
                Year = year,
                CodEco = codEco,
                Raion = raion,
                Localitate = localitate,
                CurrentUserRole = role,
                CurrentUserRaion = assignedRaion
            };

            var result = await _mediator.Send(query);
            return Ok(result);
        }

        [HttpPost]
        [Authorize(Roles = "Admin,Operator")]

        public async Task<IActionResult> CreateIban([FromBody] CreateIbanCommand command)
        {
            command.CreatedBy = User.Identity?.Name ?? "unknown";
            var id = await _mediator.Send(command);
            return CreatedAtAction(nameof(GetIbans), new { id }, new { id });
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Operator")]

        public async Task<IActionResult> UpdateIban(int id, [FromBody] UpdateIbanCommand command)
        {
            if (id != command.Id)
                return BadRequest("ID mismatch.");

            await _mediator.Send(command);
            return NoContent();
        }
        
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin,Operator")]

        public async Task<IActionResult> DeleteIban(int id)
        {
            await _mediator.Send(new DeleteIbanCommand { Id = id });
            return NoContent();
        }


    }
}
