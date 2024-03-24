using AutoMapper;
using HiringBoard.Api.Application.Features.Common;
using HiringBoard.Api.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HiringBoard.Api.Application.Features.Interviews;
public static class GetCandidateDetails
{
    public static IEndpointRouteBuilder MapGetCandidateDetails(this IEndpointRouteBuilder app)
    {
        app.MapGet("candidates/{id}", async (IMediator mediator, Query query) => await mediator.Send(query))
            .Produces(200)
            .Produces(400)
            .Produces(404);
        return app;
    }

    public class Query : IRequest<Response>
    {
        public int Id { get; set; }
    }

    public class Response
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Notes { get; set; }
        public int InterviewerId { get; set; }
        public int StageId { get; set; }
        public DateTime InterviewDate { get; set; }
    }

    public class ResponseProfile : Profile
    {
        public ResponseProfile()
        {
            CreateMap<Candidate, Response>()
                .ForMember(x => x.Notes, opt => opt.MapFrom(x => x.Interview.Notes))
                .ForMember(x => x.InterviewerId, opt => opt.MapFrom(x => x.Interview.InterviewerId))
                .ForMember(x => x.StageId, opt => opt.MapFrom(x => x.Interview.StageId))
                .ForMember(x => x.InterviewDate, opt => opt.MapFrom(x => x.Interview.InterviewDate));
        }
    }

    public class Handler(IServiceProvider sp) : AbstractHandler<Query, Response>(sp)
    {
        public override async Task<Response> Handle(Query request, CancellationToken cancellationToken)
        {
            var entity = await DbSet<Candidate>().AsNoTracking()
                .Where(x => !x.IsDeleted && x.Id == request.Id)
                .Include(x => x.Interview)
                .FirstOrDefaultAsync();

            return Mapper.Map<Response>(entity);
        }
    }
}
