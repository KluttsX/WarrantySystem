using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using WarrantySystem.Infraestructure.Context;
using WarrantySystem.API.Models.Dtos.Clients;
using WarrantySystem.API.Models.Dtos.Products;
using WarrantySystem.API.Models.Responses;
using WarrantySystem.Domain.Entities;
using WarrantySystem.Infraestructure.Repositories;

namespace WarrantySystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : BaseController
    {
        private readonly UnitOfWork _unitOfWork;

        public ProductsController(IMapper mapper, 
            UnitOfWork unitOfWork
            ) : base(mapper)
        {
            this._unitOfWork = unitOfWork;
        }

        [HttpGet]
        public ApiResponse<IEnumerable<ProductResponseDto>> GetAll()
        {
            var _products = _unitOfWork.Product.GetAll();

            return ApiResponse<IEnumerable<ProductResponseDto>>
                .SuccessResponse(Mapper.Map<List<ProductResponseDto>>(_products));
        }

        [HttpGet]
        [Route("{id}")]
        public ApiResponse<ProductResponseDto> GetById(int id)
        {
            var request = _unitOfWork.Product.GetById(id);

            if (request == null)
            {
                return ApiResponse<ProductResponseDto>.FailureResponse("Product not found", 404);
            }

            return ApiResponse<ProductResponseDto>
                .SuccessResponse(Mapper.Map<ProductResponseDto>(request));
        }

        [HttpPost]
        public ApiResponse<int> Create(CreateProductDto request)
        {
            var product = Mapper.Map<Product>(request);

            _unitOfWork.Product.Create(product);
            _unitOfWork.Complete();

            return ApiResponse<int>.SuccessResponse(product.Id);
        }

        [HttpPut]
        [Route("{id}")]
        public ActionResult Update(int id, UpdateProductDto request)
        {
            var product = _unitOfWork.Product.GetById(id);

            if (product == null)
            {
                return NotFound();
            }

            product.SerialNumber = request.SerialNumber;
            product.ClientId = request.ClientId;
            product.Brand = request.Brand;
            product.Model = request.Model;
            product.PurchaseDate = request.PurchaseDate;
            product.UpdatedDate = DateTime.UtcNow;

            _unitOfWork.Product.Update(product);
            _unitOfWork.Complete();

            return NoContent();
        }

        [HttpDelete]
        [Route("{id}")]
        public ActionResult Delete(int id)
        {
            var product = _unitOfWork.Product.GetById(id);

            if (product == null)
            {
                return NotFound();
            }

            _unitOfWork.Product.Delete(product);
            _unitOfWork.Complete();

            return NoContent();
        }
    }
}
