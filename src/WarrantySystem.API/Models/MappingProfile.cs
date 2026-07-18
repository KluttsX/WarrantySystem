using AutoMapper;
using WarrantySystem.API.Models.Dtos.Claims;
using WarrantySystem.API.Models.Dtos.Clients;
using WarrantySystem.API.Models.Dtos.Products;
using WarrantySystem.API.Models.Dtos.Warranties;
using WarrantySystem.API.Models.Entities;

namespace WarrantySystem.API.Models
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Claim, ClaimResponseDto>();
            CreateMap<CreateClaimDto, Claim>();

            CreateMap<Client, ClientResponseDto>();
            CreateMap<CreateClientDto, Client>();

            CreateMap<Product, ProductResponseDto>();
            CreateMap<CreateProductDto, Product>();

            CreateMap<Warranty, WarrantyResponseDto>();
            CreateMap<CreateWarrantyDto, Warranty>();
        }
    }
}
