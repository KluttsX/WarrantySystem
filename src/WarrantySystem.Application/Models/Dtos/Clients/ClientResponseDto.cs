using WarrantySystem.Application.Models.Dtos.Base;
using WarrantySystem.Application.Models.Dtos.Products;

namespace WarrantySystem.Application.Models.Dtos.Clients
{
    public class ClientResponseDto : BaseDto
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; }
        public string? Address { get; set; }
    }
}
