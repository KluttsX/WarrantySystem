using Microsoft.EntityFrameworkCore;
using WarrantySystem.API.Models.Entities;

namespace WarrantySystem.API.Data
{
    public class ApplicationDbContext : DbContext
    {

        public ApplicationDbContext(DbContextOptions options) : base(options)
        {          
        }

        public DbSet<Client> Clients { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Warranty> Warranties { get; set; }
        public DbSet<Claim> Claims { get; set; }
    }
}
