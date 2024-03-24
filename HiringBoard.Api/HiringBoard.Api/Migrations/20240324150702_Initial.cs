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
                    CandidateId1 = table.Column<int>(type: "int", nullable: true),
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
                        name: "FK_Interviews_Candidates_CandidateId1",
                        column: x => x.CandidateId1,
                        principalTable: "Candidates",
                        principalColumn: "Id");
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
                    { 1, "mireya@champlinrodriguez.name", "Nadia", false, "Altenwerth", "(074)830-2675 x18727" },
                    { 2, "cedrick@durgan.uk", "Cary", false, "Franecki", "034.776.1279 x075" },
                    { 3, "courtney.johnson@nicolas.name", "Kendrick", false, "Hahn", "1-592-952-8665 x3576" },
                    { 4, "yadira@labadiefadel.biz", "Carli", false, "Roob", "500-436-4262 x84315" },
                    { 5, "dominic_kub@heathcote.ca", "Jacques", false, "Abernathy", "(696)465-2404 x3845" },
                    { 6, "casper@jewess.uk", "Loraine", false, "Weber", "(365)554-0101 x0252" },
                    { 7, "ophelia.rice@huelsbergstrom.uk", "Philip", false, "Hackett", "831-711-9989" },
                    { 8, "elena@beckerdonnelly.co.uk", "Margarett", false, "Robel", "(125)242-3587" },
                    { 9, "kaela@wilderman.com", "Jewel", false, "Kihn", "260-893-4757" },
                    { 10, "michale@kassulkeokon.name", "Joy", false, "Osinski", "999-247-8060 x002" }
                });

            migrationBuilder.InsertData(
                table: "Interviewers",
                columns: new[] { "Id", "IsDeleted", "Name" },
                values: new object[,]
                {
                    { 1, false, "Camron Klein" },
                    { 2, false, "Miss Hillary Darby Gusikowski" },
                    { 3, false, "Javier Gutmann" }
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
                columns: new[] { "Id", "CandidateId", "CandidateId1", "InterviewDate", "InterviewerId", "IsDeleted", "Notes", "StageId" },
                values: new object[,]
                {
                    { 1, 1, null, new DateTimeOffset(new DateTime(2024, 3, 24, 22, 7, 1, 770, DateTimeKind.Unspecified).AddTicks(5623), new TimeSpan(0, 7, 0, 0, 0)), 1, false, "Rem est qui incidunt.", 2 },
                    { 2, 2, null, new DateTimeOffset(new DateTime(2024, 3, 24, 22, 7, 1, 770, DateTimeKind.Unspecified).AddTicks(6833), new TimeSpan(0, 7, 0, 0, 0)), 1, false, "Mollitia optio quod excepturi perspiciatis nihil qui.", 1 },
                    { 3, 3, null, new DateTimeOffset(new DateTime(2024, 3, 24, 22, 7, 1, 770, DateTimeKind.Unspecified).AddTicks(8299), new TimeSpan(0, 7, 0, 0, 0)), 2, false, "Esse eos dolor sint magnam sapiente consectetur sed aperiam laboriosam.", 3 },
                    { 4, 4, null, new DateTimeOffset(new DateTime(2024, 3, 24, 22, 7, 1, 771, DateTimeKind.Unspecified).AddTicks(547), new TimeSpan(0, 7, 0, 0, 0)), 1, false, "Aliquid placeat omnis repellendus eos dolor tempora itaque ut delectus.", 1 },
                    { 5, 5, null, new DateTimeOffset(new DateTime(2024, 3, 24, 22, 7, 1, 771, DateTimeKind.Unspecified).AddTicks(2628), new TimeSpan(0, 7, 0, 0, 0)), 2, false, "Saepe unde sit et consequuntur.", 1 },
                    { 6, 6, null, new DateTimeOffset(new DateTime(2024, 3, 24, 22, 7, 1, 771, DateTimeKind.Unspecified).AddTicks(3725), new TimeSpan(0, 7, 0, 0, 0)), 2, false, "Quam dolorem quis recusandae illo est accusantium.", 3 },
                    { 7, 7, null, new DateTimeOffset(new DateTime(2024, 3, 24, 22, 7, 1, 771, DateTimeKind.Unspecified).AddTicks(5263), new TimeSpan(0, 7, 0, 0, 0)), 2, false, "Quia eos ab vitae repellendus sint itaque.", 2 },
                    { 8, 8, null, new DateTimeOffset(new DateTime(2024, 3, 24, 22, 7, 1, 771, DateTimeKind.Unspecified).AddTicks(6678), new TimeSpan(0, 7, 0, 0, 0)), 2, false, "Autem quia est consequatur non qui maiores necessitatibus nisi.", 3 },
                    { 9, 9, null, new DateTimeOffset(new DateTime(2024, 3, 24, 22, 7, 1, 771, DateTimeKind.Unspecified).AddTicks(8576), new TimeSpan(0, 7, 0, 0, 0)), 2, false, "Quasi eligendi eligendi qui excepturi assumenda animi quibusdam voluptate dolorem.", 2 },
                    { 10, 10, null, new DateTimeOffset(new DateTime(2024, 3, 24, 22, 7, 1, 772, DateTimeKind.Unspecified).AddTicks(2402), new TimeSpan(0, 7, 0, 0, 0)), 2, false, "Facilis aut voluptatum eum inventore odit pariatur iste.", 3 }
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
                name: "IX_Interviews_CandidateId1",
                table: "Interviews",
                column: "CandidateId1",
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
