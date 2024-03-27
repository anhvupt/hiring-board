using HiringBoard.Api.Application.Features.Common;
using HiringBoard.Api.Domain.Entities;
using MediatR;
using System.ComponentModel.DataAnnotations;

namespace HiringBoard.Api.Application.Features.Interviews;
public static class UpdateCandidateStage
{
    public static IEndpointRouteBuilder MapUpdateCandidateStage(this IEndpointRouteBuilder app)
    {
        app.MapPatch("candidates/stages",
            async (IMediator mediator, UpdateCandidateStageCommand query) => await mediator.Send(query))
            .Produces(StatusCodes.Status204NoContent);
        return app;
    }

    public class UpdateCandidateStageCommand : IRequest<IResult>
    {
        public List<int> Ids { get; set; }
        [Range(1, int.MaxValue)]
        public int StageId { get; set; }
    }

    public class Handler(IServiceProvider sp) : AbstractHandler<UpdateCandidateStageCommand, IResult>(sp)
    {
        public override async Task<IResult> Handle(UpdateCandidateStageCommand request, CancellationToken cancellationToken)
        {
            var candidates = DbSet<Interview>().Where(x => request.Ids.Contains(x.CandidateId));
            foreach(var candidate in candidates)
            {
                candidate.StageId = request.StageId;
            }
            await Uow.SaveChangesAsync(cancellationToken);

            return TypedResults.NoContent();
        }
    }
}
