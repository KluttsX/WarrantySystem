using Microsoft.EntityFrameworkCore;
using WarrantySystem.Domain.Entities;
using WarrantySystem.Infraestructure.Context;

namespace WarrantySystem.Infraestructure.Repositories
{
    public class ClaimRepository
    {
        private readonly ApplicationDbContext _context;

        public ClaimRepository(ApplicationDbContext dataContext)
        {
            _context = dataContext;
        }

        public IEnumerable<Claim> GetAll()
        {
            var _claims = _context.Claims.ToList();

            return _claims;
        }

        public Claim GetById(int id)
        {
            var claim = _context.Claims.FirstOrDefault(c => c.Id == id);

            return claim;
        }

        public int Create(Claim claim)
        {
            _context.Claims.Add(claim);

            return claim.Id;
        }

        public void Update(int id, Claim request)
        {
            var claim = _context.Claims.FirstOrDefault(c => c.Id == id);

            claim.WarrantyId = request.WarrantyId;
            claim.ClaimDate = request.ClaimDate;
            claim.IssueDescription = request.IssueDescription;
            claim.Status = request.Status;
            claim.ResolutionDate = request.ResolutionDate;
            claim.ResolutionDetails = request.ResolutionDetails;
            claim.UpdatedDate = DateTime.UtcNow;

            _context.Claims.Update(claim);
        }

        public void Update(Claim claim)
        {
            _context.Claims.Update(claim);
        }

        public void Delete(int id)
        {
            var claim = _context.Claims.FirstOrDefault(c => c.Id == id);

            _context.Claims.Remove(claim);
        }

        public void Delete(Claim claim)
        {
            _context.Claims.Remove(claim);
        }
    }
}
