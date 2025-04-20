using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace IbanApi.Migrations
{
    
    public partial class AddRaionLocalitate : Migration
    {
        
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Raioane",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Raioane", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Localitati",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RaionId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Localitati", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Localitati_Raioane_RaionId",
                        column: x => x.RaionId,
                        principalTable: "Raioane",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Localitati_RaionId",
                table: "Localitati",
                column: "RaionId");
        }

        
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Localitati");

            migrationBuilder.DropTable(
                name: "Raioane");
        }
    }
}
