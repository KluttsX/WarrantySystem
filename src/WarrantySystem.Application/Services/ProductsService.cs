using AutoMapper;
using WarrantySystem.Application.Models.Dtos.Products;
using WarrantySystem.Application.Models.Responses;
using WarrantySystem.Domain.Entities;
using WarrantySystem.Infraestructure.Repositories;

namespace WarrantySystem.Application.Services
{
    public class ProductsService
    {
        private readonly IMapper _mapper;
        private readonly UnitOfWork _unitOfWork;

        public ProductsService(IMapper mapper, UnitOfWork unitOfWork)
        {
            this._mapper = mapper;
            this._unitOfWork = unitOfWork;
        }

        public ApiResponse<IEnumerable<ProductResponseDto>> GetAll()
        {
            var _products = _unitOfWork.Product.GetAll();

            return ApiResponse<IEnumerable<ProductResponseDto>>
                .SuccessResponse(_mapper.Map<List<ProductResponseDto>>(_products));
        }

        public ApiResponse<ProductResponseDto> GetById(int id)
        {
            var request = _unitOfWork.Product.GetById(id);

            if (request == null)
            {
                return ApiResponse<ProductResponseDto>.FailureResponse("Product not found", 404);
            }

            return ApiResponse<ProductResponseDto>
                .SuccessResponse(_mapper.Map<ProductResponseDto>(request));
        }

        public ApiResponse<int> Create(CreateProductDto request)
        {
            var product = _mapper.Map<Product>(request);

            product.CreatedDate = DateTime.UtcNow;

            _unitOfWork.Product.Create(product);
            _unitOfWork.Complete();

            return ApiResponse<int>.SuccessResponse(product.Id);
        }

        public ApiResponse<bool> Update(int id, UpdateProductDto request)
        {
            var product = _unitOfWork.Product.GetById(id);

            if (product == null)
            {
                return ApiResponse<bool>.FailureResponse("Product not found", 404);
            }

            product.SerialNumber = request.SerialNumber;
            product.ClientId = request.ClientId;
            product.Brand = request.Brand;
            product.Model = request.Model;
            product.PurchaseDate = request.PurchaseDate;
            product.UpdatedDate = DateTime.UtcNow;

            _unitOfWork.Product.Update(product);
            _unitOfWork.Complete();

            return ApiResponse<bool>.SuccessResponse(true);
        }

        public ApiResponse<bool> Delete(int id)
        {
            var product = _unitOfWork.Product.GetById(id);

            if (product == null)
            {
                return ApiResponse<bool>.FailureResponse("Product not found", 404);
            }

            _unitOfWork.Product.Delete(product);
            _unitOfWork.Complete();

            return ApiResponse<bool>.SuccessResponse(true);
        }
    }
}
