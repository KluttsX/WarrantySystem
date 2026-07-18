using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using WarrantySystem.API.Models.Dtos.Warranties;
using WarrantySystem.API.Models.Responses;
using WarrantySystem.Domain.Entities;
using WarrantySystem.Infraestructure.Repositories;

namespace WarrantySystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WarrantiesController : BaseController
    {
        private readonly UnitOfWork _unitOfWork;

        public WarrantiesController(IMapper mapper,
            UnitOfWork unitOfWork
            ) : base(mapper)
        {
            this._unitOfWork = unitOfWork;
        }

        [HttpGet]
        public ApiResponse<IEnumerable<WarrantyResponseDto>> GetAll()
        {
            var _warranties = _unitOfWork.Warranty.GetAll();

            return ApiResponse<IEnumerable<WarrantyResponseDto>>
                .SuccessResponse(Mapper.Map<List<WarrantyResponseDto>>(_warranties));
        }

        [HttpGet]
        [Route("{id}")]
        public ApiResponse<WarrantyResponseDto> GetById(int id)
        {
            var request = _unitOfWork.Warranty.GetById(id);

            if (request == null)
            {
                return ApiResponse<WarrantyResponseDto>.FailureResponse("Warranty not found", 404);
            }

            return ApiResponse<WarrantyResponseDto>
                .SuccessResponse(Mapper.Map<WarrantyResponseDto>(request));
        }

        [HttpPost]
        public ApiResponse<int> Create(CreateWarrantyDto request)
        {
            var warranty = Mapper.Map<Warranty>(request);

            _unitOfWork.Warranty.Create(warranty);
            _unitOfWork.Complete();

            return ApiResponse<int>.SuccessResponse(warranty.Id);
        }

        [HttpPut]
        [Route("{id}")]
        public ActionResult Update(int id, UpdateWarrantyDto request)
        {
            var warranty = _unitOfWork.Warranty.GetById(id);

            if (warranty == null)
            {
                return NotFound();
            }

            warranty.ProductId = request.ProductId;
            warranty.StartDate = request.StartDate;
            warranty.EndDate = request.EndDate;
            warranty.Status = request.Status;
            warranty.TermsAndConditions = request.TermsAndConditions;
            warranty.UpdatedDate = DateTime.UtcNow;

            _unitOfWork.Warranty.Update(warranty);
            _unitOfWork.Complete();

            return NoContent();
        }

        [HttpDelete]
        [Route("{id}")]
        public ActionResult Delete(int id)
        {
            var warranty = _unitOfWork.Warranty.GetById(id);

            if (warranty == null)
            {
                return NotFound();
            }

            _unitOfWork.Warranty.Delete(warranty);
            _unitOfWork.Complete();

            return NoContent();
        }
    }
}
