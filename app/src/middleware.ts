import createMiddleware from 'next-intl/middleware';
import { WEBSITE_LANGUAGES } from './utils/constants';
 
export default createMiddleware({
  // A list of all locales that are supported
  locales: WEBSITE_LANGUAGES,
  // If this locale is matched, pathnames work without a prefix (e.g. `/about`)
  defaultLocale: WEBSITE_LANGUAGES[0]
});
 
export const config = {
  // Skip all paths that should not be internationalized. This example skips the
  // folders "api", "_next" and all files with an extension (e.g. favicon.ico)
  matcher: ['/((?!api|_next|.*\\..*).*)']
};