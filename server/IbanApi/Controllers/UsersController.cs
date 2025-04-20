using IbanApi.Features.Users;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using IbanApi.Persistence.Dto;

namespace IbanApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize(Roles = "Admin")]
    public class UsersController : ControllerBase
    {
        private readonly IMediator _mediator;
        public UsersController(IMediator mediator) => _mediator = mediator;

        [HttpGet]
        public async Task<ActionResult<List<UserDto>>> Get() =>
            Ok(await _mediator.Send(new GetUsersQuery()));

        [HttpPost]
        public async Task<ActionResult> Create([FromBody] CreateUserCommand cmd)
        {
            var id = await _mediator.Send(cmd);
            return CreatedAtAction(nameof(Get), new { id }, new { id });
        }
    }
}
