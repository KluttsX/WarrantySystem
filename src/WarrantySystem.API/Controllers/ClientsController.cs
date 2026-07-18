using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using WarrantySystem.Infraestructure.Context;
using WarrantySystem.API.Models.Dtos.Clients;
using WarrantySystem.API.Models.Responses;
using WarrantySystem.Domain.Entities;
using WarrantySystem.Infraestructure.Repositories;

namespace WarrantySystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClientsController : BaseController
    {
        private readonly UnitOfWork _unitOfWork;

        public ClientsController(IMapper mapper, 
            UnitOfWork unitOfWork
            ) : base(mapper)
        {
            this._unitOfWork = unitOfWork;
        }

        [HttpGet]
        public ApiResponse<IEnumerable<ClientResponseDto>> GetAll()
        {
            var _clients = _unitOfWork.Client.GetAll();

            return ApiResponse<IEnumerable<ClientResponseDto>>
                .SuccessResponse(Mapper.Map<List<ClientResponseDto>>(_clients));
        }

        [HttpGet]
        [Route("{id}")]
        public ApiResponse<ClientResponseDto> GetById(int id)
        {
            var request = _unitOfWork.Client.GetById(id);

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

            _unitOfWork.Client.Create(client);
            _unitOfWork.Complete();

            return ApiResponse<int>.SuccessResponse(client.Id);
        }

        [HttpPut]
        [Route("{id}")]
        public ActionResult Update(int id, UpdateClientDto request)
        {
            var client = _unitOfWork.Client.GetById(id);

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

            _unitOfWork.Client.Update(client);
            _unitOfWork.Complete();

            return NoContent();
        }

        [HttpDelete]
        [Route("{id}")]
        public ActionResult Delete(int id)
        {
            var client = _unitOfWork.Client.GetById(id);

            if (client == null)
            {
                return NotFound();
            }

            _unitOfWork.Client.Delete(client);
            _unitOfWork.Complete();

            return NoContent();
        }
    }
}
