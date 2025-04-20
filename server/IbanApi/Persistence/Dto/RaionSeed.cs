using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IbanApi.Persistence.Dto
{
    public class RaionSeed
    {
        public string Raion { get; set; } = null!;
        public List<string> Localitati { get; set; } = [];
    }
}