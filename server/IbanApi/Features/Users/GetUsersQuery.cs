using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using IbanApi.Persistence.Dto;
using MediatR;

namespace IbanApi.Features.Users
{
    public class GetUsersQuery : IRequest<List<UserDto>> {}
}