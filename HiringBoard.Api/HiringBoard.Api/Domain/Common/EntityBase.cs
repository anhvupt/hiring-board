﻿namespace HiringBoard.Api.Domain.Common;
public abstract class EntityBase
{
    public int Id { get; set; }
    public bool IsDeleted { get; set; }
}

