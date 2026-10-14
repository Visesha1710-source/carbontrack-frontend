# CarbonTrack Frontend

React and Vite frontend. The `api` function forwards `/api/*` requests to the
Spring Boot backend and preserves session cookies.

## Local development

From this directory:

```sh
npm install
npm run dev
```

Vite proxies API requests to `http://localhost:8080` by default.

## Deploy to Vercel

1. Push the contents of this directory to
   `Visesha1710-source/carbontrack-frontend`.
2. Import that GitHub repository in Vercel. Use the repository root as the
   project root, `npm run build` as the build command, and `dist` as the output
   directory.
3. Set the `BACKEND_URL` environment variable to the Railway backend's public
   origin, such as `https://your-service.up.railway.app`. Do not include `/api`
   or a trailing path.
4. Deploy or redeploy after setting the environment variable.

Vercel serves the frontend and API proxy from the same origin. The proxy
forwards login cookies, so browser requests do not require cross-site cookies
or a separate CORS configuration.
