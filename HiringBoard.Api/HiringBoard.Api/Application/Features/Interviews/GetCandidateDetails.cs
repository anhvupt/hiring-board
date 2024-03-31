using AutoMapper;
using HiringBoard.Api.Application.Features.Common;
using HiringBoard.Api.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace HiringBoard.Api.Application.Features.Interviews;
public static class GetCandidateDetails
{
    public static IEndpointRouteBuilder MapGetCandidateDetails(this IEndpointRouteBuilder app)
    {
        app.MapGet(
            "candidates/{id}",
            async (IMediator mediator, [AsParameters] CandidateDetailsQuery query) =>
            {
                return await mediator.Send(query);
            }).Produces<CandidateDetailsResponse>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status404NotFound);
        return app;
    }

    public class CandidateDetailsQuery : IRequest<CandidateDetailsResponse>
    {
        [FromRoute] public int Id { get; set; }
    }

    public class CandidateDetailsResponse
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Position { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Notes { get; set; }
        public int InterviewerId { get; set; }
        public int StageId { get; set; }
        public DateTime CreatedDate { get; set; }
    }

    public class Profile : AutoMapper.Profile
    {
        public Profile()
        {
            CreateMap<Candidate, CandidateDetailsResponse>()
                .ForMember(x => x.Notes, opt => opt.MapFrom(x => x.Interview.Notes))
                .ForMember(x => x.Position, opt => opt.MapFrom(x => x.Interview.Position))
                .ForMember(x => x.InterviewerId, opt => opt.MapFrom(x => x.Interview.InterviewerId))
                .ForMember(x => x.StageId, opt => opt.MapFrom(x => x.Interview.StageId))
                .ForMember(x => x.CreatedDate, opt => opt.MapFrom(x => x.Interview.CreatedDate.LocalDateTime));
        }
    }

    public class Handler(IServiceProvider sp) : AbstractHandler<CandidateDetailsQuery, CandidateDetailsResponse>(sp)
    {
        public override async Task<CandidateDetailsResponse> Handle(CandidateDetailsQuery request, CancellationToken cancellationToken)
        {
            var entity = await DbSet<Candidate>().AsNoTracking()
                .Where(x => !x.IsDeleted && x.Id == request.Id)
                .Include(x => x.Interview)
                .FirstOrDefaultAsync(cancellationToken);

            return Mapper.Map<CandidateDetailsResponse>(entity);
        }
    }
}
