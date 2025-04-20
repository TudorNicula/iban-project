using IbanApi.Persistence.Entities;
using MediatR;

namespace IbanApi.Features.Locations.Queries
{
    /// <summary>
    /// Request to retrieve all localitati (regardless of raion).
    /// </summary>
    public class GetAllLocalitatiQuery : IRequest<List<Localitate>>
    {
    }
}