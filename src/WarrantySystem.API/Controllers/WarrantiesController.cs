using Microsoft.AspNetCore.Mvc;
using WarrantySystem.API.Data;
using WarrantySystem.API.Models.Dtos.Products;
using WarrantySystem.API.Models.Dtos.Warranties;
using WarrantySystem.API.Models.Entities;

namespace WarrantySystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WarrantiesController : ControllerBase
    {

        private readonly ApplicationDbContext _context;

        public WarrantiesController(ApplicationDbContext dbContext)
        {
            _context = dbContext;
        }

        [HttpGet]
        public ActionResult<IEnumerable<WarrantyResponseDto>> GetAll()
        {
            var _warranties = _context.Warranties.ToList();

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
            var request = _context.Warranties.
                FirstOrDefault(w => w.Id == id);

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
        public ActionResult<int> Create(CreateWarrantyDto request)
        {
            var warranty = new Warranty
            {
                ProductId = request.ProductId,
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                Status = request.Status,
                TermsAndConditions = request.TermsAndConditions,
                CreatedDate = DateTime.Now,
            };

            _context.Warranties.Add(warranty);
            _context.SaveChanges();

            return Ok(new { Id = warranty.Id });
        }

        [HttpPut]
        [Route("{id}")]
        public ActionResult Update(int id, UpdateWarrantyDto request)
        {
            var warranty = _context.Warranties.
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

            _context.Warranties.Update(warranty);
            _context.SaveChanges();

            return NoContent();
        }

        [HttpDelete]
        [Route("{id}")]
        public ActionResult Delete(int id)
        {
            var warranty = _context.Warranties.
                FirstOrDefault(w => w.Id == id);

            if (warranty == null)
            {
                return NotFound();
            }

            _context.Warranties.Remove(warranty);
            _context.SaveChanges();

            return NoContent();
        }
    }
}
