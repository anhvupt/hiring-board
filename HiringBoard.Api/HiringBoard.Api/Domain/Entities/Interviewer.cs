using HiringBoard.Api.Domain.Common;

namespace HiringBoard.Api.Domain.Entities;
public class Interviewer: EntityBase
{
    public string Name { get; set; }
    public virtual List<Interview> Interviews { get; set; } = new();
}

