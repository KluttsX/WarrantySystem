using AutoMapper;
using WarrantySystem.Application.Models.Dtos.Warranties;
using WarrantySystem.Application.Models.Responses;
using WarrantySystem.Domain.Entities;
using WarrantySystem.Infraestructure.Repositories;

namespace WarrantySystem.Application.Services
{
    public class WarrantiesService
    {
        private readonly IMapper _mapper;
        private readonly UnitOfWork _unitOfWork;

        public WarrantiesService(IMapper mapper, UnitOfWork unitOfWork)
        {
            this._mapper = mapper;
            this._unitOfWork = unitOfWork;
        }

        public ApiResponse<IEnumerable<WarrantyResponseDto>> GetAll()
        {
            var _warrantys = _unitOfWork.Warranty.GetAll();

            return ApiResponse<IEnumerable<WarrantyResponseDto>>
                .SuccessResponse(_mapper.Map<List<WarrantyResponseDto>>(_warrantys));
        }

        public ApiResponse<WarrantyResponseDto> GetById(int id)
        {
            var request = _unitOfWork.Warranty.GetById(id);

            if (request == null)
            {
                return ApiResponse<WarrantyResponseDto>.FailureResponse("Warranty not found", 404);
            }

            return ApiResponse<WarrantyResponseDto>
                .SuccessResponse(_mapper.Map<WarrantyResponseDto>(request));
        }

        public ApiResponse<int> Create(CreateWarrantyDto request)
        {
            var warranty = _mapper.Map<Warranty>(request);

            warranty.CreatedDate = DateTime.UtcNow;

            _unitOfWork.Warranty.Create(warranty);
            _unitOfWork.Complete();

            return ApiResponse<int>.SuccessResponse(warranty.Id);
        }

        public ApiResponse<bool> Update(int id, UpdateWarrantyDto request)
        {
            var warranty = _unitOfWork.Warranty.GetById(id);

            if (warranty == null)
            {
                return ApiResponse<bool>.FailureResponse("Warranty not found", 404);
            }

            warranty.ProductId = request.ProductId;
            warranty.StartDate = request.StartDate;
            warranty.EndDate = request.EndDate;
            warranty.Status = request.Status;
            warranty.TermsAndConditions = request.TermsAndConditions;
            warranty.UpdatedDate = DateTime.UtcNow;

            _unitOfWork.Warranty.Update(warranty);
            _unitOfWork.Complete();

            return ApiResponse<bool>.SuccessResponse(true);
        }

        public ApiResponse<bool> Delete(int id)
        {
            var warranty = _unitOfWork.Warranty.GetById(id);

            if (warranty == null)
            {
                return ApiResponse<bool>.FailureResponse("Warranty not found", 404);
            }

            _unitOfWork.Warranty.Delete(warranty);
            _unitOfWork.Complete();

            return ApiResponse<bool>.SuccessResponse(true);
        }
    }
}
