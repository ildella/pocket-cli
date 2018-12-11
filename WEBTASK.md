# WEBTASK

The proxy server runs on Webtask

```bash
wt create -b src/server/auth-proxy.js --secrets-file .authproxy.env
wt update pocket-server src/server/ -w
```