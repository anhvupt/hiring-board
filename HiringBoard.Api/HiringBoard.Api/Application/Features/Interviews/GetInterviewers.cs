using HiringBoard.Api.Application.Features.Common;
using HiringBoard.Api.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HiringBoard.Api.Application.Features.Interviews;
public static class GetInterviewers
{
    public static IEndpointRouteBuilder MapGetInterviewers(this IEndpointRouteBuilder app)
    {
        app.MapGet("interviewers",
            async (IMediator mediator, [AsParameters] InterviewerListQuery query) => await mediator.Send(query))
            .Produces(StatusCodes.Status200OK);

        return app;
    }

    public class InterviewerListQuery : IRequest<List<InterviewerResponse>>;

    public class InterviewerResponse
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }

    public class Profile : AutoMapper.Profile
    {
        public Profile()
        {
            CreateMap<Interviewer, InterviewerResponse>();
        }
    }

    public class Handler(IServiceProvider sp) : AbstractHandler<InterviewerListQuery, List<InterviewerResponse>>(sp)
    {
        public override async Task<List<InterviewerResponse>> Handle(InterviewerListQuery request, CancellationToken cancellationToken)
        {
            var list = await DbSet<Interviewer>().AsNoTracking()
                .Where(x => !x.IsDeleted)
                .ToListAsync(cancellationToken);

            return Mapper.Map<List<InterviewerResponse>>(list).ToList();
        }
    }
}



