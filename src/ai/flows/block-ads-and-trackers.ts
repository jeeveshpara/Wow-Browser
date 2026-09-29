'use server';
/**
 * @fileOverview An ad and tracker blocking AI agent.
 *
 * - blockAdsAndTrackers - A function that blocks ads and trackers on a given website.
 * - BlockAdsAndTrackersInput - The input type for the blockAdsAndTrackers function.
 * - BlockAdsAndTrackersOutput - The return type for the blockAdsAndTrackers function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BlockAdsAndTrackersInputSchema = z.object({
  url: z.string().url().describe('The URL of the website to analyze.'),
  htmlContent: z.string().describe('The HTML content of the website.'),
});
export type BlockAdsAndTrackersInput = z.infer<typeof BlockAdsAndTrackersInputSchema>;

const BlockAdsAndTrackersOutputSchema = z.object({
  blockedAds: z.array(z.string()).describe('A list of URLs that are ads.'),
  blockedTrackers: z.array(z.string()).describe('A list of URLs that are trackers.'),
  cleanHtmlContent: z.string().describe('The HTML content with ads and trackers removed.'),
});
export type BlockAdsAndTrackersOutput = z.infer<typeof BlockAdsAndTrackersOutputSchema>;

export async function blockAdsAndTrackers(input: BlockAdsAndTrackersInput): Promise<BlockAdsAndTrackersOutput> {
  return blockAdsAndTrackersFlow(input);
}

const prompt = ai.definePrompt({
  name: 'blockAdsAndTrackersPrompt',
  input: {schema: BlockAdsAndTrackersInputSchema},
  output: {schema: BlockAdsAndTrackersOutputSchema},
  prompt: `You are an AI ad and tracker blocker. Analyze the HTML content of a website and identify ads and trackers. Return the blocked ads and trackers as lists of URLs, and provide the cleaned HTML content with those elements removed. 

Website URL: {{{url}}}
HTML Content: {{{htmlContent}}}`,
});

const blockAdsAndTrackersFlow = ai.defineFlow(
  {
    name: 'blockAdsAndTrackersFlow',
    inputSchema: BlockAdsAndTrackersInputSchema,
    outputSchema: BlockAdsAndTrackersOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
