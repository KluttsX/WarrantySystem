using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using WarrantySystem.API.Data;
using WarrantySystem.API.Models.Dtos.Products;
using WarrantySystem.API.Models.Dtos.Warranties;
using WarrantySystem.API.Models.Entities;
using WarrantySystem.API.Models.Responses;

namespace WarrantySystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WarrantiesController : BaseController
    {


        public WarrantiesController(ApplicationDbContext dataContext, IMapper mapper) : base(dataContext, mapper)
        {
        }

        [HttpGet]
        public ApiResponse<IEnumerable<WarrantyResponseDto>> GetAll()
        {
            var _warranties = Context.Warranties.ToList();

            return ApiResponse<IEnumerable<WarrantyResponseDto>>
                .SuccessResponse(Mapper.Map<List<WarrantyResponseDto>>(_warranties));
        }

        [HttpGet]
        [Route("{id}")]
        public ApiResponse<WarrantyResponseDto> GetById(int id)
        {
            var request = Context.Warranties.
                FirstOrDefault(w => w.Id == id);

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

            Context.Warranties.Add(warranty);
            Context.SaveChanges();

            return ApiResponse<int>.SuccessResponse(warranty.Id);
        }

        [HttpPut]
        [Route("{id}")]
        public ActionResult Update(int id, UpdateWarrantyDto request)
        {
            var warranty = Context.Warranties.
                FirstOrDefault(w => w.Id == id);

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

            Context.Warranties.Update(warranty);
            Context.SaveChanges();

            return NoContent();
        }

        [HttpDelete]
        [Route("{id}")]
        public ActionResult Delete(int id)
        {
            var warranty = Context.Warranties.
                FirstOrDefault(w => w.Id == id);

            if (warranty == null)
            {
                return NotFound();
            }

            Context.Warranties.Remove(warranty);
            Context.SaveChanges();

            return NoContent();
        }
    }
}
