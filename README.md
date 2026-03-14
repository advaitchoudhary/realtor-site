This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

### REALTOR.ca DDF® API (Address / MLS® Search)

Search by **address or MLS® number** using the [DDF API](https://ddfapi-docs.realtor.ca/):

1. Register at [tools.realtorlink.ca](https://tools.realtorlink.ca/) and obtain Client ID & Secret
2. Copy `.env.example` to `.env.local` and add:

```env
DDF_CLIENT_ID=your_client_id
DDF_CLIENT_SECRET=your_client_secret
```

3. The token URL and API base may vary; override via `DDF_TOKEN_URL` and `DDF_API_BASE_URL` if needed

**Security:** Never commit credentials. Use environment variables only. In production, use your platform's secret management.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
