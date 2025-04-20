using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using IbanApi.Persistence.Entities;
using MediatR;

namespace IbanApi.Features.Locations.Queries
{
    public class GetRaioaneQuery : IRequest<List<Raion>> { }
}