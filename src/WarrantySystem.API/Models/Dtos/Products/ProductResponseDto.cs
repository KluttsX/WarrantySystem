using WarrantySystem.API.Models.Dtos.Base;
using WarrantySystem.API.Models.Dtos.Clients;
using WarrantySystem.API.Models.Dtos.Warranties;

namespace WarrantySystem.API.Models.Dtos.Products
{
    public class ProductResponseDto : BaseDto
    {
        public int? ClientId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string SerialNumber { get; set; } = string.Empty;
        public string Brand { get; set; } = string.Empty;
        public string Model { get; set; } = string.Empty;
        public DateTime? PurchaseDate { get; set; }
    }
}
