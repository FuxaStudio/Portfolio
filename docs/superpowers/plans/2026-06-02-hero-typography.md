# Hero typografická kompozice — Implementační plán

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Nahradit stávající hero sekci v `index.html` typografickou kompozicí „Web / Designer / Developer" s fotografií prolínající přes text, kde text mění styl v oblasti překrytí fotografií.

**Architecture:** Tři vrstvy v rámci `.hero-typo-wrap`: (1) bílý text `z-index:2`, (2) PNG fotka `z-index:3`, (3) identický text černý+outline `z-index:4` maskovaný pomocí `mask-image` na tvar fotky. Vše jen v `index.html` — nový `<style>` blok + nové HTML v `<section class="hero">`.

**Tech Stack:** HTML, CSS (mask-image, clamp, Bebas Neue z Google Fonts)

---

## Soubory

- **Modifikovat:** `index.html`
  - Řádek 38–40: Google Fonts link → přidat `Bebas+Neue`
  - Řádky 98–125: CSS blok héro → celá výměna hero CSS
  - Řádky 369–392: HTML hero-content → výměna za novou kompozici

---

## Task 1: Přidat font Bebas Neue do Google Fonts

**Files:**
- Modify: `index.html:38-40`

- [ ] **Krok 1: Otevřít index.html a najít Google Fonts link**

Aktuální stav (řádky 38–40):
```html
  <link
    href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&family=Geist+Mono:wght@100..900&display=swap"
    rel="stylesheet" />
```

- [ ] **Krok 2: Přidat Bebas Neue do URL**

Nahradit výše uvedený blok za:
```html
  <link
    href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Geist:wght@100..900&family=Geist+Mono:wght@100..900&display=swap"
    rel="stylesheet" />
```

- [ ] **Krok 3: Vizuálně ověřit v prohlížeči**

Otevřít `index.html` v prohlížeči, zkontrolovat DevTools → Network, filtrem Fonts ověřit že `BebasNeue` se stáhl.

- [ ] **Krok 4: Commit**

```bash
git add index.html
git commit -m "feat: add Bebas Neue to Google Fonts link"
```

---

## Task 2: Nahradit hero CSS

**Files:**
- Modify: `index.html:98-125`

- [ ] **Krok 1: Najít sekci hero CSS v `<style>` bloku**

Lokace v `index.html`:
```css
    /* ========== INDEX HERO — CENTERED LAYOUT ========== */
    .hero {
      padding-top: 8rem;
      ...
    }
    ...
    @media (max-width: 768px) {
      .hero-actions {
        align-items: center;
      }
    }
```

- [ ] **Krok 2: Nahradit celou hero CSS sekci**

Nahradit vše od `/* ========== INDEX HERO — CENTERED LAYOUT ==========` po konec `@media (max-width: 768px)` bloku s `.hero-actions` (před `/* ========== SMOKE CANVAS ==========`):

```css
    /* ========== INDEX HERO — TYPOGRAFICKÁ KOMPOZICE ========== */
    .hero {
      padding-top: 5rem;
      padding-bottom: 5rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .hero-typo-wrap {
      position: relative;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: clamp(220px, 38vw, 380px);
    }

    /* Sdílené vlastnosti obou textových vrstev */
    .hero-text-behind,
    .hero-text-over {
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Bebas Neue', sans-serif;
      letter-spacing: 0.05em;
      user-select: none;
      line-height: 0.85;
      white-space: nowrap;
      gap: 0;
    }

    /* Vrstva 1: bílý text za fotkou */
    .hero-text-behind {
      position: relative;
      z-index: 2;
    }

    /* Vrstva 3: černý+outline text nad fotkou, maskovaný tvarem fotky */
    .hero-text-over {
      position: absolute;
      inset: 0;
      z-index: 4;
      pointer-events: none;
      -webkit-mask-image: url('assets/hero-sekce.png');
      mask-image: url('assets/hero-sekce.png');
      -webkit-mask-repeat: no-repeat;
      mask-repeat: no-repeat;
      -webkit-mask-position: center center;
      mask-position: center center;
      -webkit-mask-size: auto clamp(220px, 38vw, 380px);
      mask-size: auto clamp(220px, 38vw, 380px);
    }

    .hero-word-web {
      font-size: clamp(80px, 13vw, 160px);
      color: #fafafa;
    }

    .hero-text-over .hero-word-web {
      color: #0a0a0a;
      -webkit-text-stroke: 1.5px #fafafa;
    }

    .hero-word-stack {
      display: flex;
      flex-direction: column;
      margin-left: 0.1em;
    }

    .hero-word-designer,
    .hero-word-developer {
      font-size: clamp(34px, 5.2vw, 68px);
      color: #fafafa;
    }

    .hero-text-over .hero-word-designer,
    .hero-text-over .hero-word-developer {
      color: #0a0a0a;
      -webkit-text-stroke: 1.5px #fafafa;
    }

    /* Vrstva 2: fotka */
    .hero-photo {
      position: absolute;
      height: clamp(220px, 38vw, 380px);
      width: auto;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      z-index: 3;
      pointer-events: none;
    }

    /* Přístupnostní skrytý h1 */
    .hero-typo-wrap .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }

    /* Mobil: vertikální stack */
    @media (max-width: 540px) {
      .hero {
        padding-top: 3rem;
        padding-bottom: 3rem;
      }

      .hero-typo-wrap {
        flex-direction: column;
        min-height: auto;
        padding-bottom: 2rem;
      }

      .hero-text-behind,
      .hero-text-over {
        flex-direction: column;
        align-items: center;
      }

      .hero-word-stack {
        flex-direction: row;
        margin-left: 0;
        gap: 0.2em;
        justify-content: center;
      }

      .hero-photo {
        position: relative;
        left: auto;
        top: auto;
        transform: none;
        height: clamp(180px, 60vw, 280px);
        margin: 0.5rem 0;
      }

      .hero-text-over {
        position: absolute;
        inset: 0;
        -webkit-mask-size: auto clamp(180px, 60vw, 280px);
        mask-size: auto clamp(180px, 60vw, 280px);
      }
    }
```

