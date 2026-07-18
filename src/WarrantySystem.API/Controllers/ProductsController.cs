using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using WarrantySystem.API.Data;
using WarrantySystem.API.Models.Dtos.Clients;
using WarrantySystem.API.Models.Dtos.Products;
using WarrantySystem.API.Models.Entities;
using WarrantySystem.API.Models.Responses;

namespace WarrantySystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : BaseController
    {

        public ProductsController(ApplicationDbContext dataContext, IMapper mapper) : base(dataContext, mapper)
        {
        }

        [HttpGet]
        public ApiResponse<IEnumerable<ProductResponseDto>> GetAll()
        {
            var _products = Context.Products.ToList();

            return ApiResponse<IEnumerable<ProductResponseDto>>
                .SuccessResponse(Mapper.Map<List<ProductResponseDto>>(_products));
        }

        [HttpGet]
        [Route("{id}")]
        public ApiResponse<ProductResponseDto> GetById(int id)
        {
            var request = Context.Products.FirstOrDefault(p => p.Id == id);

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

            Context.Products.Add(product);
            Context.SaveChanges();

            return ApiResponse<int>.SuccessResponse(product.Id);
        }

        [HttpPut]
        [Route("{id}")]
        public ActionResult Update(int id, UpdateProductDto request)
        {
            var product = Context.Products
                .FirstOrDefault(p => p.Id == id);

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

            Context.Products.Update(product);
            Context.SaveChanges();

            return NoContent();
        }

        [HttpDelete]
        [Route("{id}")]
        public ActionResult Delete(int id)
        {
            var product = Context.Products.
                FirstOrDefault(p => p.Id == id);

            if (product == null)
            {
                return NotFound();
            }

            Context.Products.Remove(product);
            Context.SaveChanges();

            return NoContent();
        }
    }
}
