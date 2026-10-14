import { Buffer } from 'node:buffer'
import process from 'node:process'

const HOP_BY_HOP_HEADERS = new Set([
  'connection',
  'content-encoding',
  'content-length',
  'host',
  'keep-alive',
  'origin',
  'proxy-authenticate',
  'proxy-authorization',
  'referer',
  'te',
  'trailer',
  'transfer-encoding',
  'upgrade'
])

export const config = {
  api: {
    bodyParser: false
  }
}

export default async function handler(req, res) {
  const backendUrl = process.env.BACKEND_URL

  if (!backendUrl) {
    console.error('BACKEND_URL is not configured')
    res.status(500).json({ error: 'Backend is not configured' })
    return
  }

  let target
  try {
    const backend = new URL(backendUrl)
    if (
      (backend.protocol !== 'https:' && backend.protocol !== 'http:') ||
      backend.username ||
      backend.password ||
      backend.pathname !== '/' ||
      backend.search ||
      backend.hash
    ) {
      throw new Error('BACKEND_URL must be an HTTP(S) origin without credentials or a path')
    }
    target = new URL(req.url, backend)
    if (target.origin !== backend.origin) {
      throw new Error('API request resolved outside BACKEND_URL')
    }
  } catch (error) {
    console.error('Invalid BACKEND_URL configuration', error)
    res.status(500).json({ error: 'Backend URL is invalid' })
    return
  }

  const headers = new Headers()
  for (const [name, value] of Object.entries(req.headers)) {
    if (value && !HOP_BY_HOP_HEADERS.has(name.toLowerCase())) {
      headers.set(name, Array.isArray(value) ? value.join(', ') : value)
    }
  }

  try {
    const response = await fetch(target, {
      method: req.method,
      headers,
      body: ['GET', 'HEAD'].includes(req.method) ? undefined : req,
      duplex: 'half',
      redirect: 'manual'
    })

    res.status(response.status)
    for (const [name, value] of response.headers) {
      if (!HOP_BY_HOP_HEADERS.has(name.toLowerCase()) && name !== 'set-cookie') {
        res.setHeader(name, value)
      }
    }

    const cookies = response.headers.getSetCookie()
    if (cookies.length > 0) {
      res.setHeader('set-cookie', cookies)
    }

    res.end(Buffer.from(await response.arrayBuffer()))
  } catch (error) {
    console.error('Backend request failed', error)
    res.status(502).json({ error: 'Backend is unavailable' })
  }
}
