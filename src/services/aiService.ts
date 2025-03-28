import OpenAI from 'openai';
import config from '../config/config';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: config.openaiApiKey
});

// Industry-specific model contexts
const INDUSTRY_CONTEXTS = {
  general: 'general business negotiations',
  legal: 'legal contract negotiations',
  sales: 'sales and pricing negotiations',
  procurement: 'procurement and vendor negotiations',
  recruitment: 'job offer and salary negotiations'
};

/**
 * Analysis result interface
 */
export interface AnalysisResult {
  score: number;
  tone: string;
  sentiment: string;
  persuasiveStrength: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  frameworksUsed?: string[];
  techniquesIdentified?: string[];
  powerDynamics?: string;
  negotiationPhase?: string;
}

/**
 * Analyzes negotiation text and provides feedback
 * @param text The negotiation text to analyze
 * @param modelId The industry-specific model to use
 * @returns Analysis result with scores and suggestions
 */
export const analyzeText = async (text: string, modelId: string): Promise<AnalysisResult> => {
  if (!text.trim()) {
    throw new Error('Text is required for analysis');
  }

  try {
    const industryContext = getIndustryContext(modelId);
    
    // Generate a random session ID to ensure each analysis is treated as unique
    const sessionId = Math.random().toString(36).substring(2, 15);
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are the world's foremost expert on negotiation techniques, with decades of experience in ${industryContext} and deep knowledge of negotiation psychology, game theory, and persuasion tactics.

Your task is to analyze the negotiation text with the precision and insight of a master negotiator, providing comprehensive and actionable feedback.

Your analysis must include:

1. An overall effectiveness score from 0-100 based on these criteria:
   - Clarity and conciseness (15 points)
   - Persuasive language and rhetoric (15 points)
   - Professional tone and relationship building (15 points)
   - Strategic positioning and framing (15 points)
   - Addressing counterparty concerns and objections (15 points)
   - Effective use of negotiation techniques (15 points)
   - Clear call to action and next steps (10 points)
   
2. Tone analysis (assertive, passive, collaborative, etc.)
3. Sentiment analysis (positive, negative, neutral)
4. Persuasive strength as a percentage from 0-100
5. Key strengths (3-5 specific points about what works well)
6. Areas for improvement (3-5 specific points about what could be better)
7. Specific tactical suggestions to make the text more effective (3-5 actionable points)
8. Negotiation frameworks identified in the text (BATNA, ZOPA, etc.)
9. Expert techniques used or missing (mirroring, labeling, etc.)
10. Power dynamics assessment (who appears to have leverage)
11. Negotiation phase identification (preparation, information exchange, bargaining, closing)

Apply the following expert negotiation principles in your analysis:
- Harvard Principled Negotiation Method (separate people from the problem, focus on interests not positions, invent options for mutual gain, insist on objective criteria)
- Chris Voss's tactical empathy and calibrated questions
- Robert Cialdini's principles of influence (reciprocity, commitment/consistency, social proof, authority, liking, scarcity)
- Game theory concepts of information asymmetry and credible commitments
- Cultural sensitivity and awareness in international negotiations

This is analysis session ${sessionId} - evaluate this text independently and objectively.

Format your response as a JSON object with the following structure:
{
  "score": number,
  "tone": string,
  "sentiment": string,
  "persuasiveStrength": number,
  "strengths": string[],
  "weaknesses": string[],
  "suggestions": string[],
  "frameworksUsed": string[],
  "techniquesIdentified": string[],
  "powerDynamics": string,
  "negotiationPhase": string
}

ONLY return the JSON object, nothing else.`
        },
        {
          role: 'user',
          content: text
        }
      ],
      temperature: 0.3,
      max_tokens: 1500
    });

    try {
      // Try to parse the response as JSON
      const content = response.choices[0].message.content;
      console.log("Raw API response:", content);
      
      if (!content) {
        throw new Error('Empty response from OpenAI API');
      }
      
      // Try to parse the entire content as JSON first
      try {
        const analysisResult = JSON.parse(content);
        console.log("Successfully parsed full response as JSON");
        return analysisResult;
      } catch (fullParseError) {
        // If that fails, try to extract JSON from the content
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        
        if (jsonMatch) {
          const jsonStr = jsonMatch[0];
          const analysisResult = JSON.parse(jsonStr);
          console.log("Successfully extracted and parsed JSON from response");
          return analysisResult;
        } else {
          console.warn('Could not extract JSON from response, using mock data');
          return getMockAnalysis(text, modelId);
        }
      }
    } catch (parseError) {
      console.error('Error parsing analysis result:', parseError);
      return getMockAnalysis(text, modelId);
    }
  } catch (error: any) {
    console.error('Error analyzing text:', error);
    return getMockAnalysis(text, modelId);
  }
};

/**
 * Gets improved version of negotiation text
 * @param originalText The original negotiation text
 * @param modelId The industry-specific model to use
 * @returns Improved version of the text
 */
export const getImprovedText = async (originalText: string, modelId: string): Promise<string> => {
  if (!originalText.trim()) {
    throw new Error('Text is required for improvement');
  }

  try {
    const industryContext = getIndustryContext(modelId);
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are the world's foremost expert on negotiation techniques, with decades of experience in ${industryContext} and deep knowledge of negotiation psychology, game theory, and persuasion tactics.

Your task is to improve the negotiation text provided by the user, making it more effective, persuasive, and professional.

Follow these guidelines:
1. Maintain the original intent and key points
2. Improve clarity, conciseness, and structure
3. Enhance persuasive language and rhetoric
4. Ensure a professional and appropriate tone
5. Strengthen strategic positioning and framing
6. Better address potential counterparty concerns
7. Incorporate effective negotiation techniques
8. Add clear calls to action where appropriate
9. Apply principles from Harvard Negotiation Method, Chris Voss, and Robert Cialdini as relevant
10. Maintain authenticity and avoid overly formal or artificial language

Provide ONLY the improved text, with no explanations, comments, or additional information.`
        },
        {
          role: 'user',
          content: originalText
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    const improvedText = response.choices[0].message.content || '';
    return improvedText;
  } catch (error: any) {
    console.error('Error improving text:', error);
    return getMockImprovedText(originalText);
  }
};

