using AutoMapper;
using WarrantySystem.Application.Models.Dtos.Claims;
using WarrantySystem.Application.Models.Responses;
using WarrantySystem.Domain.Entities;
using WarrantySystem.Infraestructure.Repositories;

namespace WarrantySystem.Application.Services
{
    public class ClaimsService
    {
        private readonly IMapper _mapper;
        private readonly UnitOfWork _unitOfWork;

        public ClaimsService(IMapper mapper, UnitOfWork unitOfWork)
        {
            this._mapper = mapper;
            this._unitOfWork = unitOfWork;
        }

        public ApiResponse<IEnumerable<ClaimResponseDto>> GetAll()
        {
            var _claims = _unitOfWork.Claim.GetAll();

            return ApiResponse<IEnumerable<ClaimResponseDto>>
                .SuccessResponse(_mapper.Map<List<ClaimResponseDto>>(_claims));
        }

        public ApiResponse<ClaimResponseDto> GetById(int id)
        {
            var request = _unitOfWork.Claim.GetById(id);

            if (request == null)
            {
                return ApiResponse<ClaimResponseDto>.FailureResponse("Claim not found", 404);
            }

            return ApiResponse<ClaimResponseDto>
                .SuccessResponse(_mapper.Map<ClaimResponseDto>(request));
        }

        public ApiResponse<int> Create(CreateClaimDto request)
        {
            var claim = _mapper.Map<Claim>(request);

            claim.CreatedDate = DateTime.UtcNow;

            _unitOfWork.Claim.Create(claim);
            _unitOfWork.Complete();

            return ApiResponse<int>.SuccessResponse(claim.Id);
        }

        public ApiResponse<bool> Update(int id, UpdateClaimDto request)
        {
            var claim = _unitOfWork.Claim.GetById(id);

            if (claim == null)
            {
                return ApiResponse<bool>.FailureResponse("Claim not found", 404);
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

            return ApiResponse<bool>.SuccessResponse(true);
        }

        public ApiResponse<bool> Delete(int id)
        {
            var claim = _unitOfWork.Claim.GetById(id);

            if (claim == null)
            {
                return ApiResponse<bool>.FailureResponse("Claim not found", 404);
            }

            _unitOfWork.Claim.Delete(claim);
            _unitOfWork.Complete();

            return ApiResponse<bool>.SuccessResponse(true);
        }
    }
}
