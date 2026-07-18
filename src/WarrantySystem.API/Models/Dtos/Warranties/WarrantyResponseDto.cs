using WarrantySystem.API.Models.Dtos.Base;
using WarrantySystem.API.Models.Dtos.Claims;
using WarrantySystem.API.Models.Dtos.Products;

namespace WarrantySystem.API.Models.Dtos.Warranties
{
    public class WarrantyResponseDto : BaseDto
    {
        public int ProductId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Status { get; set; } = string.Empty;
        public string TermsAndConditions { get; set; } = string.Empty;
    }
}
