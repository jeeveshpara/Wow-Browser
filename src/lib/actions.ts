"use server";

import { blockAdsAndTrackers, BlockAdsAndTrackersInput, BlockAdsAndTrackersOutput } from '@/ai/flows/block-ads-and-trackers';
import { translateText, TranslateTextInput, TranslateTextOutput } from '@/ai/flows/translate-text-flow';

export async function analyzeWebsiteAction(url: string): Promise<{
    success: boolean;
    data?: BlockAdsAndTrackersOutput;
    error?: string;
}> {
  // In a real-world scenario, you would fetch the HTML content of the URL on the server.
  // Due to the complexity and potential issues (CORS, dynamic content), we'll use a mock HTML content.
  const mockHtmlContent = `
    <html>
      <head>
        <title>Example News Site</title>
        <script src="https://www.google-analytics.com/analytics.js"></script>
        <script src="https://cdn.ad.net/advert.js"></script>
      </head>
      <body>
        <h1>Main Story Headline</h1>
        <p>Some interesting content here that you want to read.</p>
        
        <div class="ad-banner">
          <a href="https://some-ad-network.com/ad-click?id=123">
            <img src="https://some-ad-network.com/ad-image.png" alt="A shiny ad" />
          </a>
        </div>

        <p>More story content here, with a tracker pixel.</p>
        <img src="https://tracker.example.com/pixel.gif?user=123" width="1" height="1" />

        <iframe src="https://ads.doubleclick.net/ad?id=456" class="advertisement"></iframe>
      </body>
    </html>
  `;

  const input: BlockAdsAndTrackersInput = {
    url,
    htmlContent: mockHtmlContent,
  };

  try {
    const result = await blockAdsAndTrackers(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error in analyzeWebsiteAction:', error);
    return { success: false, error: 'Failed to analyze website due to an internal error.' };
  }
}

export async function translateTextAction(text: string, targetLanguage: string): Promise<{
    success: boolean;
    data?: TranslateTextOutput;
    error?: string;
}> {
    const input: TranslateTextInput = { text, targetLanguage };
    try {
        const result = await translateText(input);
        return { success: true, data: result };
    } catch (error) {
        console.error('Error in translateTextAction:', error);
        return { success: false, error: 'Failed to translate text due to an internal error.' };
    }
}
