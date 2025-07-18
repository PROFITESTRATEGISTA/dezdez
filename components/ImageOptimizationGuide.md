# Image SEO Optimization Guide

## File Naming Best Practices

- Use descriptive, keyword-rich filenames
- Separate words with hyphens (not underscores)
- Include location keywords for local SEO
- Keep filenames short but descriptive
- Use lowercase letters only

**Examples:**
- ✅ `emergency-medical-team-sao-paulo.jpg`
- ✅ `ambulance-service-grande-sp.jpg`
- ❌ `IMG_12345.jpg`
- ❌ `photo1.jpg`

## Image Compression

- Compress all images before uploading
- Use WebP format when possible (with fallbacks)
- Aim for file sizes under 200KB for most images
- Balance quality and file size
- Consider using:
  - [TinyPNG](https://tinypng.com/) for PNG/JPG compression
  - [Squoosh](https://squoosh.app/) for advanced compression options
  - [ImageOptim](https://imageoptim.com/) for desktop compression

## Responsive Images Implementation

1. Always specify width and height attributes
2. Use srcset for different resolutions
3. Use sizes attribute to help browser select correct image
4. Implement picture element for art direction
5. Provide WebP with fallbacks to JPG/PNG

## Lazy Loading Best Practices

- Use native lazy loading for images below the fold
- Consider using Intersection Observer for more control
- Add blur-up effect for better user experience
- Don't lazy load images above the fold
- Set explicit width/height to prevent layout shifts

## Alt Text Guidelines

- Be descriptive and specific
- Include relevant keywords naturally
- Keep under 125 characters
- Don't start with "picture of" or "image of"
- For decorative images, use empty alt="" but never omit the attribute

## Image Sitemap

- Include all important images in your sitemap
- Add image metadata (title, caption, geo_location)
- Update sitemap when adding new important images
- Submit image sitemap to Google Search Console

## Additional Optimization Tips

- Use CDN for faster image delivery
- Implement AVIF format for cutting-edge browsers
- Consider using next-gen formats with fallbacks
- Optimize thumbnails specifically for their size
- Use appropriate image dimensions for each placement

## Accessibility Considerations

- Ensure sufficient color contrast
- Don't use images of text when possible
- Provide descriptive alt text for screen readers
- Consider reduced motion preferences
- Test with screen readers