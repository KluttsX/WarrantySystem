using Microsoft.AspNetCore.Mvc;
using WarrantySystem.API.Data;
using WarrantySystem.API.Models.Dtos.Claims;
using WarrantySystem.API.Models.Dtos.Warranties;
using WarrantySystem.API.Models.Entities;

namespace WarrantySystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClaimsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ClaimsController(ApplicationDbContext dbContext)
        {
            _context = dbContext;
        }

        [HttpGet]
        public ActionResult<IEnumerable<ClaimResponseDto>> GetAll()
        {
            var _claims = _context.Claims.ToList();

            var claimsDto = _claims.Select(request => new ClaimResponseDto
            {
                Id = request.Id,
                WarrantyId = request.WarrantyId,
                ClaimDate = request.ClaimDate,
                IssueDescription = request.IssueDescription,
                Status = request.Status,
                ResolutionDate = request.ResolutionDate,
                ResolutionDetails = request.ResolutionDetails,
                CreatedDate = request.CreatedDate,
                UpdatedDate = request.UpdatedDate
            });

            return Ok(claimsDto);
        }

        [HttpGet]
        [Route("{id}")]
        public ActionResult<Claim> GetById(int id)
        {

            var request = _context.Claims.
                FirstOrDefault(c => c.Id == id);

            if (request == null)
            {
                return NotFound();
            }

            var claimDto = new ClaimResponseDto
            {
                Id = request.Id,
                WarrantyId = request.WarrantyId,
                ClaimDate = request.ClaimDate,
                IssueDescription = request.IssueDescription,
                Status = request.Status,
                ResolutionDate = request.ResolutionDate,
                ResolutionDetails = request.ResolutionDetails,
                CreatedDate = request.CreatedDate,
                UpdatedDate = request.UpdatedDate
            };

            return Ok(claimDto);
        }

        [HttpPost]
        public ActionResult<int> Create(CreateClaimDto request)
        {
            var claim = new Claim
            {
                WarrantyId = request.WarrantyId,
                ClaimDate = request.ClaimDate,
                IssueDescription = request.IssueDescription,
                Status = request.Status,
                ResolutionDate = request.ResolutionDate,
                ResolutionDetails = request.ResolutionDetails,
                CreatedDate = DateTime.UtcNow
            };

            _context.Claims.Add(claim);
            _context.SaveChanges();

            return Ok(new { Id = claim.Id });
        }

        [HttpPut]
        [Route("{id}")]
        public ActionResult Update(int id, UpdateClaimDto request)
        {
            var claim = _context.Claims.FirstOrDefault(c => c.Id == id);

            if (claim == null)
            {
                return NotFound();
            }

            claim.WarrantyId = request.WarrantyId;
            claim.ClaimDate = request.ClaimDate;
            claim.IssueDescription = request.IssueDescription;
            claim.Status = request.Status;
            claim.ResolutionDate = request.ResolutionDate;
            claim.ResolutionDetails = request.ResolutionDetails;
            claim.UpdatedDate = DateTime.UtcNow;

            _context.Claims.Update(claim);
            _context.SaveChanges();

            return NoContent();
        }

        [HttpDelete]
        [Route("{id}")]
        public ActionResult Delete(int id)
        {
            var claim = _context.Claims.FirstOrDefault(c => c.Id == id);

            if (claim == null)
            {
                return NotFound();
            }

            _context.Claims.Remove(claim);
            _context.SaveChanges();

            return NoContent();
        }
    }
}
