# FoodieTwinzz — Viral Anaheim Eats Challenge

$1 for every 100 followers — finding the most viral food spots in Anaheim at every price point.

## Deploy to Vercel (2 minutes)

1. Push to GitHub:
   ```bash
   git init
   git add .
   git commit -m "initial commit"
   gh repo create foodietwinzz --public --push --source=.
   ```

2. Go to [vercel.com/new](https://vercel.com/new), import the repo, click Deploy.

3. Done — you'll get a URL like `foodietwinzz.vercel.app`

## How to Update

Edit `src/data.js` — change `"status": "next"` to `"status": "unlocked"` when you film a spot, then push. Vercel auto-deploys.

## Dev

```bash
npm install
npm run dev
```
