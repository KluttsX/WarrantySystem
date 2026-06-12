using Microsoft.AspNetCore.Mvc;
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
        public ActionResult<IEnumerable<Claim>> GetAll()
        {
            return Ok(_claims);
        }

        [HttpGet]
        [Route("{id}")]
        public ActionResult<Claim> GetById(int id)
        {
            var claim = _claims.FirstOrDefault(c => c.Id == id);
            if (claim == null)
            {
                return NotFound();
            }
            return Ok(claim);
        }

        [HttpPost]
        public ActionResult<Claim> Create(Claim claim)
        {
            claim.Id = _claims.Max(c => c.Id) + 1;
            claim.CreatedDate = DateTime.UtcNow;
            _claims.Add(claim);
            return CreatedAtAction(nameof(GetById), new { id = claim.Id }, claim);
        }

        [HttpPut]
        [Route("{id}")]
        public ActionResult Update(int id, Claim updatedClaim)
        {
            var claim = _claims.FirstOrDefault(c => c.Id == id);
            if (claim == null)
            {
                return NotFound();
            }
            claim.WarrantyId = updatedClaim.WarrantyId;
            claim.ClaimDate = updatedClaim.ClaimDate;
            claim.IssueDescription = updatedClaim.IssueDescription;
            claim.Status = updatedClaim.Status;
            claim.ResolutionDate = updatedClaim.ResolutionDate;
            claim.ResolutionDetails = updatedClaim.ResolutionDetails;
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
