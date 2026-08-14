using WarrantySystem.Domain.Core;

namespace WarrantySystem.Domain.Entities
{
    public class Claim : BaseEntity
    {
        public int WarrantyId { get; set; }
        public DateTime ClaimDate { get; set; }
        public string IssueDescription { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime? ResolutionDate { get; set; }
        public string? ResolutionDetails { get; set; }
        public Warranty? Warranty { get; set; }
    }
}