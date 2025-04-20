using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using IbanApi.Persistence.Entities;
using Microsoft.EntityFrameworkCore;

namespace IbanApi.Persistence
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) { }

        public DbSet<User> Users => Set<User>();
        public DbSet<IbanCode> IbanCodes => Set<IbanCode>();
        public DbSet<Role> Roles => Set<Role>();
        public DbSet<Raion> Raioane { get; set; }
        public DbSet<Localitate> Localitati { get; set; }
    }
}