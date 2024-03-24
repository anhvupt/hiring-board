using AutoMapper;
using HiringBoard.Api.Application.Common.Interface;
using HiringBoard.Api.Domain.Common;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HiringBoard.Api.Application.Features.Common;
public abstract class AbstractHandler<TRequest, TResponse>(IServiceProvider serviceProvider)
    : IRequestHandler<TRequest, TResponse> where TRequest : IRequest<TResponse>
{
    protected IServiceProvider ServiceProvider { get; init; } = serviceProvider;
    protected IMapper Mapper => GetService<IMapper>();
    protected IUnitOfWork Uow => GetService<IUnitOfWork>();

    public abstract Task<TResponse> Handle(TRequest request, CancellationToken cancellationToken);
    protected DbSet<T> DbSet<T>() where T : EntityBase
    {
        return Uow.Set<T>();
    }

    protected T GetService<T>()
    {
        return ServiceProvider.GetRequiredService<T>();
    }
}
