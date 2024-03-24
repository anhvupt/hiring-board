﻿using AutoMapper;
using HiringBoard.Api.Application.Common.Extensions;
using HiringBoard.Api.Application.Features.Common;
using HiringBoard.Api.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HiringBoard.Api.Application.Features.Interviews;
public static class GetCandidates
{
    public static IEndpointRouteBuilder MapGetCandidates(this IEndpointRouteBuilder app)
    {
        app.MapGet("candidates", async (IMediator mediator, [AsParameters] Query query) => await mediator.Send(query))
            .Produces(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status400BadRequest)
            .Produces(StatusCodes.Status404NotFound);
        return app;
    }

    public class Query : IRequest<IDictionary<string, List<Response>>>
    {
        public int? InterviewerId { get; set; }
        public DateTime? InterviewDate { get; set; }
        public string? Search { get; set; }
    }

    public class Response
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Notes { get; set; }
        public string Interviewer { get; set; }
        public DateTime InterviewDate { get; set; }
    }

    public class ResponseProfile : Profile
    {
        public ResponseProfile()
        {
            CreateMap<Interview, Response>()
                .ForMember(x => x.Name, opt => opt.MapFrom(x => $"{x.Candidate.FirstName} {x.Candidate.LastName}"))
                .ForMember(x => x.Email, opt => opt.MapFrom(x => x.Candidate.Email))
                .ForMember(x => x.Phone, opt => opt.MapFrom(x => x.Candidate.Phone))
                .ForMember(x => x.Notes, opt => opt.MapFrom(x => x.Notes))
                .ForMember(x => x.Interviewer, opt => opt.MapFrom(x => x.Interviewer.Name))
                .ForMember(x => x.InterviewDate, opt => opt.MapFrom(x => x.InterviewDate.LocalDateTime));
        }
    }

    public class Handler(IServiceProvider sp) : AbstractHandler<Query, IDictionary<string, List<Response>>>(sp)
    {
        public override async Task<IDictionary<string, List<Response>>> Handle(Query request, CancellationToken cancellationToken)
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
                .WhereIf(request.InterviewDate is not null,
                    x => x.InterviewDate.Date == ((DateTime)request.InterviewDate).ToUniversalTime().Date)
                .GroupBy(x => x.Stage.Name)
                .ToDictionaryAsync(x => x.Key, x => x.ToList(), cancellationToken);

            return Mapper.Map<Dictionary<string, List<Response>>>(list);
        }
    }
}



