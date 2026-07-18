using Microsoft.AspNetCore.Mvc;
using WarrantySystem.API.Data;
using WarrantySystem.API.Models.Dtos.Claims;
using WarrantySystem.API.Models.Dtos.Warranties;
using WarrantySystem.API.Models.Entities;

namespace WarrantySystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClaimsController : BaseController
    {

        public ClaimsController(ApplicationDbContext dataContext) : base(dataContext)
        {
        }

        [HttpGet]
        public ActionResult<IEnumerable<ClaimResponseDto>> GetAll()
        {
            var _claims = Context.Claims.ToList();

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
        public ActionResult<ClaimResponseDto> GetById(int id)
        {

            var request = Context.Claims.
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

            Context.Claims.Add(claim);
            Context.SaveChanges();

            return Ok(new { Id = claim.Id });
        }

        [HttpPut]
        [Route("{id}")]
        public ActionResult Update(int id, UpdateClaimDto request)
        {
            var claim = Context.Claims.FirstOrDefault(c => c.Id == id);

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

            Context.Claims.Update(claim);
            Context.SaveChanges();

            return NoContent();
        }

        [HttpDelete]
        [Route("{id}")]
        public ActionResult Delete(int id)
        {
            var claim = Context.Claims.FirstOrDefault(c => c.Id == id);

            if (claim == null)
            {
                return NotFound();
            }

            Context.Claims.Remove(claim);
            Context.SaveChanges();

            return NoContent();
        }
    }
}
