using Kata1.Triagem;

namespace Kata1.Triage.Tests
{
    public class TriageRulesTests
    {
        [Fact]
        public void Test1()
        {
            var patient = new Patient
            {
                Name = "Elderly Test",
                Age = 65,
                OriginalUrgency = Urgency.MEDIUM
            };

            var finalPriority = patient.ProcessUrgency();

            Assert.Equal(Urgency.HIGH, finalPriority);
        }

        [Fact]
        public void Rule5_MinorWithMediumPriority_ShouldBecomeHigh()
        {
            var patient = new Patient
            {
                Name = "Minor Test",
                Age = 15,
                OriginalUrgency = Urgency.MEDIUM
            };

            var finalPriority = patient.ProcessUrgency();

            Assert.Equal(Urgency.HIGH, finalPriority);
        }

        [Theory]
        [InlineData(17, Urgency.LOW, Urgency.MEDIUM)]     
        [InlineData(60, Urgency.MEDIUM, Urgency.HIGH)]   
        [InlineData(30, Urgency.CRITIC, Urgency.CRITIC)] 
        public void VariousRules_ShouldProcessCorrectPriority(int age, Urgency original, Urgency expected)
        {
            var patient = new Patient { Age = age, OriginalUrgency = original };

            var result = patient.ProcessUrgency();

            Assert.Equal(expected, result);
        }
    }
}
