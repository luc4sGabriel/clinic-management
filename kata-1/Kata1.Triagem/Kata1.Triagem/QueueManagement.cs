using System;
using System.Collections.Generic;
using System.Text;

namespace Kata1.Triagem
{
    public class QueueManagement
    {
        public List<Patient> OrderQueue(List<Patient> patients)
        {
            return patients
                .OrderByDescending(p => p.ProcessUrgency())
                .ThenBy(p => p.ArrivalTime)
                .ToList();
        }
    }
}
