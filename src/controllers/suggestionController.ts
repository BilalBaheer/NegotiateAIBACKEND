import { Request, Response } from 'express';
import OpenAI from 'openai';
import config from '../config/config';

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: config.openaiApiKey,
});

/**
 * Generate real-time email suggestions
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
export const generateEmailSuggestions = async (req: Request, res: Response) => {
  try {
    // For testing purposes, we'll skip authentication
    // In production, you would validate the token and check user permissions
    
    // Get email text from request
    const { text } = req.body;
    if (!text || text.length < 10) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email text is required and must be at least 10 characters'
      });
    }

    // Analyze the email with OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an expert negotiation coach specializing in helping people write effective negotiation emails.
                   Analyze the following email draft and provide 3-5 specific suggestions to improve its negotiation effectiveness.
                   Focus on:
                   1. Strengthening the negotiating position
                   2. Adding persuasive elements
                   3. Removing weak language
                   4. Improving clarity and directness
                   5. Adding specific negotiation techniques
                   
                   For each suggestion, provide:
                   - A short title (3-5 words)
                   - A specific suggestion text (1-2 sentences)
                   - The exact text to use (if applicable)
                   
                   Return your analysis as a JSON array of suggestion objects with 'title' and 'text' properties.`
        },
        {
          role: "user",
          content: text
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    // Parse the response
    let suggestions = [];
    try {
      const content = completion.choices[0].message.content;
      
      if (content) {
        // Check if the response is already in JSON format
        if (content.trim().startsWith('[') && content.trim().endsWith(']')) {
          suggestions = JSON.parse(content);
        } else {
          // Try to extract JSON from the response
          const jsonMatch = content.match(/\[[\s\S]*\]/);
          if (jsonMatch) {
            suggestions = JSON.parse(jsonMatch[0]);
          } else {
            // If no JSON found, create a basic suggestion
            suggestions = [{
              title: "Improve Negotiation",
              text: "The AI couldn't generate specific suggestions. Try being more specific in your email about what you're negotiating for."
            }];
          }
        }
      }
    } catch (error) {
      console.error('Error parsing OpenAI response:', error);
      suggestions = [{
        title: "Parsing Error",
        text: "There was an error generating suggestions. Please try again with a more complete email draft."
      }];
    }

    // Log the suggestion generation (optional)
    console.log(`Generated ${suggestions.length} suggestions`);

    // Return suggestions
    return res.status(200).json({
      success: true,
      suggestions
    });

  } catch (error: any) {
    console.error('Error generating email suggestions:', error);
    return res.status(500).json({
      success: false,
      message: 'Error generating suggestions',
      error: error.message || 'Unknown error'
    });
  }
};

/**
 * Generate real-time chat suggestions
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
export const generateChatSuggestions = async (req: Request, res: Response) => {
  try {
    // For testing purposes, we'll skip authentication
    
    // Get chat text from request
    const { text } = req.body;
    if (!text || text.length < 10) {
      return res.status(400).json({ 
        success: false, 
        message: 'Chat text is required and must be at least 10 characters'
      });
    }

    // Placeholder for chat suggestions
    const suggestions = [{
      title: "Chat Suggestion",
      text: "This is a placeholder for chat suggestions. Real implementation coming soon."
    }];

    // Return suggestions
    return res.status(200).json({
      success: true,
      suggestions
    });

  } catch (error: any) {
    console.error('Error generating chat suggestions:', error);
    return res.status(500).json({
      success: false,
      message: 'Error generating chat suggestions',
      error: error.message || 'Unknown error'
    });
  }
};
