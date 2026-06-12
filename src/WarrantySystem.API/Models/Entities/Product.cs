namespace WarrantySystem.API.Models.Entities
{
    public class Product
    {
        public int Id { get; set; }
        public int? ClientId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string SerialNumber { get; set; } = string.Empty;
        public string Brand { get; set; } = string.Empty;
        public string Model { get; set; } = string.Empty;
        public DateTime? PurchaseDate { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public Client? Client { get; set; }
        public ICollection<Warranty> Warranties { get; set; } = new List<Warranty>();
    }
}
