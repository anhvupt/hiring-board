using HiringBoard.Api.Domain.Common;

namespace HiringBoard.Api.Domain.Entities;
public class Candidate : EntityBase
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string Phone { get; set; }
    public virtual Interview Interview { get; set; }
}

