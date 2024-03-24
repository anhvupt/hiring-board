using HiringBoard.Api.Domain.Common;
using Microsoft.EntityFrameworkCore;

namespace HiringBoard.Api.Application.Common.Interface
{
    public interface IUnitOfWork
    {
        DbContext DataContext { get; }

        void Dispose();
        Task<int> SaveChangesAsync();
        Task<int> SaveChangesAsync(CancellationToken cancellationToken);
        DbSet<T> Set<T>() where T : EntityBase;
        string ToString();
    }
}