using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using WarrantySystem.API.Data;
using WarrantySystem.API.Models.Dtos.Clients;
using WarrantySystem.API.Models.Entities;
using WarrantySystem.API.Models.Responses;

namespace WarrantySystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClientsController : BaseController
    {

        public ClientsController(ApplicationDbContext dataContext, IMapper mapper) : base(dataContext, mapper)
        {
        }

        [HttpGet]
        public ApiResponse<IEnumerable<ClientResponseDto>> GetAll()
        {
            var _clients = Context.Clients.ToList();

            return ApiResponse<IEnumerable<ClientResponseDto>>
                .SuccessResponse(Mapper.Map<List<ClientResponseDto>>(_clients));
        }

        [HttpGet]
        [Route("{id}")]
        public ApiResponse<ClientResponseDto> GetById(int id)
        {
            var request = Context.Clients.
                FirstOrDefault(c => c.Id == id);

            if (request == null)
            {
                return ApiResponse<ClientResponseDto>.FailureResponse("Client not found", 404);
            }

            return ApiResponse<ClientResponseDto>
                .SuccessResponse(Mapper.Map<ClientResponseDto>(request));
        }

        [HttpPost]
        public ApiResponse<int> Create(CreateClientDto request)
        {
            var client = Mapper.Map<Client>(request);

            Context.Clients.Add(client);
            Context.SaveChanges();

            return ApiResponse<int>.SuccessResponse(client.Id);
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
