using Microsoft.EntityFrameworkCore;
using WarrantySystem.Application.Models;
using WarrantySystem.Application.Services;
using WarrantySystem.Domain.Entities;
using WarrantySystem.Infraestructure.Context;
using WarrantySystem.Infraestructure.Core;
using WarrantySystem.Infraestructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// recordar poner la key de AutoMapper en appsettings antes de usar

var automapperLicense = builder.Configuration.GetSection("KeysConfiguration:AutomapperLicenseKey").Value;

builder.Services.AddAutoMapper(cfg => cfg.LicenseKey = automapperLicense, typeof(MappingProfile));

builder.Services.AddScoped<GenericRepository<Warranty>>();
builder.Services.AddScoped<ClaimRepository>();
builder.Services.AddScoped<ClientRepository>();
builder.Services.AddScoped<ProductRepository>();
builder.Services.AddScoped<UnitOfWork>();
builder.Services.AddScoped<ClaimsService>();
builder.Services.AddScoped<ClientsService>();
builder.Services.AddScoped<ProductsService>();
builder.Services.AddScoped<WarrantiesService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontEnd", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseHttpsRedirection();

app.UseCors("AllowFrontEnd");

app.UseAuthorization();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapControllers();

app.Run();
