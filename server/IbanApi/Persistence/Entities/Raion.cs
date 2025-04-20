using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IbanApi.Persistence.Entities
{
    public class Raion
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;

        // one‑to‑many: a raion has many localitati
        public ICollection<Localitate> Localitati { get; set; } = new List<Localitate>();
    }
}