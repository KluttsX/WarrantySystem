namespace WarrantySystem.API.Models.Entities
{
    public class Warranty
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Status { get; set; } = string.Empty;
        public string TermsAndConditions { get; set; } = string.Empty;
        public DateTime CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public Product? Product { get; set; }
        public ICollection<Claim> Claims { get; set; } = new List<Claim>();
    }
}
