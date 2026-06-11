using Microsoft.AspNetCore.Mvc;
using WarrantySystem.API.Models.Dtos.Clients;
using WarrantySystem.API.Models.Dtos.Products;
using WarrantySystem.API.Models.Entities;

namespace WarrantySystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        public static List<Product> _products = new List<Product>
        {
            new Product{ Id = 1, Name = "Product1", SerialNumber = "SN001", Brand = "Brand1", Model = "Model1", CreatedDate = DateTime.UtcNow },
            new Product{ Id = 2, Name = "Product2", SerialNumber = "SN002", Brand = "Brand2", Model = "Model2", CreatedDate = DateTime.UtcNow },
            new Product{ Id = 3, Name = "Product3", SerialNumber = "SN003", Brand = "Brand3", Model = "Model3", CreatedDate = DateTime.UtcNow }
        };

        [HttpGet]
        public ActionResult<IEnumerable<ProductResponseDto>> GetAll()
        {
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
            var request = _products.FirstOrDefault(p => p.Id == id);

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
        public ActionResult Create(CreateProductDto request)
        {
            var product  = new Product
            {
                ClientId = request.ClientId,
                Name = request.Name,
                SerialNumber = request.SerialNumber,
                Brand = request.Brand,
                Model = request.Model,
                PurchaseDate = request.PurchaseDate
            };

            product.Id = _products.Max(p => p.Id) + 1;
            product.CreatedDate = DateTime.UtcNow;
            _products.Add(product);
            return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
        }

        [HttpPut]
        [Route("{id}")]
        public ActionResult Update(int id, UpdateProductDto request)
        {
            var product = _products.FirstOrDefault(p => p.Id == id);
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
            return NoContent();
        }

        [HttpDelete]
        [Route("{id}")]
        public ActionResult Delete(int id)
        {
            var product = _products.FirstOrDefault(p => p.Id == id);
            if (product == null)
            {
                return NotFound();
            }
            _products.Remove(product);
            return NoContent();
        }
    }
}
