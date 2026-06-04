import { NextApiRequest, NextApiResponse } from 'next';
import { mockInstitutionDB } from '../../../lib/mockInstitutionDB';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { regNumber } = req.body;

  if (!regNumber) {
    return res.status(400).json({ message: 'Missing Registration Number' });
  }

  // Simulate a brief network delay to make it feel like a real database call
  await new Promise(resolve => setTimeout(resolve, 800));

  const student = mockInstitutionDB.find(
    s => s.regNumber.toLowerCase() === regNumber.trim().toLowerCase()
  );

  if (!student) {
    return res.status(404).json({ message: 'Not found please enter a valid registration number' });
  }

  return res.status(200).json(student);
}
