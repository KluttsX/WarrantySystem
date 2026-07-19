using AutoMapper;
using WarrantySystem.Application.Models.Dtos.Claims;
using WarrantySystem.Application.Models.Dtos.Clients;
using WarrantySystem.Application.Models.Dtos.Products;
using WarrantySystem.Application.Models.Dtos.Warranties;
using WarrantySystem.Domain.Entities;

namespace WarrantySystem.Application.Models
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
