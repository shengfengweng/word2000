import { GoogleGenAI, Type } from "@google/genai";
import { Word } from "../types";

// The API key is sourced from the environment variable `process.env.API_KEY`.
// This is a hard requirement and assumed to be configured in the execution environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        sentence: {
            type: Type.STRING,
            description: 'A very simple example sentence for the word.',
        },
    },
    required: ['sentence'],
};

/**
 * Generates a simple, kid-friendly example sentence for a given word.
 * @param word The word to generate a sentence for.
 * @returns A promise that resolves to the example sentence string, or null if an error occurs.
 */
export const generateExampleSentence = async (word: Word): Promise<string | null> => {
    const prompt = `Generate one very simple, kid-friendly example sentence for the English word: '${word.english}'.
The sentence should be easy for a 5-8 year old to understand.
The word's part of speech is '${word.pos}' and its Chinese meaning is '${word.chinese}'.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                temperature: 0.8,
                thinkingConfig: { thinkingBudget: 0 },
            },
        });

        const jsonString = response.text.trim();
        const jsonResponse = JSON.parse(jsonString);
        
        return jsonResponse.sentence || null;

    } catch (error) {
        console.error("Error generating example sentence:", error);
        return null;
    }
};