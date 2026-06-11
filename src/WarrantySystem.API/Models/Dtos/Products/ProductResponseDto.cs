namespace WarrantySystem.API.Models.Dtos.Products
{
    public class ProductResponseDto
    {
        public int Id { get; set; }

        public string? ClientId { get; set; }
        public string Name { get; set; } = string.Empty;

        public string SerialNumber { get; set; } = string.Empty;

        public string Brand { get; set; } = string.Empty;

        public string Model { get; set; } = string.Empty;

        public DateTime? PurchaseDate { get; set; }

        public DateTime CreatedDate { get; set; }

        public DateTime? UpdatedDate { get; set; }
    }
}
