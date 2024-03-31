using AutoMapper;
using HiringBoard.Api.Application.Common.Extensions;
using HiringBoard.Api.Application.Features.Common;
using HiringBoard.Api.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HiringBoard.Api.Application.Features.Interviews;
public static class GetCandidates
{
    public static IEndpointRouteBuilder MapGetCandidates(this IEndpointRouteBuilder app)
    {
        app.MapGet("candidates", async (IMediator mediator, [AsParameters] CandidateListQuery query) =>
            {
                return await mediator.Send(query);
            })
            .Produces(StatusCodes.Status200OK);
        return app;
    }

    public class CandidateListQuery : IRequest<IDictionary<int, List<CandidateListResponse>>>
    {
        public int? InterviewerId { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string? Search { get; set; }
    }

    public class CandidateListResponse
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Position { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Notes { get; set; }
        public string Interviewer { get; set; }
        public DateTime CreatedDate { get; set; }
    }

    public class Profile : AutoMapper.Profile
    {
        public Profile()
        {
            CreateMap<Interview, CandidateListResponse>()
                .ForMember(x => x.Name, opt => opt.MapFrom(x => $"{x.Candidate.FirstName} {x.Candidate.LastName}"))
                .ForMember(x => x.Email, opt => opt.MapFrom(x => x.Candidate.Email))
                .ForMember(x => x.Phone, opt => opt.MapFrom(x => x.Candidate.Phone))
                .ForMember(x => x.Notes, opt => opt.MapFrom(x => x.Notes))
                .ForMember(x => x.Interviewer, opt => opt.MapFrom(x => x.Interviewer.Name))
                .ForMember(x => x.CreatedDate, opt => opt.MapFrom(x => x.CreatedDate.LocalDateTime));
        }
    }

    public class Handler(IServiceProvider sp) : AbstractHandler<CandidateListQuery, IDictionary<int, List<CandidateListResponse>>>(sp)
    {
        public override async Task<IDictionary<int, List<CandidateListResponse>>> Handle(CandidateListQuery request, CancellationToken cancellationToken)
        {
            var list = await DbSet<Interview>().AsNoTracking()
                .Where(x => !x.IsDeleted)
                .Include(x => x.Candidate)
                .Include(x => x.Interviewer)
                .Include(x => x.Stage)
                .WhereIf(!string.IsNullOrWhiteSpace(request.Search),
                    x => x.Candidate.FirstName.Contains(request.Search)
                    || x.Candidate.LastName.Contains(request.Search))
                .WhereIf(request.InterviewerId is not null and > 0,
                    x => x.Interviewer.Id == request.InterviewerId)
                .WhereIf(request.CreatedDate is not null,
                    x => x.CreatedDate.Date == ((DateTime)request.CreatedDate).ToUniversalTime().Date)
                .GroupBy(x => x.Stage.Id)
                .ToDictionaryAsync(x => x.Key, x => x.ToList(), cancellationToken);

            return Mapper.Map<Dictionary<int, List<CandidateListResponse>>>(list);
        }
    }
}



