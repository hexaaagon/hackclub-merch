<img width="2550" height="700" alt="Hack Club Merch Banner" src="https://github.com/user-attachments/assets/99c79154-12f0-4be5-a3c7-b35d436d1439" />

<div align="center">
  <h1>Hack Club Merch / merch-ysws.hexaa.sh</h1>
  <p>Hack Club's (drafted) YSWS event for you to receive some various merchandise.</p>
</div>

<div align="center">
  <a href="https://merch-ysws.hexaa.sh" target="_blank">merch-ysws.hexaa.sh</a>
  &nbsp;
  <a href="https://forms.fillout.com/t/5k2dwE9Lxpus" target="_blank">rsvp now</a>
  &nbsp;
  <a href="https://hackclub.slack.com/archives/C09JQFECCBG" target="_blank">#merch</a>
</div>

## Introduction

Merch is another YSWS project, all about Hack Club Merchandise! You can submit any project to the site, and after our team reviews it, you’ll get a payout — plus a bunch of shiny coins.
Those coins go straight into your balance, which you can spend in our store! The store works just like a normal e-commerce site (think GitHub Shop), but instead of using money, you’ll be spending your coins. 

## Tech Stack

- Turborepo 3
- Next.js 16
- React 19
- Typescript 5
- TailwindCSS 4
- Drizzle-orm (using Neon)
- Better-Auth
- SWR
- Framer Motion
- Lucide Icon & React Icons Pack
- Biome Linter & Formatter

## Monorepo Structure

```
┌─ apps/
│   ├─ merch             : the ultimate dashboard
│   └─ clothing          : clothing canvas preview for designer team (soon)
├─ packages/
│   ├─ auth              : authentication system using better-auth
│   ├─ config            : hard-coded config for safety reason
│   ├─ drizzle           : postgres database using drizzle-orm
│   ├─ slack             : slack bot controller, also provide message templates
│   ├─ types             : types
│   ├─ r2                : cdn handler via cloudflare r2 (soon)
│   ├─ clothing-template : clothing logic templates. (soon)
│   ├─ clothing-preview  : clothing preview for the sites (soon)
│   └─ product-print     : export products to png, jpg, or pdfs. (soon)
```

## Special Thanks to

<div>
  <a href="https://siege.hackclub.com/?ref=432">
    <img src="https://siege.hackclub.com/assets/logo-55998110.webp" alt="Hack Club Logo" height="48"></img>
  </a>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  <a href="https://hackclub.com">
    <img src="https://assets.hackclub.com/flag-standalone.svg" alt="Hack Club Logo" height="48"></img>
  </a>
</div>
