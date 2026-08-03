using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using WarrantySystem.Infraestructure.Context;
using WarrantySystem.API.Models.Dtos.Claims;
using WarrantySystem.API.Models.Responses;
using WarrantySystem.Domain.Entities;
using WarrantySystem.Infraestructure.Repositories;

namespace WarrantySystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClaimsController : BaseController
    {
        private readonly UnitOfWork _unitOfWork;

        public ClaimsController(IMapper mapper, 
            UnitOfWork unitOfWork
            ) : base(mapper)
        {
            this._unitOfWork = unitOfWork;
        }

        [HttpGet]
        public ApiResponse<IEnumerable<ClaimResponseDto>> GetAll()
        {
            var _claims = _unitOfWork.Claim.GetAll();

            return ApiResponse<IEnumerable<ClaimResponseDto>>
                .SuccessResponse(Mapper.Map<List<ClaimResponseDto>>(_claims));
        }

        [HttpGet]
        [Route("{id}")]
        public ApiResponse<ClaimResponseDto> GetById(int id)
        {
            var request = _unitOfWork.Claim.GetById(id);

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

            _unitOfWork.Claim.Create(claim);
            _unitOfWork.Complete();

            return ApiResponse<int>.SuccessResponse(claim.Id);
        }

        [HttpPut]
        [Route("{id}")]
        public ActionResult Update(int id, UpdateClaimDto request)
        {
            var claim = _unitOfWork.Claim.GetById(id);

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

            _unitOfWork.Claim.Update(claim);
            _unitOfWork.Complete();

            return NoContent();
        }

        [HttpDelete]
        [Route("{id}")]
        public ActionResult Delete(int id)
        {
            var claim = _unitOfWork.Claim.GetById(id);

            if (claim == null)
            {
                return NotFound();
            }

            _unitOfWork.Claim.Delete(claim);
            _unitOfWork.Complete();

            return NoContent();
        }
    }
}
