using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IbanApi.Persistence.Entities
{
    public class IbanCode
    {
        public int Id { get; set; }
        public string Iban { get; set; } = string.Empty;
        public int Year { get; set; }                 
        public string CodEco { get; set; } = string.Empty;
        public string Raion { get; set; } = string.Empty;
        public string Localitate { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string CreatedBy { get; set; } = string.Empty;
    }
}