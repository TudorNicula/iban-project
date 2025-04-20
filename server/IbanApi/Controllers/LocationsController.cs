using MediatR;
using Microsoft.AspNetCore.Mvc;
using IbanApi.Features.Locations.Queries;

[ApiController]
[Route("api/locations")]
public class LocationsController : ControllerBase
{
    private readonly IMediator _mediator;
    public LocationsController(IMediator mediator) => _mediator = mediator;

    [HttpGet("raioane")]
    public async Task<IActionResult> GetRaioane() =>
        Ok(await _mediator.Send(new GetRaioaneQuery()));

    [HttpGet("raioane/{raionId}/localitati")]
    public async Task<IActionResult> GetLocalitati(int raionId) =>
        Ok(await _mediator.Send(new GetLocalitatiByRaionQuery { RaionId = raionId }));

    /// <summary>
    /// Retrieves all localitati across all raioane.
    /// </summary>
    [HttpGet("localitati")]
    public async Task<IActionResult> GetAllLocalitati() =>
        Ok(await _mediator.Send(new GetAllLocalitatiQuery()));
}
