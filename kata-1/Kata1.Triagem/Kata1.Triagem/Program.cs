using System;
using System.Collections.Generic;
using Kata1.Triagem;

var patients = new List<Patient>
{
    new Patient { Name = "João (elderly)", Age = 65, OriginalUrgency = Urgency.MEDIUM, ArrivalTime = DateTime.Now.AddMinutes(-10) },
    new Patient { Name = "Enzo (Minor)", Age = 15, OriginalUrgency = Urgency.HIGH, ArrivalTime = DateTime.Now.AddMinutes(-5) },
    new Patient { Name = "Maria", Age = 30, OriginalUrgency = Urgency.CRITIC, ArrivalTime = DateTime.Now }
};

var management = new QueueManagement();
var orderedQueue = management.OrderQueue(patients);

Console.WriteLine("Fila Ordenada:");
foreach (var p in orderedQueue)
{
    Console.WriteLine($"{p.Name} - Final Priority: {p.ProcessUrgency()} - Arrive: {p.ArrivalTime.ToShortTimeString()}");
}