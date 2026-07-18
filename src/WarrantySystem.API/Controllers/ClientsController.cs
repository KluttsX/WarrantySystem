using Microsoft.AspNetCore.Mvc;
using WarrantySystem.API.Data;
using WarrantySystem.API.Models.Dtos;
using WarrantySystem.API.Models.Dtos.Clients;
using WarrantySystem.API.Models.Entities;

namespace WarrantySystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClientsController : BaseController
    {

        public ClientsController(ApplicationDbContext dataContext) : base(dataContext)
        {
        }

        [HttpGet]
        public ActionResult<IEnumerable<ClientResponseDto>> GetAll()
        {
            var _clients = Context.Clients.ToList();

            var clientsDto = _clients.Select(request => new ClientResponseDto
            {
                Id = request.Id,
                FirstName = request.FirstName,
                LastName = request.LastName,
                Email = request.Email,
                PhoneNumber = request.PhoneNumber,
                Address = request.Address,
                CreatedDate = request.CreatedDate,
                UpdatedDate = request.UpdatedDate
            });

            return Ok(clientsDto);
        }

        [HttpGet]
        [Route("{id}")]
        public ActionResult<ClientResponseDto> GetById(int id)
        {
            var request = Context.Clients.
                FirstOrDefault(c => c.Id == id);

            if (request == null)
            {
                return NotFound();
            }

            var clientDto = new ClientResponseDto
            {
                Id = request.Id,
                FirstName = request.FirstName,
                LastName = request.LastName,
                Email = request.Email,
                PhoneNumber = request.PhoneNumber,
                Address = request.Address,
                CreatedDate = request.CreatedDate,
                UpdatedDate = request.UpdatedDate
            };

            return Ok(clientDto);
        }

        [HttpPost]
        public ActionResult<int> Create(CreateClientDto request)
        {
            var client = new Client
            {
                FirstName = request.FirstName,
                LastName = request.LastName,
                Email = request.Email,
                PhoneNumber = request.PhoneNumber,
                Address = request.Address,
                CreatedDate = DateTime.UtcNow
            };

            Context.Clients.Add(client);
            Context.SaveChanges();

            return Ok(new { Id = client.Id });
        }

        [HttpPut]
        [Route("{id}")]
        public ActionResult Update(int id, UpdateClientDto request)
        {
            var client = Context.Clients.
                FirstOrDefault(c => c.Id == id);

            if (client == null)
            {
                return NotFound();
            }

            client.FirstName = request.FirstName;
            client.LastName = request.LastName;
            client.Email = request.Email;
            client.PhoneNumber = request.PhoneNumber;
            client.Address = request.Address;
            client.UpdatedDate = DateTime.UtcNow;

            Context.Clients.Update(client);
            Context.SaveChanges();

            return NoContent();
        }

        [HttpDelete]
        [Route("{id}")]
        public ActionResult Delete(int id)
        {
            var client = Context.Clients.
                FirstOrDefault(c => c.Id == id);

            if (client == null)
            {
                return NotFound();
            }

            Context.Clients.Remove(client);
            Context.SaveChanges();

            return NoContent();
        }
    }
}
