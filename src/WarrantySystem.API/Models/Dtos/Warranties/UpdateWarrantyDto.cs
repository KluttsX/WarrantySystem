namespace WarrantySystem.API.Models.Dtos.Warranties
{
    public class UpdateWarrantyDto
    {
        public int ProductId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Status { get; set; } = string.Empty;
        public string TermsAndConditions { get; set; } = string.Empty;
    }
}
