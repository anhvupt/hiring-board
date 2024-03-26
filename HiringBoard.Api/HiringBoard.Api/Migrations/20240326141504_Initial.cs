using System;
using Microsoft.EntityFrameworkCore.Migrations;
using MySql.EntityFrameworkCore.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace HiringBoard.Api.Migrations
{
    /// <inheritdoc />
    public partial class Initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Candidates",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    FirstName = table.Column<string>(type: "varchar(255)", nullable: false),
                    LastName = table.Column<string>(type: "varchar(255)", nullable: false),
                    Email = table.Column<string>(type: "longtext", nullable: false),
                    Phone = table.Column<string>(type: "longtext", nullable: false),
                    IsDeleted = table.Column<bool>(type: "tinyint(1)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Candidates", x => x.Id);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Interviewers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(type: "longtext", nullable: false),
                    IsDeleted = table.Column<bool>(type: "tinyint(1)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Interviewers", x => x.Id);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Stages",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(type: "longtext", nullable: false),
                    IsDeleted = table.Column<bool>(type: "tinyint(1)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Stages", x => x.Id);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Interviews",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    Notes = table.Column<string>(type: "longtext", nullable: false),
                    InterviewDate = table.Column<DateTimeOffset>(type: "datetime", nullable: false),
                    CandidateId = table.Column<int>(type: "int", nullable: false),
                    InterviewerId = table.Column<int>(type: "int", nullable: true),
                    StageId = table.Column<int>(type: "int", nullable: true),
                    IsDeleted = table.Column<bool>(type: "tinyint(1)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Interviews", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Interviews_Candidates_CandidateId",
                        column: x => x.CandidateId,
                        principalTable: "Candidates",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Interviews_Interviewers_InterviewerId",
                        column: x => x.InterviewerId,
                        principalTable: "Interviewers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Interviews_Stages_StageId",
                        column: x => x.StageId,
                        principalTable: "Stages",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.InsertData(
                table: "Candidates",
                columns: new[] { "Id", "Email", "FirstName", "IsDeleted", "LastName", "Phone" },
                values: new object[,]
                {
                    { 1, "josiah.stokes@cassinbrakus.co.uk", "Carmine", false, "Lakin", "399.443.6655" },
                    { 2, "melvin_ward@swaniawski.info", "Shaylee", false, "Mitchell", "1-190-432-7848 x2744" },
                    { 3, "demarcus_hoeger@cruickshank.com", "Samara", false, "Feeney", "598-173-8221 x35450" },
                    { 4, "josiah.schaefer@greenfelderbrekke.ca", "Nayeli", false, "Wilkinson", "1-307-834-3481 x03372" },
                    { 5, "jamil_davis@beier.uk", "Stewart", false, "Bartoletti", "(969)416-1116" },
                    { 6, "moshe@ornschaden.ca", "Vinnie", false, "Luettgen", "861.001.4966" },
                    { 7, "phyllis_bayer@heaney.ca", "Jude", false, "Cormier", "(208)624-6540" },
                    { 8, "ubaldo_kunze@abbott.info", "Francesco", false, "Bruen", "838.750.0933 x07702" },
                    { 9, "elizabeth_kiehn@kundehilpert.us", "Joaquin", false, "Gerlach", "(406)500-2983" },
                    { 10, "floy_eichmann@brakusbuckridge.uk", "Roxane", false, "Trantow", "414-429-4374 x966" }
                });

            migrationBuilder.InsertData(
                table: "Interviewers",
                columns: new[] { "Id", "IsDeleted", "Name" },
                values: new object[,]
                {
                    { 1, false, "Prof. Elsie Muller" },
                    { 2, false, "Prof. Ladarius Boehm" },
                    { 3, false, "Nakia Baumbach" }
                });

            migrationBuilder.InsertData(
                table: "Stages",
                columns: new[] { "Id", "IsDeleted", "Name" },
                values: new object[,]
                {
                    { 1, false, "Applied" },
                    { 2, false, "Interviewing" },
                    { 3, false, "Offered" },
                    { 4, false, "Hired" }
                });

            migrationBuilder.InsertData(
                table: "Interviews",
                columns: new[] { "Id", "CandidateId", "InterviewDate", "InterviewerId", "IsDeleted", "Notes", "StageId" },
                values: new object[,]
                {
                    { 1, 1, new DateTimeOffset(new DateTime(2024, 3, 26, 21, 15, 3, 799, DateTimeKind.Unspecified).AddTicks(5064), new TimeSpan(0, 7, 0, 0, 0)), 1, false, "Ullam architecto porro quisquam facilis et quia ut eum.", 2 },
                    { 2, 2, new DateTimeOffset(new DateTime(2024, 3, 26, 21, 15, 3, 799, DateTimeKind.Unspecified).AddTicks(6712), new TimeSpan(0, 7, 0, 0, 0)), 2, false, "Amet omnis tempora animi similique sint.", 2 },
                    { 3, 3, new DateTimeOffset(new DateTime(2024, 3, 26, 21, 15, 3, 799, DateTimeKind.Unspecified).AddTicks(7642), new TimeSpan(0, 7, 0, 0, 0)), 1, false, "Similique repellat corrupti unde architecto expedita et non.", 1 },
                    { 4, 4, new DateTimeOffset(new DateTime(2024, 3, 26, 21, 15, 3, 799, DateTimeKind.Unspecified).AddTicks(8828), new TimeSpan(0, 7, 0, 0, 0)), 1, false, "Voluptatem praesentium maxime omnis perspiciatis quos sit.", 1 },
                    { 5, 5, new DateTimeOffset(new DateTime(2024, 3, 26, 21, 15, 3, 800, DateTimeKind.Unspecified).AddTicks(5), new TimeSpan(0, 7, 0, 0, 0)), 2, false, "Amet et aliquid perspiciatis nostrum voluptatem.", 1 },
                    { 6, 6, new DateTimeOffset(new DateTime(2024, 3, 26, 21, 15, 3, 800, DateTimeKind.Unspecified).AddTicks(914), new TimeSpan(0, 7, 0, 0, 0)), 2, false, "Quia ab omnis fugiat vel optio impedit sit.", 1 },
                    { 7, 7, new DateTimeOffset(new DateTime(2024, 3, 26, 21, 15, 3, 800, DateTimeKind.Unspecified).AddTicks(2149), new TimeSpan(0, 7, 0, 0, 0)), 2, false, "Quo animi aliquam nam autem.", 1 },
                    { 8, 8, new DateTimeOffset(new DateTime(2024, 3, 26, 21, 15, 3, 800, DateTimeKind.Unspecified).AddTicks(2910), new TimeSpan(0, 7, 0, 0, 0)), 1, false, "Saepe illum provident voluptatibus rerum.", 2 },
                    { 9, 9, new DateTimeOffset(new DateTime(2024, 3, 26, 21, 15, 3, 800, DateTimeKind.Unspecified).AddTicks(3699), new TimeSpan(0, 7, 0, 0, 0)), 1, false, "Cupiditate omnis impedit vitae beatae assumenda consectetur eius.", 3 },
                    { 10, 10, new DateTimeOffset(new DateTime(2024, 3, 26, 21, 15, 3, 800, DateTimeKind.Unspecified).AddTicks(5002), new TimeSpan(0, 7, 0, 0, 0)), 1, false, "Tenetur aliquam iure vel numquam officia consequatur sit.", 2 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Candidate_Firstname",
                table: "Candidates",
                column: "FirstName");

            migrationBuilder.CreateIndex(
                name: "Ix_Candidate_Lastname",
                table: "Candidates",
                column: "LastName");

            migrationBuilder.CreateIndex(
                name: "IX_Interviews_CandidateId",
                table: "Interviews",
                column: "CandidateId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Interviews_InterviewerId",
                table: "Interviews",
                column: "InterviewerId");

            migrationBuilder.CreateIndex(
                name: "IX_Interviews_StageId",
                table: "Interviews",
                column: "StageId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Interviews");

            migrationBuilder.DropTable(
                name: "Candidates");

            migrationBuilder.DropTable(
                name: "Interviewers");

            migrationBuilder.DropTable(
                name: "Stages");
        }
    }
}
