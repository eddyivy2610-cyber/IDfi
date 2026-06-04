import { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb', // Support base64 PDFs and images up to 10MB
    },
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { fileData, mimeType } = req.body;

  if (!fileData || !mimeType) {
    return res.status(400).json({ message: 'Missing fileData or mimeType' });
  }

  // Collect configured Gemini API keys (including optional fallback keys)
  const apiKeys = [
    process.env.GEMINI_API_KEY_1,
    process.env.GEMINI_API_KEY_2,
    process.env.GEMINI_API_KEY_3,
    process.env.GEMINI_API_KEY, // Fallback legacy key
  ].filter((key): key is string => typeof key === 'string' && key.trim() !== '');

  if (apiKeys.length === 0) {
    console.error('Gemini API: No API keys configured in .env.local');
    return res.status(500).json({ message: 'AI Extraction Service is not configured (missing API keys)' });
  }

  // Iterate over available keys to process with fallback rotation
  for (let i = 0; i < apiKeys.length; i++) {
    const apiKey = apiKeys[i];
    console.log(`Gemini API: Attempting extraction with Key ${i + 1}/${apiKeys.length}`);

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  inlineData: {
                    mimeType: mimeType,
                    data: fileData,
                  },
                },
                {
                  text: 'Extract the student profile details from this document. Carefully analyze the document to find the student\'s full name, registration number (e.g. Matric Number or Jamb Number), course/program of study, sex (must be exactly \'Male\' or \'Female\' if found), date of birth (must be formatted as YYYY-MM-DD if found), and state of origin. Note: Do NOT extract Nationality, UTME/DE Scores, LGA, Faculty, or Level/Year of study. Ignore them completely. Return the output in structured JSON format.',
                },
              ],
            },
          ],
          generationConfig: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: 'OBJECT',
              properties: {
                full_name: { type: 'STRING', description: "The student's full name" },
                studentId: { type: 'STRING', description: "The registration/matriculation number" },
                program: { type: 'STRING', description: "The course/program of study" },
                sex: { type: 'STRING', description: "The gender: 'Male' or 'Female'" },
                dob: { type: 'STRING', description: "The date of birth formatted strictly as YYYY-MM-DD" },
                stateOfOrigin: { type: 'STRING', description: "The state of origin" },
              },
            },
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Google API returned status ${response.status}: ${errorText}`);
      }

      const responseData = await response.json();
      const textResponse = responseData.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!textResponse) {
        throw new Error('Google API response did not contain candidates content text');
      }

      const extractedJson = JSON.parse(textResponse);
      console.log(`Gemini API: Extraction succeeded using Key ${i + 1}`);
      return res.status(200).json(extractedJson);

    } catch (err: any) {
      console.warn(`Gemini API: Key ${i + 1} failed. Error: ${err?.message || err}`, err.cause);
      // If we have more keys left, loop will retry with the next one
    }
  }

  // If we reach here, all keys failed
  console.error('Gemini API: All configured keys failed');
  return res.status(500).json({ message: 'All AI extraction attempts failed. Please ensure your API keys are valid and have quota remaining.' });
}
