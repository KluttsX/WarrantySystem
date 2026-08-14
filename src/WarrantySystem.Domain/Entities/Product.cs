using WarrantySystem.Domain.Core;

namespace WarrantySystem.Domain.Entities
{
    public class Product : BaseEntity
    {
        public int? ClientId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string SerialNumber { get; set; } = string.Empty;
        public string Brand { get; set; } = string.Empty;
        public string Model { get; set; } = string.Empty;
        public DateTime? PurchaseDate { get; set; }
        public Client? Client { get; set; }
        public ICollection<Warranty> Warranties { get; set; } = new List<Warranty>();
    }
}