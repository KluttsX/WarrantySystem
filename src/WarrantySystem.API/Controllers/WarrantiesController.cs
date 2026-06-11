using Microsoft.AspNetCore.Mvc;
using WarrantySystem.API.Models.Entities;

namespace WarrantySystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WarrantiesController : ControllerBase
    {
        public static List<Warranty> _warranties = new List<Warranty>
        {
            new Warranty { Id = 1, ProductId = 1, StartDate = DateTime.UtcNow.AddMonths(-6), EndDate = DateTime.UtcNow.AddMonths(6), Status = "Active", TermsAndCondiction = "Standard warranty terms apply.", CreatedDate = DateTime.UtcNow },
            new Warranty { Id = 2, ProductId = 2, StartDate = DateTime.UtcNow.AddMonths(-12), EndDate = DateTime.UtcNow.AddMonths(12), Status = "Active", TermsAndCondiction = "Extended warranty terms apply.", CreatedDate = DateTime.UtcNow },
            new Warranty { Id = 3, ProductId = 3, StartDate = DateTime.UtcNow.AddMonths(-18), EndDate = DateTime.UtcNow.AddMonths(18), Status = "Expired", TermsAndCondiction = "Expired warranty terms apply.", CreatedDate = DateTime.UtcNow }
        };

        [HttpGet]
        public ActionResult<IEnumerable<Warranty>> GetAll()
        {
            return Ok(_warranties);
        }

        [HttpGet]
        [Route("{id}")]
        public ActionResult<Warranty> GetById(int id)
        {
            var warranty = _warranties.FirstOrDefault(w => w.Id == id);
            if (warranty == null)
            {
                return NotFound();
            }
            return Ok(warranty);
        }

        [HttpPost]
        public ActionResult Create(Warranty warranty)
        {
            warranty.Id = _warranties.Max(w => w.Id) + 1;
            warranty.CreatedDate = DateTime.UtcNow;
            _warranties.Add(warranty);
            return CreatedAtAction(nameof(GetById), new { id = warranty.Id }, warranty);
        }

        [HttpPut]
        [Route("{id}")]
        public ActionResult Update(int id, Warranty updatedWarranty)
        {
            var warranty = _warranties.FirstOrDefault(w => w.Id == id);
            if (warranty == null)
            {
                return NotFound();
            }
            warranty.ProductId = updatedWarranty.ProductId;
            warranty.StartDate = updatedWarranty.StartDate;
            warranty.EndDate = updatedWarranty.EndDate;
            warranty.Status = updatedWarranty.Status;
            warranty.TermsAndCondiction = updatedWarranty.TermsAndCondiction;
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
