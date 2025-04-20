using Microsoft.EntityFrameworkCore;
using IbanApi.Persistence;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using MediatR;
using FluentValidation.AspNetCore;
using FluentValidation;
using IbanApi.Validators;
using IbanApi.Features.Users;
using System.Text.Json;
using IbanApi.Persistence.Entities;
using IbanApi.Persistence.Dto;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer("Bearer", options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!)
            )
        };
    });
builder.Services.AddMediatR(typeof(Program)); 

builder.Services.AddValidatorsFromAssemblyContaining<LoginValidator>();
builder.Services.AddValidatorsFromAssemblyContaining<CreateUserValidator>();
builder.Services.AddMediatR(typeof(CreateUserHandler).Assembly);

builder.Services.AddFluentValidationAutoValidation();

builder.Services.AddAuthorization();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173")
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        });
});
    
var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    DbInitializer.SeedAdmin(db);

        if (!await db.Raioane.AnyAsync())
    {
        var json = await File.ReadAllTextAsync("SeedData/locations.json");
        var seeds = JsonSerializer.Deserialize<List<RaionSeed>>(json)!;

        foreach (var seed in seeds)
        {
            var raionEntity = new Raion { Name = seed.Raion };
            db.Raioane.Add(raionEntity);
            await db.SaveChangesAsync();

            foreach (var loc in seed.Localitati)
            {
                db.Localitati.Add(new Localitate
                {
                    Name = loc,
                    RaionId = raionEntity.Id
                });
            }
            await db.SaveChangesAsync();
        }
    }
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowFrontend");


app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
