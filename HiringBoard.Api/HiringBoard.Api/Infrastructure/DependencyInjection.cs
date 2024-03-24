using HiringBoard.Api.Application.Common.Interface;
using HiringBoard.Api.Infrastructure.Database.Context;
using HiringBoard.Api.Infrastructure.Database.UnitOfWork;
using Microsoft.EntityFrameworkCore;

namespace HiringBoard.Api.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddDatabase(this IServiceCollection services, IConfiguration config)
    {
        services
            .AddDbContext<EfContext>(opt => opt.UseMySQL(config.GetConnectionString("EfContext")))
            .AddScoped<IUnitOfWork, UnitOfWork>();
        return services;
    }
}
