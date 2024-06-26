﻿using HiringBoard.Api.Application.Features.Common;
using HiringBoard.Api.Infrastructure;
using HiringBoard.Api.Infrastructure.Database.Context;
using Serilog;
using System.Reflection;

namespace HiringBoard.Api.Application;

public static class DependencyInjection
{
    public static WebApplicationBuilder ConfigServices(this WebApplicationBuilder builder)
    {
        Log.Logger = new LoggerConfiguration()
                .Enrich.FromLogContext()
                .WriteTo.Console()
                .CreateLogger();

        // Add services to the container.
        // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
        builder.Services
            .AddDatabase(builder.Configuration)
            .AddEndpointsApiExplorer()
            .AddSwaggerGen()
            .AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies())
            .AddMediatR(config => config.RegisterServicesFromAssembly(Assembly.GetEntryAssembly()))
            .AddProblemDetails()
            .AddCors(opt =>
            {
                opt.AddPolicy("AllowAll", builder =>
                {
                    builder.AllowAnyOrigin()
                    .AllowAnyMethod()
                    .AllowAnyHeader();
                });
            });
        return builder;
    }

    public static void Start(this WebApplication app)
    {
        using (var scope = app.Services.CreateScope())
        {
            var services = scope.ServiceProvider;

            try
            {
                var context = services.GetRequiredService<EfContext>();
                context.Database.EnsureCreated();
            }
            catch (Exception ex)
            {
                var logger = services.GetRequiredService<ILogger<Program>>();
                logger.LogError(ex, "An error occurred while initializing the database.");
                throw;
            }
        }

        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseHttpsRedirection();
        app.MapEndpoints();
        app.UseCors("AllowAll");
        app.Run();
    }
}
