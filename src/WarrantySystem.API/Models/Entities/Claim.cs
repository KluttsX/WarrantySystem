namespace WarrantySystem.API.Models.Entities
{
    public class Claim
    {
        public int Id { get; set; }
        public int WarrantyId { get; set; }
        public DateTime ClaimDate { get; set; }
        public string IssueDescription { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime? ResolutionDate { get; set; }
        public string? ResolutionDetails { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }

    }
}
