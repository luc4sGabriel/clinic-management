CREATE TABLE Patients (
    Id GUID PRIMARY KEY,
    FullName VARCHAR(255) NOT NULL,
    BirthDate DATE NOT NULL,
    TaxId VARCHAR(11) UNIQUE,
    PhoneNumber VARCHAR(20)
);

CREATE TABLE TriageQueue (
    Id GUID PRIMARY KEY,
    PatientId GUID NOT NULL,
    OriginalPriority INT NOT NULL, 
    ProcessedPriority INT NOT NULL, 
    ArrivalTime TIMESTAMP NOT NULL,
    Status VARCHAR(50) DEFAULT 'Waiting', -- Waiting, In Progress, Finished
    FOREIGN KEY (PatientId) REFERENCES Patients(Id)
);

CREATE TABLE Appointments (
    Id GUID PRIMARY KEY,
    QueueId GUID NOT NULL,
    DoctorName VARCHAR(255),
    StartTime TIMESTAMP,
    EndTime TIMESTAMP,
    Notes TEXT,
    FOREIGN KEY (QueueId) REFERENCES TriageQueue(Id)
);