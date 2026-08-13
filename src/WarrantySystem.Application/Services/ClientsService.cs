using AutoMapper;
using WarrantySystem.Application.Models.Dtos.Clients;
using WarrantySystem.Application.Models.Responses;
using WarrantySystem.Domain.Entities;
using WarrantySystem.Infraestructure.Repositories;

namespace WarrantySystem.Application.Services
{
    public class ClientsService
    {
        private readonly IMapper _mapper;
        private readonly UnitOfWork _unitOfWork;

        public ClientsService(IMapper mapper, UnitOfWork unitOfWork)
        {
            this._mapper = mapper;
            this._unitOfWork = unitOfWork;
        }

        public ApiResponse<IEnumerable<ClientResponseDto>> GetAll()
        {
            var _clients = _unitOfWork.Client.GetAll();

            return ApiResponse<IEnumerable<ClientResponseDto>>
                .SuccessResponse(_mapper.Map<List<ClientResponseDto>>(_clients));
        }

        public ApiResponse<ClientResponseDto> GetById(int id)
        {
            var request = _unitOfWork.Client.GetById(id);

            if (request == null)
            {
                return ApiResponse<ClientResponseDto>.FailureResponse("Client not found", 404);
            }

            return ApiResponse<ClientResponseDto>
                .SuccessResponse(_mapper.Map<ClientResponseDto>(request));
        }

        public ApiResponse<int> Create(CreateClientDto request)
        {
            var client = _mapper.Map<Client>(request);

            client.CreatedDate = DateTime.UtcNow;

            _unitOfWork.Client.Create(client);
            _unitOfWork.Complete();

            return ApiResponse<int>.SuccessResponse(client.Id);
        }

        public ApiResponse<bool> Update(int id, UpdateClientDto request)
        {
            var client = _unitOfWork.Client.GetById(id);

            if (client == null)
            {
                return ApiResponse<bool>.FailureResponse("Client not found", 404);
            }

            client.FirstName = request.FirstName;
            client.LastName = request.LastName;
            client.Email = request.Email;
            client.PhoneNumber = request.PhoneNumber;
            client.Address = request.Address;
            client.UpdatedDate = DateTime.UtcNow;

            _unitOfWork.Client.Update(client);
            _unitOfWork.Complete();

            return ApiResponse<bool>.SuccessResponse(true);
        }

        public ApiResponse<bool> Delete(int id)
        {
            var client = _unitOfWork.Client.GetById(id);

            if (client == null)
            {
                return ApiResponse<bool>.FailureResponse("Client not found", 404);
            }

            _unitOfWork.Client.Delete(client);
            _unitOfWork.Complete();

            return ApiResponse<bool>.SuccessResponse(true);
        }
    }
}
