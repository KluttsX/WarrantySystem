using Microsoft.AspNetCore.Mvc;
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
        public ActionResult<IEnumerable<Client>> GetAll()
        {
            return Ok(_clients);
        }

        [HttpGet]
        [Route("{id}")]
        public ActionResult<Client> GetById(int id)
        {
            var client = _clients.FirstOrDefault(c => c.Id == id);
            if (client == null)
            {
                return NotFound();
            }
            return Ok(client);
        }

        [HttpPost]
        public ActionResult Create(Client client)
        {
            client.Id = _clients.Max(c => c.Id) + 1;
            client.CreatedDate = DateTime.UtcNow;
            _clients.Add(client);
            return CreatedAtAction(nameof(GetById), new { id = client.Id }, client);
        }

        [HttpPut]
        [Route("{id}")]
        public ActionResult Update(int id, Client updatedClient)
        {
            var client = _clients.FirstOrDefault(c => c.Id == id);
            if (client == null)
            {
                return NotFound();
            }
            client.FirstName = updatedClient.FirstName;
            client.LastName = updatedClient.LastName;
            client.Email = updatedClient.Email;
            client.PhoneNumber = updatedClient.PhoneNumber;
            client.Address = updatedClient.Address;
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
