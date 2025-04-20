using IbanApi.Persistence.Entities;
using MediatR;

namespace IbanApi.Features.Locations.Queries
{
    public class GetLocalitatiByRaionQuery : IRequest<List<Localitate>>
    {
        public int RaionId { get; set; }
    }
}