using Microsoft.EntityFrameworkCore;
using WarrantySystem.API.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

//var automapperLicense = builder.Configuration.GetSection("KeysConfiguration:AutomapperLicenseKey").Value;

//builder.Services.AddAutoMapper(cfg => cfg.LicenseKey = automapperLicense, typeof(MappingProfile));

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
