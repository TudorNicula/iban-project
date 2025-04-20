using IbanApi.Persistence.Entities;
using MediatR;

namespace IbanApi.Features.Locations.Queries
{
    
    
    
    public class GetAllLocalitatiQuery : IRequest<List<Localitate>>
    {
    }
}