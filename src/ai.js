import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the API using the secret key from your .env file
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function generateMindMapFromAI(rawText) {
  // We use the 'gemini-2.5-flash' model because it is incredibly fast and free
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
    You are an expert data structurer and mind-map creator. 
    The user will provide raw, messy, unstructured notes.
    Your ONLY job is to extract the hierarchy of concepts and output a strict dashed list.
    
    Rules for the output:
    - Main topics have 0 dashes (e.g., Photosynthesis)
    - Sub-topics have 1 dash (e.g., - Light Reaction)
    - Sub-sub-topics have 2 dashes (e.g., -- Chloroplast)
    - Keep node labels very short (1-4 words).
    - Group related concepts intelligently even if they are scattered in the text.
    - Output absolutely NOTHING else. No markdown code blocks, no intros, no greetings.
    
    User's Notes:
    ${rawText}
  `;

  try {
    // Send the prompt to Google's servers
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let formattedText = response.text();
    
    // Safety check: Clean up any accidental markdown blocks the AI might return
    formattedText = formattedText.replace(/```(text|markdown)?/g, '').replace(/```/g, '').trim();
    
    return formattedText;
  } catch (error) {
    console.error("AI Generation Error:", error);
    throw new Error("Failed to reach Google Gemini. Did you add your API key to the .env file?");
  }
}
