# Marks Dairy — Strawberry Cream

> Smooth 3D scroll animation and storefront experience for **Marks Strawberry Milk Shake**.

## Features
- **Cinematic 3D Scroll Scrubber**: 194-frame high-performance sequence with sub-frame damping loop (60fps/120fps) and bicubic sharpness.
- **Dynamic Hero Overlay**: "Marks" & "Strawberry Cream" headline with smooth 30% scroll fade-out.
- **Sticky Glassmorphic Navigation Bar**: Quick jump to Tasting Notes, Nutrition, Pack Options, Specifications, and Verified Reviews.
- **Interactive Storefront**: Serving size toggle (200ml / 100ml), dynamic pack selectors with quantity math, expandable specifications accordion, sticky cart bar, and checkout toast.
- **Vercel-Ready**: Preconfigured `vercel.json` with immutable asset caching for lightning-fast worldwide CDN delivery.

## Deploying to Vercel
1. Import this repository into [Vercel](https://vercel.com).
2. Leave Framework Preset as **Other** (Zero configuration needed).
3. Click **Deploy**.

## Local Development
Run the included PowerShell server daemon:
```powershell
powershell -ExecutionPolicy Bypass -File .\server.ps1
```
Open [http://localhost:8080/](http://localhost:8080/) in your browser.
