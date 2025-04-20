using Microsoft.AspNetCore.Mvc;
using MediatR;
using IbanApi.Features.Auth;

namespace IbanApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IMediator _mediator;

        public AuthController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var token = await _mediator.Send(request);
            return Ok(new { token });
        }
        
    }
}
