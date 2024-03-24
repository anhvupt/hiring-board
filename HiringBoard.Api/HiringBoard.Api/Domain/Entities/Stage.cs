using HiringBoard.Api.Domain.Common;

namespace HiringBoard.Api.Domain.Entities;
public class Stage: EntityBase
{
    public string Name { get; set; }
    public List<Interview> Interviews { get; set; } = new();
}

