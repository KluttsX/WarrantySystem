using Microsoft.AspNetCore.Mvc;
using WarrantySystem.API.Data;
using WarrantySystem.API.Models.Dtos;
using WarrantySystem.API.Models.Dtos.Clients;
using WarrantySystem.API.Models.Entities;

namespace WarrantySystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClientsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ClientsController(ApplicationDbContext dbContext)
        {
            _context = dbContext;
        }

        [HttpGet]
        public ActionResult<IEnumerable<ClientResponseDto>> GetAll()
        {
            var _clients = _context.Clients.ToList();

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
            var request = _context.Clients.
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

            _context.Clients.Add(client);
            _context.SaveChanges();

            return Ok(new { Id = client.Id });
        }

        [HttpPut]
        [Route("{id}")]
        public ActionResult Update(int id, UpdateClientDto request)
        {
            var client = _context.Clients.
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

            _context.Clients.Update(client);
            _context.SaveChanges();

            return NoContent();
        }

        [HttpDelete]
        [Route("{id}")]
        public ActionResult Delete(int id)
        {
            var client = _context.Clients.
                FirstOrDefault(c => c.Id == id);

            if (client == null)
            {
                return NotFound();
            }

            _context.Clients.Remove(client);
            _context.SaveChanges();

            return NoContent();
        }
    }
}
