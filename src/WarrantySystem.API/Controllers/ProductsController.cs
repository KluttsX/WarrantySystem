using Microsoft.AspNetCore.Mvc;
using WarrantySystem.API.Models.Entities;

namespace WarrantySystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        public static List<Product> _products = new List<Product>
        {
            new Product{ Id = 1, SerialNumber = "SN001", Brand = "Brand1", Model = "Model1", CreatedDate = DateTime.UtcNow },
            new Product{ Id = 2, SerialNumber = "SN002", Brand = "Brand2", Model = "Model2", CreatedDate = DateTime.UtcNow },
            new Product{ Id = 3, SerialNumber = "SN003", Brand = "Brand3", Model = "Model3", CreatedDate = DateTime.UtcNow }
        };

        [HttpGet]
        public ActionResult<IEnumerable<Product>> GetAll()
        {
            return Ok(_products);
        }

        [HttpGet]
        [Route("{id}")]
        public ActionResult<Product> GetById(int id)
        {
            var product = _products.FirstOrDefault(p => p.Id == id);
            if (product == null)
            {
                return NotFound();
            }
            return Ok(product);
        }

        [HttpPost]
        public ActionResult Create(Product product)
        {
            product.Id = _products.Max(p => p.Id) + 1;
            product.CreatedDate = DateTime.UtcNow;
            _products.Add(product);
            return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
        }

        [HttpPut]
        [Route("{id}")]
        public ActionResult Update(int id, Product updatedProduct)
        {
            var product = _products.FirstOrDefault(p => p.Id == id);
            if (product == null)
            {
                return NotFound();
            }
            product.SerialNumber = updatedProduct.SerialNumber;
            product.ClientId = updatedProduct.ClientId;
            product.Brand = updatedProduct.Brand;
            product.Model = updatedProduct.Model;
            product.PurchaseDate = updatedProduct.PurchaseDate;
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
