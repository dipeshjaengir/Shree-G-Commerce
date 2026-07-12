import { useEffect } from 'react';

/**
 * Dynamic Hook to manage page SEO tags, canonical headers, and OpenGraph metadata
 */
export const useSEO = ({ title, description, canonicalPath, ogImage, ogType = 'website' }) => {
  useEffect(() => {
    // 1. Set document title
    const baseTitle = 'Shree G Commerce';
    document.title = title ? `${title} | ${baseTitle}` : baseTitle;

    // 2. Set Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = description || 'Premium full-stack grocery supermarket and clothing storefront.';

    // 3. Set Canonical URL link element
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    const origin = window.location.origin;
    canonical.href = canonicalPath ? `${origin}${canonicalPath}` : window.location.href;

    // 4. Set OpenGraph tags
    const setMetaTag = (property, content, attributeType = 'property') => {
      let tag = document.querySelector(`meta[${attributeType}="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attributeType, property);
        document.head.appendChild(tag);
      }
      tag.content = content || '';
    };

    setMetaTag('og:title', title ? `${title} | ${baseTitle}` : baseTitle);
    setMetaTag('og:description', description || 'Premium full-stack grocery supermarket.');
    setMetaTag('og:type', ogType);
    setMetaTag('og:url', window.location.href);
    if (ogImage) {
      setMetaTag('og:image', ogImage);
    }

    // Twitter Card Tags
    setMetaTag('twitter:card', 'summary_large_image', 'name');
    setMetaTag('twitter:title', title ? `${title} | ${baseTitle}` : baseTitle, 'name');
    setMetaTag('twitter:description', description || 'Premium grocery supermarket.', 'name');

  }, [title, description, canonicalPath, ogImage, ogType]);
};

export default useSEO;
