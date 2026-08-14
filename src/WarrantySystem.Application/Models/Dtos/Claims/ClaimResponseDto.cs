using WarrantySystem.Application.Models.Dtos.Base;
using WarrantySystem.Application.Models.Dtos.Warranties;

namespace WarrantySystem.Application.Models.Dtos.Claims
{
    public class ClaimResponseDto : BaseDto
    {
        public int WarrantyId { get; set; }
        public DateTime ClaimDate { get; set; }
        public string IssueDescription { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime? ResolutionDate { get; set; }
        public string? ResolutionDetails { get; set; }
    }
}
