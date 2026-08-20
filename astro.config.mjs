// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Custom domain — served from the root, so no `base` is needed.
  // `public/CNAME` tells GitHub Pages about the domain; the DNS records and
  // the Pages "Custom domain" setting have to agree with it or the site 404s.
  site: 'https://sudorider.com',

  trailingSlash: 'ignore',
});
