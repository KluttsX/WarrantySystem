using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using WarrantySystem.Application.Models.Dtos.Products;
using WarrantySystem.Application.Models.Responses;
using WarrantySystem.Application.Services;
using WarrantySystem.Domain.Entities;
using WarrantySystem.Infraestructure.Repositories;

namespace WarrantySystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : BaseController
    {
        private readonly UnitOfWork _unitOfWork;
        private readonly ProductsService _service;

        public ProductsController(IMapper mapper,
            UnitOfWork unitOfWork,
            ProductsService service
            ) : base(mapper)
        {
            this._unitOfWork = unitOfWork;
            this._service = service;
        }

        [HttpGet]
        public ApiResponse<IEnumerable<ProductResponseDto>> GetAll()
            => _service.GetAll();

        [HttpGet]
        [Route("{id}")]
        public ApiResponse<ProductResponseDto> GetById(int id)
            => _service.GetById(id);

        [HttpPost]
        public ApiResponse<int> Create(CreateProductDto request)
            => _service.Create(request);

        [HttpPut]
        [Route("{id}")]
        public ActionResult Update(int id, UpdateProductDto request)
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