- [ ] **Krok 3: Ověřit že `/* ========== SMOKE CANVAS ==========` zůstal nedotčen**

Ihned za novou CSS sekcí musí stále být:
```css
    /* ========== SMOKE CANVAS ========== */
    .aether-canvas {
```

- [ ] **Krok 4: Commit**

```bash
git add index.html
git commit -m "feat: add hero typography composition CSS"
```

---

## Task 3: Nahradit hero HTML

**Files:**
- Modify: `index.html:364-394`

- [ ] **Krok 1: Najít stávající hero HTML**

Lokace — celý vnitřek `<section class="hero">` (řádky 364–394):
```html
  <section class="hero" id="hero">
    <canvas id="aetherFlow" class="aether-canvas"></canvas>
    <div class="hero-fade"></div>

    <div class="container hero-content">
      <h1 class="hero-title">
        ...
      </h1>
      <p class="hero-description" ...>...</p>
      <div class="hero-actions">
        ...
      </div>
    </div>
  </section>
```

- [ ] **Krok 2: Nahradit obsah sekce**

Nahradit celý `<section class="hero" id="hero">` blokem:
```html
  <!-- ========== HERO ========== -->
  <section class="hero" id="hero">
    <canvas id="aetherFlow" class="aether-canvas"></canvas>
    <div class="hero-fade"></div>

    <div class="container">
      <div class="hero-typo-wrap">

        <!-- Vrstva 1: bílý text za fotkou -->
        <div class="hero-text-behind">
          <span class="hero-word-web">Web</span>
          <div class="hero-word-stack">
            <span class="hero-word-designer">Designer</span>
            <span class="hero-word-developer">Developer</span>
          </div>
        </div>

        <!-- Vrstva 2: fotka s průhledným pozadím -->
        <img src="assets/hero-sekce.png" alt="" class="hero-photo" aria-hidden="true">

        <!-- Vrstva 3: text nad fotkou — černý s bílým outlinem, oříznutý maskou fotky -->
        <div class="hero-text-over" aria-hidden="true">
          <span class="hero-word-web">Web</span>
          <div class="hero-word-stack">
            <span class="hero-word-designer">Designer</span>
            <span class="hero-word-developer">Developer</span>
          </div>
        </div>

        <!-- SEO nadpis (vizuálně skrytý) -->
        <h1 class="sr-only">Web Designer &amp; Developer — Pavel Fuxa</h1>

      </div>
    </div>
  </section>
```

- [ ] **Krok 3: Ověřit v prohlížeči**

Otevřít `index.html`:
- Vidíš tři velké texty: "Web", "Designer", "Developer" v Bebas Neue
- Fotka `hero-sekce.png` se zobrazuje uprostřed a překrývá text
- V místě fotky text změní barvu na černou s bílým outlinem

- [ ] **Krok 4: Ověřit na mobilním rozlišení**

V DevTools → Toggle Device (375px šířka):
- Texty se vertikálně stackují (Web → fotka → Designer Developer)
- Vše se vejde do viewportu

- [ ] **Krok 5: Commit**

```bash
git add index.html
git commit -m "feat: replace hero with typography + photo composition"
```

---

## Potenciální doladění po implementaci

Pokud mask-image nesedí přesně na fotku (clip je příliš velký nebo malý):
- Upravit `mask-size` hodnotu v `.hero-text-over` — zvětšit nebo zmenšit `clamp(220px, 38vw, 380px)` dle výšky fotky
- Totéž pro `.hero-photo` výšku — obě hodnoty musí být identické
