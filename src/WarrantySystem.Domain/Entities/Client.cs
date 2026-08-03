using WarrantySystem.Domain.Core;

namespace WarrantySystem.Domain.Entities
{
    public class Client : BaseEntity
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; }
        public string? Address { get; set; }
        public ICollection<Product> Products { get; set; } = new List<Product>();
    }
}