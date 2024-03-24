﻿using System.Linq.Expressions;

namespace HiringBoard.Api.Application.Common.Extensions;

public static class LinqExtension
{
    public static IQueryable<T> WhereIf<T>(
        this IQueryable<T> source,
        bool condition,
        Expression<Func<T, bool>> predicate)
    {
        return (condition) ? source.Where(predicate) : source;
    }
}
