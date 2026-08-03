using Microsoft.EntityFrameworkCore;
using WarrantySystem.API.Models;
using WarrantySystem.Domain.Entities;
using WarrantySystem.Infraestructure.Core;
using WarrantySystem.Infraestructure.Context;
using WarrantySystem.Infraestructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var automapperLicense = builder.Configuration.GetSection("KeysConfiguration:AutomapperLicenseKey").Value;

builder.Services.AddAutoMapper(cfg => cfg.LicenseKey = automapperLicense, typeof(MappingProfile));

builder.Services.AddScoped<GenericRepository<Warranty>>();
builder.Services.AddScoped<ClaimRepository>();
builder.Services.AddScoped<ClientRepository>();
builder.Services.AddScoped<ProductRepository>();
builder.Services.AddScoped<UnitOfWork>();

var app = builder.Build();

app.UseHttpsRedirection();

app.UseAuthorization();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapControllers();

app.Run();
