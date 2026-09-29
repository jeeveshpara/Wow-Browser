import createMiddleware from 'next-intl/middleware';
 
export default createMiddleware({
  locales: ['en', 'hi', 'fr'],
 
  defaultLocale: 'en'
});
 
export const config = {
  matcher: ['/', '/(hi|fr|en)/:path*']
};