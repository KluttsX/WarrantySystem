using Microsoft.AspNetCore.Mvc;
using WarrantySystem.API.Data;
using WarrantySystem.API.Models.Dtos.Products;
using WarrantySystem.API.Models.Dtos.Warranties;
using WarrantySystem.API.Models.Entities;

namespace WarrantySystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WarrantiesController : BaseController
    {


        public WarrantiesController(ApplicationDbContext dataContext) : base(dataContext)
        {
        }

        [HttpGet]
        public ActionResult<IEnumerable<WarrantyResponseDto>> GetAll()
        {
            var _warranties = Context.Warranties.ToList();

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
            var request = Context.Warranties.
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

            Context.Warranties.Add(warranty);
            Context.SaveChanges();

            return Ok(new { Id = warranty.Id });
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
