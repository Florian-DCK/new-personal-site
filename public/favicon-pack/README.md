# Favicon pack — fd

Tous les fichiers à uploader pour le favicon du portfolio.

## Fichiers
- favicon.svg          # vectoriel (browsers modernes)
- favicon.ico          # fallback IE/Safari (PNG renommé .ico)
- favicon-16.png       # tab navigateur classique
- favicon-32.png       # tab haute densité
- favicon-48.png
- favicon-64.png
- favicon-96.png
- favicon-128.png
- favicon-180.png      # apple-touch-icon
- favicon-192.png      # android home screen
- favicon-256.png
- favicon-512.png      # PWA / splash
- apple-touch-icon.png # iOS

## HTML à ajouter dans <head>

```html
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16.png" />
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
<link rel="manifest" href="/site.webmanifest" />
```

## site.webmanifest (optionnel, pour PWA)

```json
{
  "name": "Florian Donckers",
  "short_name": "Florian",
  "icons": [
    { "src": "/favicon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/favicon-512.png", "sizes": "512x512", "type": "image/png" }
  ],
  "theme_color": "#ecebe6",
  "background_color": "#ecebe6",
  "display": "standalone"
}
```
