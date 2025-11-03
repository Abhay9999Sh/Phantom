/**
 * The "Operator" - API Route
 * Connects the Brain (Gemini) with the Hands (toolBelt)
 */

import { toolBelt } from '../../lib/tools';
import { getAICommand } from '../../lib/geminiClient';

export default async function handler(req, res) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const { message } = req.body;

    // Validate input
    if (!message || typeof message !== 'string' || message.trim() === '') {
      return res.status(400).json({ 
        error: 'Invalid request. Please provide a message.' 
      });
    }

    console.log('📥 Received message:', message);

    // Step 1: Ask Gemini what to do (The Brain decides)
    const functionCall = await getAICommand(message);

    if (!functionCall || !functionCall.name) {
      return res.status(200).json({
        reply: "I'm not sure how to help with that. Could you rephrase your request?",
        success: false,
      });
    }

    console.log('🧠 AI Decision:', functionCall);

    // Step 2: Execute the appropriate tool (The Hands act)
    const toolFunction = toolBelt[functionCall.name];

    if (!toolFunction) {
      console.error('❌ Unknown function:', functionCall.name);
      return res.status(200).json({
        reply: `I tried to call a function that doesn't exist: ${functionCall.name}. This is a system error.`,
        success: false,
      });
    }

    // Execute the tool with the provided arguments
    const result = await toolFunction(functionCall.args || {});

    console.log('✅ Tool executed:', result);

    // Step 3: Return the result
    return res.status(200).json({
      reply: result,
      success: true,
      functionCalled: functionCall.name,
      arguments: functionCall.args,
    });

  } catch (error) {
    console.error('❌ Error in command API:', error);
    
    return res.status(500).json({
      error: 'An error occurred while processing your request.',
      details: error.message,
      success: false,
    });
  }
}
