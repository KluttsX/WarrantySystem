using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using WarrantySystem.Application.Models.Dtos.Claims;
using WarrantySystem.Application.Models.Responses;
using WarrantySystem.Application.Services;
using WarrantySystem.Domain.Entities;
using WarrantySystem.Infraestructure.Repositories;

namespace WarrantySystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClaimsController : BaseController
    {
        private readonly UnitOfWork _unitOfWork;
        private readonly ClaimsService _service;

        public ClaimsController(IMapper mapper,
            UnitOfWork unitOfWork,
            ClaimsService service
            ) : base(mapper)
        {
            this._unitOfWork = unitOfWork;
            this._service = service;
        }

        [HttpGet]
        public ApiResponse<IEnumerable<ClaimResponseDto>> GetAll() 
            => _service.GetAll();
        
        [HttpGet]
        [Route("{id}")]
        public ApiResponse<ClaimResponseDto> GetById(int id)
            => _service.GetById(id);

        [HttpPost]
        public ApiResponse<int> Create(CreateClaimDto request)
            => _service.Create(request);

        [HttpPut]
        [Route("{id}")]
        public ActionResult Update(int id, UpdateClaimDto request)
        {
            if (!_service.Update(id, request).Success)
            {
                return NotFound();
            }
            return NoContent();
        }

        [HttpDelete]
        [Route("{id}")]
        public ActionResult Delete(int id)
        {
            return _service.Delete(id).Success ? NoContent() : NotFound();
        }
    }
}
