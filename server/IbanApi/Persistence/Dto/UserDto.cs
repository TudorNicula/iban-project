using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IbanApi.Persistence.Dto
{
    public class UserDto
    {
        public int Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string? AssignedRaion { get; set; }
    }
}