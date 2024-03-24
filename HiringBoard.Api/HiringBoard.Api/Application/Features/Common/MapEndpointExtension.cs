using HiringBoard.Api.Application.Features.Interviews;

namespace HiringBoard.Api.Application.Features.Common;

public static class MapEndpointExtension
{
    public static IEndpointRouteBuilder MapEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapGroup("api/interviews")
            .WithTags("Hiring Api")
            .WithOpenApi()
            //.MapCreateCandidate()
            .MapGetCandidates();
            //.MapGetInterviewers()
            //.MapGetStages()
            //.MapGetCandidateDetails()
            //.MapUpdateCandidateDetails()
            //.MapUpdateCandidateStage();

        return app;
    }
}
