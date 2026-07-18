using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using WarrantySystem.API.Data;
using WarrantySystem.API.Models.Dtos.Claims;
using WarrantySystem.API.Models.Dtos.Warranties;
using WarrantySystem.API.Models.Entities;
using WarrantySystem.API.Models.Responses;

namespace WarrantySystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClaimsController : BaseController
    {

        public ClaimsController(ApplicationDbContext dataContext, IMapper mapper) : base(dataContext, mapper)
        {
        }

        [HttpGet]
        public ApiResponse<IEnumerable<ClaimResponseDto>> GetAll()
        {
            var _claims = Context.Claims.ToList();

            return ApiResponse<IEnumerable<ClaimResponseDto>>
                .SuccessResponse(Mapper.Map<List<ClaimResponseDto>>(_claims));
        }

        [HttpGet]
        [Route("{id}")]
        public ApiResponse<ClaimResponseDto> GetById(int id)
        {
            var request = Context.Claims.FirstOrDefault(c => c.Id == id);

            if (request == null)
            {
                return ApiResponse<ClaimResponseDto>.FailureResponse("Claim not found", 404);
            }


            return ApiResponse<ClaimResponseDto>
                .SuccessResponse(Mapper.Map<ClaimResponseDto>(request));
        }

        [HttpPost]
        public ApiResponse<int> Create(CreateClaimDto request)
        {
            var claim = Mapper.Map<Claim>(request);

            Context.Claims.Add(claim);
            Context.SaveChanges();

            return ApiResponse<int>.SuccessResponse(claim.Id);
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
