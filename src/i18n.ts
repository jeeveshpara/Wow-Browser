import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';
 
const locales = ['en', 'hi', 'fr'];
 
export default getRequestConfig(async ({locale}) => {
  if (!locales.includes(locale as any)) notFound();
 
  try {
    return {
      messages: (await import(`../messages/${locale}.json`)).default
    };
  } catch (error) {
    console.error(`Failed to load messages for locale "${locale}":`, error);
    throw error;
  }
});