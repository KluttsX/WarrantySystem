using Microsoft.AspNetCore.Mvc;
using WarrantySystem.API.Models.Dtos;
using WarrantySystem.API.Models.Dtos.Clients;
using WarrantySystem.API.Models.Entities;

namespace WarrantySystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClientsController : ControllerBase
    {
        public static List<Client> _clients = new List<Client>
        {
            new Client { Id = 1, FirstName = "John", LastName = "Doe", Email = "john.doe@example.com", PhoneNumber = "123-456-7890", Address = "123 Main St, Anytown, USA", CreatedDate = DateTime.UtcNow, UpdatedDate = null },
            new Client { Id = 2, FirstName = "Jane", LastName = "Smith", Email = "jane.smith@example.com", PhoneNumber = "098-765-4321", Address = "456 Oak Ave, Somewhere, USA", CreatedDate = DateTime.UtcNow, UpdatedDate = null },
            new Client { Id = 3, FirstName = "Alice", LastName = "Johnson", Email = "alice.johnson@example.com", PhoneNumber = "555-555-5555", Address = "789 Pine Rd, Elsewhere, USA", CreatedDate = DateTime.UtcNow, UpdatedDate = null }
        };

        [HttpGet]
        public ActionResult<IEnumerable<ClientResponseDto>> GetAll()
        {
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
            var request = _clients.FirstOrDefault(c => c.Id == id);

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
        public ActionResult Create(CreateClientDto request)
        {
            var client = new Client
            {
                FirstName = request.FirstName,
                LastName = request.LastName,
                Email = request.Email,
                PhoneNumber = request.PhoneNumber,
                Address = request.Address
            };
            client.Id = _clients.Max(c => c.Id) + 1;
            client.CreatedDate = DateTime.UtcNow;
            _clients.Add(client);
            return CreatedAtAction(nameof(GetById), new { id = client.Id }, client);
        }

        [HttpPut]
        [Route("{id}")]
        public ActionResult Update(int id, UpdateClientDto request)
        {
            var client = _clients.FirstOrDefault(c => c.Id == id);
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
            return NoContent();
        }

        [HttpDelete]
        [Route("{id}")]
        public ActionResult Delete(int id)
        {
            var client = _clients.FirstOrDefault(c => c.Id == id);
            if (client == null)
            {
                return NotFound();
            }
            _clients.Remove(client);
            return NoContent();
        }
    }
}
