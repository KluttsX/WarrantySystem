namespace WarrantySystem.API.Models.Dtos.Claims
{
    public class CreateClaimDto
    {
        public int WarrantyId { get; set; }
        public DateTime ClaimDate { get; set; }
        public string IssueDescription { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime? ResolutionDate { get; set; }
        public string? ResolutionDetails { get; set; }
    }
}
