# Terminal Portfolio

A terminal/CLI themed personal portfolio website for a DevOps/SRE/Cloud engineering student.

## Tech Stack
- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS v4**
- **Framer Motion**
- **JetBrains Mono** (via `next/font`)

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout, font, metadata
│   ├── page.tsx            # Main page composing all sections
│   └── globals.css         # Design system, animations, variables
├── components/
│   ├── Terminal/
│   │   ├── TerminalWindow.tsx  # Terminal chrome with macOS dots
│   │   ├── TypedLine.tsx       # Typing animation component
│   │   ├── CommandNav.tsx      # CLI-style navigation
│   │   └── index.ts            # Barrel exports
│   └── sections/
│       ├── Hero.tsx        # Typed intro in terminal window
│       ├── About.tsx       # Bio + neofetch-style stats
│       ├── Skills.tsx      # Categorized skills grid
│       ├── Projects.tsx    # Git log-style project entries
│       ├── Roadmap.tsx     # Learning timeline checklist
│       ├── Contact.tsx     # CLI help-style contact info
│       └── Footer.tsx      # Terminal-themed footer
└── data/
    ├── profile.ts          # Personal info & socials
    ├── skills.ts           # Skills by category
    └── projects.ts         # Projects & roadmap items
```

## Deployment

Deploy to Vercel:

```bash
npx vercel
```

Or connect your GitHub repo to [vercel.com](https://vercel.com) for automatic deployments.

## Customization

Edit the files in `src/data/` to update:
- **profile.ts** — Your name, bio, social links
- **skills.ts** — Your skill categories and items
- **projects.ts** — Your projects and roadmap items

## Design

- Dark terminal aesthetic (`#0D1117` background)
- Matrix green accent (`#00FF41`)
- JetBrains Mono monospace font
- CRT scanline overlay effect
- Smooth typing animations
- Git log-style project cards