const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'ProjectSupervision-1.xlsx');
const outPath = path.join(__dirname, 'src', 'lib', 'mockInstitutionDB.ts');

try {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
  
  // Data starts at index 1 because row 0 is headers
  const students = [];
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const regNumber = row['__EMPTY_1'];
    const fullName = row['Project Supervision Allocation'];
    
    if (regNumber && fullName) {
      students.push({
        regNumber: regNumber.toString().trim(),
        fullName: fullName.toString().trim(),
        faculty: "Science",
        department: "Computer Science",
        admissionYear: 2021,
        expectedGraduationYear: 2025,
        gender: "Not Specified", // Could be guessed or left for the student to update
        phoneNumber: "",
        email: `${regNumber.toString().trim().toLowerCase()}@university.edu.ng`,
        dateOfBirth: "2000-01-01",
        stateOfOrigin: "Unknown",
        address: "Campus Hostel",
        nextOfKin: "Unknown",
        nextOfKinGSM: "",
        nextOfKinAddress: ""
      });
    }
  }

  const tsContent = `export interface InstitutionStudent {
  regNumber: string;
  fullName: string;
  faculty: string;
  department: string;
  admissionYear: number;
  expectedGraduationYear: number;
  gender: string;
  phoneNumber: string;
  email: string;
  dateOfBirth: string; // YYYY-MM-DD
  stateOfOrigin: string;
  address: string;
  nextOfKin: string;
  nextOfKinGSM: string;
  nextOfKinAddress: string;
}

export const mockInstitutionDB: InstitutionStudent[] = ${JSON.stringify(students, null, 2)};
`;

  fs.writeFileSync(outPath, tsContent);
  console.log(`Successfully extracted ${students.length} students and wrote to mockInstitutionDB.ts`);
} catch (err) {
  console.error("Error transforming file:", err);
}
