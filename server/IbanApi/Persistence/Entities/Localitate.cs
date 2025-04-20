namespace IbanApi.Persistence.Entities
{
    public class Localitate
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public int RaionId { get; set; }
        public Raion Raion { get; set; } = null!;
    }
}