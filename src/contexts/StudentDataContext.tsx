import React, { createContext, useContext, useState } from "react";

export interface Student {
  no: number;
  name: string;
  email: string;
  skill: string;
}

interface StudentDataContextType {
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
}

const defaultStudents: Student[] = [
  {
    no: 1,
    name: "Bayu Fauzan",
    email: "bayul234@gmail.com",
    skill: "UI/UX",
  },
  {
    no: 2,
    name: "Veri Kopling",
    email: "veril234@gmail.com",
    skill: "Back End",
  },
  {
    no: 3,
    name: "Andini Putri",
    email: "andini@gmail.com",
    skill: "Front End",
  },
  {
    no: 4,
    name: "Rizky Pratama",
    email: "rizky@gmail.com",
    skill: "Data Analyst",
  },
];

const StudentDataContext = createContext<StudentDataContextType>({
  students: [],
  setStudents: () => {},
});

export const StudentDataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [students, setStudents] = useState<Student[]>(defaultStudents);

  return (
    <StudentDataContext.Provider value={{ students, setStudents }}>
      {children}
    </StudentDataContext.Provider>
  );
};

export const useStudentData = () => useContext(StudentDataContext);
