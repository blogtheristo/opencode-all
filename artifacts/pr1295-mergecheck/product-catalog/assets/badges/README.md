# Product Badges

This directory contains official badges and trust marks for DWS IQ Platform products.

## EU Sovereign Badge

**File:** `EU_Sovereign.png`

The EU-Sovereign badge signifies that a product **offers EU-sovereign deployment options** with the following capabilities:

### Sovereignty Requirements (for EU-Sovereign Deployment Tiers)

| Requirement | Applies To | Description |
|-------------|------------|-------------|
| **EU Data Residency** | European Cloud, Sovereign Private | Data stored in Finland/Germany |
| **No CLOUD Act Exposure** | European Cloud, Sovereign Private | No US jurisdiction; Global Cloud tier: CLOUD Act may apply |
| **GDPR Native** | All Tiers | Built-in GDPR compliance |
| **GAIA-X Aligned** | European Cloud, Sovereign Private | Following GAIA-X Level 3 standards |
| **EU AI Act Ready** | All Tiers | Article 12 reasoning lineage (Aug 2026) |

**Note:** The badge indicates the product supports EU-sovereign configurations. Customers choose their deployment tier (Global Cloud, European Cloud, or Sovereign Private Cloud) based on their compliance requirements. Full sovereignty guarantees apply only to European Cloud and Sovereign Private Cloud tiers.

### Usage Guidelines

1. **Placement:** Display prominently on product pages, documentation headers, and marketing materials
2. **Size:** Minimum 100px width for web, 300dpi for print
3. **Color:** Use official EU blue (#003399) and gold (#FFCC00)
4. **Link:** Badge should link to `/sovereignty/sovereignty.html`

### Badge Variants

| Variant | File | Use Case |
|---------|------|----------|
| Full Color | `EU_Sovereign.png` | Primary use |
| White | `EU_Sovereign_white.png` | Dark backgrounds |
| Monochrome | `EU_Sovereign_mono.png` | Print, grayscale |

### HTML Implementation

```html
<a href="/sovereignty/sovereignty.html" title="EU-Sovereign by Design">
    <img src="/product-catalog/assets/badges/EU_Sovereign.png"
         alt="EU-Sovereign Badge"
         width="120"
         height="120">
</a>
```

### CSS Badge Class

```css
.eu-sovereign-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.25rem 0.75rem;
    background: #003399;
    color: #FFCC00;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 600;
    text-decoration: none;
}
```

---

## Badge Placement Checklist

### Products that MUST display EU Sovereign badge:

- [x] LWM V1 (Lifetime World Model)
- [x] Firehorse V2 (Forensic AI Platform)
- [ ] DWS IQ Dashboard
- [ ] Carbon Calculator
- [ ] Fleet Management

### Digital Touchpoints:

- [ ] Homepage hero section
- [x] /sovereignty landing page
- [ ] Product specification pages
- [ ] Trust Center
- [ ] API documentation
- [ ] Email signatures
- [ ] Sales decks

---

**Last Updated:** 2026-01-28
**Owner:** Marketing & Product Strategy

