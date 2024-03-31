using HiringBoard.Api.Domain.Common;

namespace HiringBoard.Api.Domain.Entities;
public class Interview : EntityBase
{
    public string Notes { get; set; }
    public int CandidateId { get; set; }
    public string Position { get; set; }
    public int? InterviewerId { get; set; }
    public int? StageId { get; set; }
    public DateTimeOffset CreatedDate { get; set; } = DateTimeOffset.Now;
    public virtual Candidate Candidate { get; set; }
    public virtual Interviewer Interviewer { get; set; }
    public virtual Stage Stage { get; set; }
}
