export type PageSeoKey = 'home' | 'help' | 'privacy';

interface SeoConfig {
  title: string;
  description: string;
  keywords: string;
  canonicalUrl: string;
  jsonLd: Record<string, unknown>;
}

const BASE_SITE_URL = 'https://hariom2008h.github.io/Shorts-blocker-pages/';

export const PAGE_SEO_CONFIG: Record<PageSeoKey, SeoConfig> = {
  home: {
    title: 'Shorts Blocker - Reclaim Your Attention',
    description:
      'Shorts Blocker is an Android productivity app that automatically blocks YouTube Shorts, Instagram Reels, and Snapchat Spotlight to help you reclaim your focus and stop endless scrolling.',
    keywords:
      'shorts blocker, reel blocker, block youtube shorts, block instagram reels, block snapchat spotlight, digital wellbeing, screen time, productivity app, stop doomscrolling, focus app, block short videos, android blocker',
    canonicalUrl: BASE_SITE_URL,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'Shorts Blocker',
      operatingSystem: 'Android',
      applicationCategory: 'UtilitiesApplication',
      description:
        'An Android productivity utility that intercepts and blocks YouTube Shorts, Instagram Reels, and Snapchat Spotlight to help users stop endless scrolling.',
      url: BASE_SITE_URL,
      author: {
        '@type': 'Person',
        name: 'Hari Om Bhadana',
      },
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
    },
  },
  help: {
    title: 'Help Center & Setup Guide – Shorts Blocker for Android',
    description:
      'Step-by-step setup guide for Shorts Blocker on Android 13–15. Learn how to enable Accessibility Service, fix OEM battery optimization, and recover Stealth Mode.',
    keywords:
      'shorts blocker help, shorts blocker setup guide, android 13 restricted settings accessibility, shorts blocker battery optimization, stealth mode recovery, block reels troubleshooting',
    canonicalUrl: `${BASE_SITE_URL}?page=help`,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: 'How to Set Up Shorts Blocker on Android 13, 14, and 15',
      description:
        'Complete guide to enabling Android Accessibility Service permissions, bypassing Restricted Settings on Android 13+, and configuring OEM battery optimization for Shorts Blocker.',
      url: `${BASE_SITE_URL}?page=help`,
      step: [
        {
          '@type': 'HowToStep',
          position: 1,
          name: 'Open Accessibility Settings from Shorts Blocker',
          text: 'Open Shorts Blocker and follow the prompt to open Android Accessibility Settings, then locate Shorts Blocker under Installed Apps.',
        },
        {
          '@type': 'HowToStep',
          position: 2,
          name: 'Acknowledge the Restricted Setting Dialog',
          text: 'On Android 13+, tap OK on the Restricted setting security dialog to unlock the permission option in App Info.',
        },
        {
          '@type': 'HowToStep',
          position: 3,
          name: 'Allow Restricted Settings in App Info',
          text: 'Open Settings > Apps > Shorts Blocker, tap the three-dot menu in the top-right corner, and select Allow restricted settings.',
        },
        {
          '@type': 'HowToStep',
          position: 4,
          name: 'Enable Shorts Blocker Service',
          text: 'Return to Settings > Accessibility > Installed apps > Shorts Blocker and toggle on Use Shorts Blocker.',
        },
      ],
    },
  },
  privacy: {
    title: 'Privacy Policy – Shorts Blocker for Android',
    description:
      'Read the Shorts Blocker Privacy Policy. 100% on-device local processing with zero personal data collection, transparent AccessibilityService usage, and no ads.',
    keywords:
      'shorts blocker privacy policy, shorts blocker accessibility permission privacy, local on-device blocker android, esech shorts blocker legal',
    canonicalUrl: `${BASE_SITE_URL}?page=privacy`,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Privacy Policy – Shorts Blocker for Android',
      description:
        'Official Privacy Policy and Android AccessibilityService API disclosure for Shorts Blocker. Zero personal data collection and 100% on-device execution.',
      url: `${BASE_SITE_URL}?page=privacy`,
      publisher: {
        '@type': 'Organization',
        name: 'Esech',
      },
    },
  },
};

function setMetaTag(selector: string, attribute: 'name' | 'property', attrValue: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, attrValue);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

export function applyPageSeo(page: PageSeoKey) {
  const config = PAGE_SEO_CONFIG[page];
  document.title = config.title;

  setMetaTag('meta[name="description"]', 'name', 'description', config.description);
  setMetaTag('meta[name="keywords"]', 'name', 'keywords', config.keywords);
  setMetaTag('meta[property="og:title"]', 'property', 'og:title', config.title);
  setMetaTag('meta[property="og:description"]', 'property', 'og:description', config.description);
  setMetaTag('meta[property="og:url"]', 'property', 'og:url', config.canonicalUrl);
  setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', config.title);
  setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', config.description);

  let canonicalLink = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.setAttribute('href', config.canonicalUrl);

  let jsonLdScript = document.head.querySelector<HTMLScriptElement>('script#dynamic-seo-jsonld');
  if (!jsonLdScript) {
    jsonLdScript = document.createElement('script');
    jsonLdScript.id = 'dynamic-seo-jsonld';
    jsonLdScript.type = 'application/ld+json';
    document.head.appendChild(jsonLdScript);
  }
  jsonLdScript.textContent = JSON.stringify(config.jsonLd);
}
