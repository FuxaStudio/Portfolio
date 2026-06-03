# Hero sekce — typografický efekt s fotografií

**Datum:** 2026-06-02  
**Projekt:** Fuxa Studio (fuxastudio.cz)  
**Soubor:** `index.html`

---

## Přehled

Náhrada stávající hero sekce za výraznou typografickou kompozici inspirovanou portfoliem stylem "velký text + fotografie ve středu". Kompozice staví na třívrstevném z-index systému kde text mění vizuální styl v místě překrytí fotografií.

---

## Vizuální design

### Pozadí
- Barva: `#0a0a0a` (shodné se zbytkem webu)
- Stávající `aether-canvas` (animace kouře) a `hero-fade` zůstávají

### Typografie
- **Font:** Bebas Neue (přidat do Google Fonts `<link>` v `<head>`)
- Styl: kondenzovaný, velká písmena, letter-spacing ~2–3px

### Kompozice — horizontální trojice
```
[ Web ]  [ FOTKA ]  [ Designer ]
                    [ Developer ]
```

- **"Web"** — vlevo, font-size ~170px, bílá (`#fafafa`)
- **Fotografie** — střed, PNG s průhledným pozadím (dodá uživatel)
- **"Designer"** — vpravo nahoře, font-size ~76px, bílá
- **"Developer"** — vpravo dole, font-size ~76px, bílá

### Efekt překrytí (klíčová funkce)
Tam kde fotografie překrývá text se text vizuálně změní:

| Oblast | Styl textu |
|--------|-----------|
| Mimo fotografii | Bílý (`color: #fafafa`) |
| Pod fotografií | Černý s bílým outlinem (`color: #111`, `-webkit-text-stroke: 1.5px #fafafa`) |

---

## Technická implementace — 3 vrstvy

### Vrstva 1 — Bílý text (z-index: 2)
Standardní pozicování, bílý text. Fotografie ho překryje.

### Vrstva 2 — Fotografie (z-index: 3)
- Element: `<img src="assets/hero-sekce.png">`
- Výška: ~260–320px (závisí na rozměrech fotky)
- `position: absolute`, centrovaná přes `translate(-50%, -50%)`

### Vrstva 3 — Překryvný text (z-index: 4)
- Identická kopie textu z Vrstvy 1
- Styl: `color: #111`, `-webkit-text-stroke: 1.5px #fafafa`
- `clip-path`: oříznutý na oblast fotografii (ellipse odpovídající tvaru fotky)
- `pointer-events: none`

---

## Responsivita

- Desktop (>768px): horizontální layout — Web | Foto | Designer/Developer
- Mobil (≤768px): vertikální stack — Web nahoře, foto uprostřed, Designer/Developer dole
- Font-size: `clamp()` pro plynulé škálování

---

## Co se NEMĚNÍ v této fázi

- Žádná CTA tlačítka (přidají se v dalším kroku)
- Žádný pozdravný text ("Ahoj, jsem Pavel Fuxa")
- Zbytek stránky (about, projekty, reference, kontakt) zůstává beze změny

---

## Závislosti

- Google Fonts: `Bebas+Neue` přidat do existujícího `<link>` tagu
- Fotografie: `assets/hero-sekce.png` (PNG s průhledným pozadím, již k dispozici)
- Stávající CSS (`css/style.css`): nové hero styly přidat jako `<style>` blok přímo v `index.html` (stejně jako dosavadní hero styly)
