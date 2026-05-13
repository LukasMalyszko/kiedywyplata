# Kiedy Wyplata 🇵🇱

A web application for checking payment dates of social benefits in Poland.

## Features

- **Payment schedules**: Current payout dates for 800+, ZUS pensions, benefits, and other programs
- **Clean URLs**: Categories available under short paths (`/family`, `/pension`)
- **Detail pages**: Each benefit has its own dedicated page (`/benefit/800plus`)
- **Categorization**: Benefits grouped into categories (family, pensions, allowances, social)
- **Responsive design**: Full support for mobile devices
- **SEO**: Optimized meta tags and structure for search engines
- **AdSense**: Ready-to-use Google AdSense integration
- **Static generation**: Fast loading with Next.js SSG

## URL Structure

### Categories (short URLs)
- `/family` - Family benefits (800+, family allowance)
- `/pension` - Pensions and annuities (ZUS, KRUS, 13th/14th pension)
- `/benefits` - Allowances (sickness, maternity)
- `/social` - Social benefits (coal allowance, etc.)

### Benefit details
- `/benefit/800plus` - 800+ benefit details
- `/benefit/emerytura` - ZUS pension details
- `/benefit/zasilek-chorobowy` - Sickness allowance details
- etc.

## Project Structure

```
├── data/
│   └── payments.json          # Payment data
├── src/
│   ├── app/
│   │   ├── [category]/        # Categories: /family, /pension, etc.
│   │   │   ├── page.tsx
│   │   │   └── page.scss
│   │   ├── benefit/[benefit]/ # Details: /benefit/800plus
│   │   │   ├── page.tsx
│   │   │   └── page.scss
│   │   ├── globals.scss       # Global SCSS styles
│   │   ├── layout.tsx         # Application layout
│   │   └── page.tsx           # Homepage
│   ├── components/
│   │   ├── payment-card/      # Payment card (BEM) with links
│   │   ├── next-payment-banner/ # Upcoming payment banner
│   │   ├── category-grid/     # Category grid
│   │   └── adsense/           # AdSense components
│   └── types/
│       └── payment.ts         # TypeScript types
└── public/
    └── adsense.html           # AdSense integration example
```

## Getting Started

### Requirements
- Node.js 18+
- npm/yarn/pnpm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at: http://localhost:3000

### Production Build

```bash
# Build the app
npm run build

# Start production server
npm start
```

## BEM Styling

The project uses the BEM methodology for CSS:

```scss
// Block
.payment-card { }

// Element
.payment-card__title { }
.payment-card__description { }

// Modifier
.payment-card--upcoming { }
.payment-card--past { }
```

## Deployment

### Automatic deployment with Vercel

1. **Connect to GitHub**: Push your code to a GitHub repository
2. **Connect to Vercel**: Go to [vercel.com](https://vercel.com) -> "New Project" -> import your repo
3. **Configure variables**: Add environment variables in the Vercel dashboard
4. **Done!**: Vercel will deploy automatically on every push to `main`

### Manual deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Log in
vercel login

# Deploy preview
vercel

# Deploy production
vercel --prod
```

### CI/CD Pipeline

The project includes:
- **GitHub Actions**: Automated tests and builds
- **Vercel Integration**: Auto-deploy from GitHub
- **Preview Deployments**: For pull requests
- **Production Deploys**: From the `main` branch

Detailed instructions: [`DEPLOYMENT.md`](./DEPLOYMENT.md)

## License

MIT License - free to use in commercial projects.

---

**Kiedy Wyplata** - Always up to date with benefit payment schedules in Poland. 🇵🇱
