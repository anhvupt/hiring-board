using HiringBoard.Api.Application.Common.Interface;
using HiringBoard.Api.Domain.Common;
using HiringBoard.Api.Infrastructure.Database.Context;
using Microsoft.EntityFrameworkCore;

namespace HiringBoard.Api.Infrastructure.Database.UnitOfWork;
public class UnitOfWork(EfContext dataContext) : IUnitOfWork
{
    private bool _disposed;

    public DbContext DataContext { get; private set; } = dataContext;

    public DbSet<T> Set<T>() where T : EntityBase
    {
        return DataContext.Set<T>();
    }

    public Task<int> SaveChangesAsync()
    {
        return DataContext.SaveChangesAsync();
    }

    public Task<int> SaveChangesAsync(CancellationToken cancellationToken)
    {
        return DataContext.SaveChangesAsync(cancellationToken);
    }

    public override string ToString()
    {
        return DataContext.ContextId.InstanceId.ToString();
    }

    #region Destructors

    public void Dispose()
    {
        Dispose(true);
        GC.SuppressFinalize(this);
    }

    ~UnitOfWork()
    {
        Dispose(false);
    }

    protected virtual void Dispose(bool disposing)
    {
        if (!_disposed)
        {
            if (disposing)
            {
                DataContext.Dispose();
                DataContext = null!;
            }

            _disposed = true;
        }
    }

    #endregion
}