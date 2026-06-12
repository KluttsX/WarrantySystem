using Microsoft.AspNetCore.Mvc;
using WarrantySystem.API.Models.Dtos.Claims;
using WarrantySystem.API.Models.Dtos.Warranties;
using WarrantySystem.API.Models.Entities;

namespace WarrantySystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClaimsController : ControllerBase
    {
        public static List<Claim> _claims = new List<Claim>
        {
            new Claim { Id = 1, WarrantyId = 1, ClaimDate = DateTime.UtcNow, IssueDescription = "Issue 1", Status = "Open", CreatedDate = DateTime.UtcNow },
            new Claim { Id = 2, WarrantyId = 2, ClaimDate = DateTime.UtcNow, IssueDescription = "Issue 2", Status = "In Progress", CreatedDate = DateTime.UtcNow },
            new Claim { Id = 3, WarrantyId = 3, ClaimDate = DateTime.UtcNow, IssueDescription = "Issue 3", Status = "Closed", CreatedDate = DateTime.UtcNow }
        };

        [HttpGet]
        public ActionResult<IEnumerable<ClaimResponseDto>> GetAll()
        {
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

            var request = _claims.FirstOrDefault(c => c.Id == id);

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
        public ActionResult Create(CreateClaimDto request)
        {
            var claim = new Claim
            {
                WarrantyId = request.WarrantyId,
                ClaimDate = request.ClaimDate,
                IssueDescription = request.IssueDescription,
                Status = request.Status,
                ResolutionDate = request.ResolutionDate,
                ResolutionDetails = request.ResolutionDetails
            };
            claim.Id = _claims.Max(c => c.Id) + 1;
            claim.CreatedDate = DateTime.UtcNow;
            _claims.Add(claim);
            return CreatedAtAction(nameof(GetById), new { id = claim.Id }, claim);
        }

        [HttpPut]
        [Route("{id}")]
        public ActionResult Update(int id, UpdateClaimDto request)
        {
            var claim = _claims.FirstOrDefault(c => c.Id == id);
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
            return NoContent();
        }

        [HttpDelete]
        [Route("{id}")]
        public ActionResult Delete(int id)
        {
            var claim = _claims.FirstOrDefault(c => c.Id == id);
            if (claim == null)
            {
                return NotFound();
            }
            _claims.Remove(claim);
            return NoContent();
        }
    }
}