/**
 * Helper function to get industry-specific context
 * @param industryModelId The industry model ID
 * @returns Industry context string
 */
const getIndustryContext = (industryModelId: string): string => {
  return INDUSTRY_CONTEXTS[industryModelId as keyof typeof INDUSTRY_CONTEXTS] || INDUSTRY_CONTEXTS.general;
};

/**
 * Mock functions for development without API key
 */
const getMockAnalysis = (text: string, industryModelId: string): AnalysisResult => {
  return {
    score: 75,
    tone: 'Professional',
    sentiment: 'Positive',
    persuasiveStrength: 70,
    strengths: [
      'Clear communication of key points',
      'Professional tone throughout',
      'Good structure and organization'
    ],
    weaknesses: [
      'Could use more specific data points',
      'Missing some key negotiation techniques',
      'Call to action could be stronger'
    ],
    suggestions: [
      'Add specific examples to support your position',
      'Incorporate more reciprocity principles',
      'End with a clearer next step or timeline'
    ],
    frameworksUsed: ['BATNA', 'Interest-Based'],
    techniquesIdentified: ['Mirroring', 'Labeling'],
    powerDynamics: 'Balanced with slight advantage to counterparty',
    negotiationPhase: 'Bargaining'
  };
};

/**
 * Mock function for improved text
 */
const getMockImprovedText = (originalText: string): string => {
  return `${originalText}\n\n[This would be an improved version of your text with better negotiation techniques and persuasive language.]`;
};

export default {
  analyzeText,
  getImprovedText
};
