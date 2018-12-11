# WEBTASK

The proxy server runs on Webtask

### Create and update commands

```bash
wt create src/server/auth-proxy.js -b --secrets-file .authproxy.env --host pocketcli.pipelean.com
wt update pocket-server src/server/auth-proxy.js -w -b
```

### Custom domain

In order to verify the host we need to perform 2 actions on the DNS

1. CNAME pocketcli -> sandbox.auth0-extend.com
2. TXT `webtask:container:wt-c7bbe7e68d36c0caa6436b2be9c7052a-0` to the DNS of the pocketcli.pipelean.com domain.
