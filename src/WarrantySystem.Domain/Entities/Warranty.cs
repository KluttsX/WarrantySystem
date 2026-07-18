using WarrantySystem.Domain.Core;

namespace WarrantySystem.Domain.Entities
{
    public class Warranty : BaseEntity
    {
        public int ProductId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Status { get; set; } = string.Empty;
        public string TermsAndConditions { get; set; } = string.Empty;
        public Product? Product { get; set; }
        public ICollection<Claim> Claims { get; set; } = new List<Claim>();
    }
}