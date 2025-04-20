using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IbanApi.Persistence.Entities
{
    public class User
    {
        public int Id { get; set; }

        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public int RoleId { get; set; }
        public Role Role { get; set; } = null!;
        public string? AssignedRaion { get; set; }
    }
}