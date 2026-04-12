'use server';
/**
 * @fileOverview A Genkit flow that generates a personalized welcome message for Wi-Fi users.
 *
 * - generatePersonalizedWelcomeMessage - A function that handles the generation of the welcome message.
 * - GeneratePersonalizedWelcomeMessageInput - The input type for the generatePersonalizedWelcomeMessage function.
 * - GeneratePersonalizedWelcomeMessageOutput - The return type for the generatePersonalizedWelcomeMessage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePersonalizedWelcomeMessageInputSchema = z.object({
  clientMac: z
    .string()
    .describe(
      'The MAC address of the client, used for personalization. Format: XX:XX:XX:XX:XX:XX'
    ),
  accessDurationMinutes: z
    .number()
    .positive()
    .describe('The duration of Wi-Fi access in minutes.'),
});
export type GeneratePersonalizedWelcomeMessageInput = z.infer<
  typeof GeneratePersonalizedWelcomeMessageInputSchema
>;

const GeneratePersonalizedWelcomeMessageOutputSchema = z.object({
  welcomeMessage: z
    .string()
    .describe('A personalized welcome message for the user.'),
});
export type GeneratePersonalizedWelcomeMessageOutput = z.infer<
  typeof GeneratePersonalizedWelcomeMessageOutputSchema
>;

export async function generatePersonalizedWelcomeMessage(
  input: GeneratePersonalizedWelcomeMessageInput
): Promise<GeneratePersonalizedWelcomeMessageOutput> {
  return generatePersonalizedWelcomeMessageFlow(input);
}

const personalizedWelcomePrompt = ai.definePrompt({
  name: 'personalizedWelcomePrompt',
  input: {schema: GeneratePersonalizedWelcomeMessageInputSchema},
  output: {schema: GeneratePersonalizedWelcomeMessageOutputSchema},
  prompt: `You are an AI assistant for a Wi-Fi hotspot service. Your goal is to create a friendly, concise, and personalized welcome message for a user after they have successfully paid for Wi-Fi access.

Confirm their access duration and offer one or two helpful tips for a better Wi-Fi experience.

User details:
- MAC Address: {{{clientMac}}}
- Access Duration: {{{accessDurationMinutes}}} minutes

Example tips might include:
- "For the best experience, try to stay close to an access point."
- "If you encounter any issues, please refer to the support section on our website."
- "Enjoy your browsing, streaming, and working!"

Generate a warm and welcoming message.`, 
});

const generatePersonalizedWelcomeMessageFlow = ai.defineFlow(
  {
    name: 'generatePersonalizedWelcomeMessageFlow',
    inputSchema: GeneratePersonalizedWelcomeMessageInputSchema,
    outputSchema: GeneratePersonalizedWelcomeMessageOutputSchema,
  },
  async input => {
    const {output} = await personalizedWelcomePrompt(input);
    return output!;
  }
);
