using AutoMapper;
using HiringBoard.Api.Application.Features.Common;
using HiringBoard.Api.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace HiringBoard.Api.Application.Features.Interviews;

public static class UpdateCandidateDetails
{
    public static IEndpointRouteBuilder MapUpdateCandidateDetails(this IEndpointRouteBuilder app)
    {
        app.MapPut("candidates/{id}",
            async (IMediator mediator, [FromRoute] int Id, [FromBody] UpdateCandidateDetailsCommand query) => await mediator.Send(query))
            .Produces(StatusCodes.Status204NoContent);

        return app;
    }

    public class UpdateCandidateDetailsCommand : IRequest<IResult>
    {
        [FromRoute] public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Notes { get; set; }
        public int InterviewerId { get; set; }
        public int StageId { get; set; }
        public DateTime InterviewDate { get; set; }
    }

    public class Profile : AutoMapper.Profile
    {
        public Profile()
        {
            CreateMap<UpdateCandidateDetailsCommand, Candidate>()
                .AfterMap((src, target) =>
                {
                    target.Interview = new Interview
                    {
                        Notes = src.Notes,
                        InterviewerId = src.InterviewerId,
                        StageId = src.StageId
                    };
                });
        }
    }

    public class Handler(IServiceProvider sp) : AbstractHandler<UpdateCandidateDetailsCommand, IResult>(sp)
    {
        public override async Task<IResult> Handle(UpdateCandidateDetailsCommand request, CancellationToken cancellationToken)
        {
            var entity = await DbSet<Candidate>().FindAsync(request.Id, cancellationToken);
            if (entity == null)
            {
                return TypedResults.NotFound();
            }
            Mapper.Map(request, entity);
            await Uow.SaveChangesAsync(cancellationToken);

            return TypedResults.NoContent();
        }
    }
}