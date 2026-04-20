using System;
using System.Collections.Generic;
using System.Text;

namespace Kata1.Triagem
{
    public class Patient
    {
        public string Name { get; set; }
        public int Age { get; set; }
        public Urgency OriginalUrgency { get; set; }
        public DateTime ArrivalTime { get; set; }

        public Urgency ProcessUrgency()
        {
            var finalUrgency = OriginalUrgency;

            if(Age >= 60 && finalUrgency == Urgency.MEDIUM)
            {
                finalUrgency = Urgency.HIGH;
            }

            if(Age < 18)
            {
                int newPriority = Math.Min((int)finalUrgency + 1, (int)Urgency.CRITIC);
                finalUrgency = (Urgency)newPriority;
            }

            return finalUrgency;
        }
    }
}
