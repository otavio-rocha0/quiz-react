
import { GoogleGenAI, Type } from "@google/genai";
import { Question } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const quizSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            question: {
                type: Type.STRING,
                description: "The trivia question text."
            },
            answers: {
                type: Type.ARRAY,
                description: "An array of 4 possible answers.",
                items: {
                    type: Type.OBJECT,
                    properties: {
                        text: {
                            type: Type.STRING,
                            description: "The answer text."
                        },
                        isCorrect: {
                            type: Type.BOOLEAN,
                            description: "True if this answer is the correct one, otherwise false."
                        }
                    },
                    required: ["text", "isCorrect"]
                }
            },
            timeLimit: {
                type: Type.INTEGER,
                description: "Time limit for the question in seconds. Should be between 10 and 30."
            }
        },
        required: ["question", "answers", "timeLimit"]
    }
};


export const generateQuiz = async (topic: string, numQuestions: number): Promise<Question[]> => {
    try {
        const prompt = `Create a fun and engaging quiz with exactly ${numQuestions} multiple-choice questions on the topic of "${topic}".
        Each question must have exactly 4 possible answers.
        For each question, exactly one of the four answers must be marked as correct (isCorrect: true). The other three must be incorrect (isCorrect: false).
        Ensure the questions are varied and cover different aspects of the topic. Make them suitable for a general audience.
        Set a time limit for each question, between 10 and 30 seconds, depending on the question's difficulty.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: quizSchema,
            },
        });

        const jsonText = response.text.trim();
        const quizData = JSON.parse(jsonText);

        // Validate the structure to ensure it matches the Question[] type
        if (!Array.isArray(quizData)) {
            throw new Error("API did not return an array.");
        }

        const validatedQuiz: Question[] = quizData.map((q: any) => {
            if (
                typeof q.question === 'string' &&
                Array.isArray(q.answers) && q.answers.length === 4 &&
                q.answers.every((a: any) => typeof a.text === 'string' && typeof a.isCorrect === 'boolean') &&
                q.answers.filter((a: any) => a.isCorrect).length === 1 &&
                typeof q.timeLimit === 'number'
            ) {
                return q as Question;
            }
            throw new Error("Invalid question structure received from API.");
        });

        return validatedQuiz;

    } catch (error) {
        console.error("Error generating quiz:", error);
        throw new Error("Failed to generate quiz from Gemini API. Please check the console for details.");
    }
};
