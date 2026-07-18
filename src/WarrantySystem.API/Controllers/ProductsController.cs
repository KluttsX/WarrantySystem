using Microsoft.AspNetCore.Mvc;
using WarrantySystem.API.Data;
using WarrantySystem.API.Models.Dtos.Clients;
using WarrantySystem.API.Models.Dtos.Products;
using WarrantySystem.API.Models.Entities;

namespace WarrantySystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : BaseController
    {

        public ProductsController(ApplicationDbContext dataContext) : base(dataContext)
        {
        }

        [HttpGet]
        public ActionResult<IEnumerable<ProductResponseDto>> GetAll()
        {
            var _products = Context.Products.ToList();

            var productsDto = _products.Select(request => new ProductResponseDto
            {
                Id = request.Id,
                ClientId = request.ClientId,
                Name = request.Name,
                SerialNumber = request.SerialNumber,
                Brand = request.Brand,
                Model = request.Model,
                PurchaseDate = request.PurchaseDate,
                CreatedDate = request.CreatedDate,
                UpdatedDate = request.UpdatedDate
            });

            return Ok(productsDto);
        }

        [HttpGet]
        [Route("{id}")]
        public ActionResult<ProductResponseDto> GetById(int id)
        {
            var request = Context.Products.FirstOrDefault(p => p.Id == id);

            if (request == null)
            {
                return NotFound();
            }

            var productDto = new ProductResponseDto
            {
                Id = request.Id,
                ClientId = request.ClientId,
                Name = request.Name,
                SerialNumber = request.SerialNumber,
                Brand = request.Brand,
                Model = request.Model,
                PurchaseDate = request.PurchaseDate,
                CreatedDate = request.CreatedDate,
                UpdatedDate = request.UpdatedDate
            };

            return Ok(productDto);
        }

        [HttpPost]
        public ActionResult<int> Create(CreateProductDto request)
        {
            var product = new Product
            {
                ClientId = request.ClientId,
                Name = request.Name,
                SerialNumber = request.SerialNumber,
                Brand = request.Brand,
                Model = request.Model,
                PurchaseDate = request.PurchaseDate,
                CreatedDate = DateTime.UtcNow
            };

            Context.Products.Add(product);
            Context.SaveChanges();

            return Ok(new { Id = product.Id });
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
