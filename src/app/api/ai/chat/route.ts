import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, conversationHistory } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Check if API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {
          error: 'OpenAI API key not configured',
          response: 'I apologize, but the AI assistant is not configured. Please add your OpenAI API key to the .env file.',
        },
        { status: 503 }
      );
    }

    // System prompt for fitness assistant
    const systemPrompt = `You are a professional fitness and nutrition AI assistant. Your role is to:
- Provide accurate, science-based fitness and nutrition advice
- Help users with workout routines, exercise form, and training programs
- Answer questions about diet, macronutrients, and meal planning
- Offer guidance on weight loss, muscle building, and athletic performance
- Be encouraging and motivational while maintaining professional standards
- Always prioritize user safety and recommend consulting healthcare professionals for medical concerns

Keep responses concise, practical, and actionable. Use clear language that beginners can understand while being detailed enough for experienced fitness enthusiasts.`;

    // Build messages array
    const messages: any[] = [
      { role: 'system', content: systemPrompt },
    ];

    // Add conversation history if provided
    if (conversationHistory && Array.isArray(conversationHistory)) {
      messages.push(...conversationHistory);
    }

    // Add current user message
    messages.push({ role: 'user', content: message });

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
      max_tokens: 500,
      temperature: 0.7,
    });

    const aiResponse = completion.choices[0]?.message?.content || 'I apologize, but I could not generate a response.';

    return NextResponse.json(
      {
        message: 'Response generated successfully',
        response: aiResponse,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('AI chat error:', error);

    // Handle specific OpenAI errors
    if (error?.status === 401) {
      return NextResponse.json(
        {
          error: 'Invalid OpenAI API key',
          response: 'The AI assistant configuration is incorrect. Please check your API key.',
        },
        { status: 503 }
      );
    }

    if (error?.status === 429) {
      // Check if it's insufficient quota or rate limit
      const errorCode = error?.code || error?.error?.code;

      if (errorCode === 'insufficient_quota') {
        return NextResponse.json(
          {
            error: 'Insufficient quota',
            response: '⚠️ OpenAI API quota exceeded. Please check your billing and add credits at https://platform.openai.com/account/billing',
          },
          { status: 503 }
        );
      }

      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          response: 'Too many requests. Please wait a moment and try again.',
        },
        { status: 429 }
      );
    }

    return NextResponse.json(
      {
        error: 'Internal server error',
        response: 'I encountered an error. Please try again later.',
      },
      { status: 500 }
    );
  }
}
