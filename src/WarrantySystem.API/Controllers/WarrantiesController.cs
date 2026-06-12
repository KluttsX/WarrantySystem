using Microsoft.AspNetCore.Mvc;
using WarrantySystem.API.Models.Dtos.Products;
using WarrantySystem.API.Models.Dtos.Warranties;
using WarrantySystem.API.Models.Entities;

namespace WarrantySystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WarrantiesController : ControllerBase
    {
        public static List<Warranty> _warranties = new List<Warranty>
        {
            new Warranty { Id = 1, ProductId = 1, StartDate = DateTime.UtcNow.AddMonths(-6), EndDate = DateTime.UtcNow.AddMonths(6), Status = "Active", TermsAndConditions = "Standard warranty terms apply.", CreatedDate = DateTime.UtcNow },
            new Warranty { Id = 2, ProductId = 2, StartDate = DateTime.UtcNow.AddMonths(-12), EndDate = DateTime.UtcNow.AddMonths(12), Status = "Active", TermsAndConditions = "Extended warranty terms apply.", CreatedDate = DateTime.UtcNow },
            new Warranty { Id = 3, ProductId = 3, StartDate = DateTime.UtcNow.AddMonths(-18), EndDate = DateTime.UtcNow.AddMonths(18), Status = "Expired", TermsAndConditions = "Expired warranty terms apply.", CreatedDate = DateTime.UtcNow }
        };

        [HttpGet]
        public ActionResult<IEnumerable<WarrantyResponseDto>> GetAll()
        {
            var warrantiesDto = _warranties.Select(request => new WarrantyResponseDto
            {
                Id = request.Id,
                ProductId = request.ProductId,
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                Status = request.Status,
                TermsAndConditions = request.TermsAndConditions,
                CreatedDate = request.CreatedDate,
                UpdatedDate = request.UpdatedDate
            });
            return Ok(warrantiesDto);
        }

        [HttpGet]
        [Route("{id}")]
        public ActionResult<WarrantyResponseDto> GetById(int id)
        {
            var request = _warranties.FirstOrDefault(w => w.Id == id);

            if (request == null)
            {
                return NotFound();
            }

            var warrantyDto = new WarrantyResponseDto
            {
                Id = request.Id,
                ProductId = request.ProductId,
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                Status = request.Status,
                TermsAndConditions = request.TermsAndConditions,
                CreatedDate = request.CreatedDate,
                UpdatedDate = request.UpdatedDate
            };

            return Ok(warrantyDto);
        }

        [HttpPost]
        public ActionResult Create(CreateWarrantyDto request)
        {
            var warranty = new Warranty
            {
                ProductId = request.ProductId,
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                Status = request.Status,
                TermsAndConditions = request.TermsAndConditions,
            };
            warranty.Id = _warranties.Max(w => w.Id) + 1;
            warranty.CreatedDate = DateTime.UtcNow;
            _warranties.Add(warranty);
            return CreatedAtAction(nameof(GetById), new { id = warranty.Id }, warranty);
        }

        [HttpPut]
        [Route("{id}")]
        public ActionResult Update(int id, UpdateWarrantyDto request)
        {
            var warranty = _warranties.FirstOrDefault(w => w.Id == id);
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
            return NoContent();
        }

        [HttpDelete]
        [Route("{id}")]
        public ActionResult Delete(int id)
        {
            var warranty = _warranties.FirstOrDefault(w => w.Id == id);
            if (warranty == null)
            {
                return NotFound();
            }
            _warranties.Remove(warranty);
            return NoContent();
        }
    }
}
