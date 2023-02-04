# Browser-2-Webhook

## What is Browser-2-Webhook?
Browser 2 Webhook is a Chrome & Opera extension. It allows to send POST requests to  Make, Zapier, n8n, Integrately & IFTTT webhooks with the current URL, title and description of the active tab.

## How do I install?
As is a Non approved browser extension, you should follow those steps:

1. Download this repo lastes version as a [ZIP](https://github.com/equisele/Browser-2-Webhook/archive/refs/heads/master.zip).
2. Uncompress the zip file anywhere in your computer. It will create a /Browser2Webhook/ folder.
3. Open [Chrome Extension Tab](chrome://extensions/) and at the top right corner, enable **Developers Mode**.
4. Select option "Load unpacked" and go to previous uncompressed folder in your computer. 
5. The accept and you have the Chrome extension loaded. 
6. Finally, you can pin in your browser toolbar and the, go to option to change the default sample url for your preferred Automation SaaS webhook url like [Make/Integromat](https://www.make.com/en/register?pc=equisele), [IFTTT](https://ifttt.com/join?referral_code=cLdgjkYTxFCULXIZMDLZDs616s6hudXA), Integrately, n8n or Zapier.

**Important:** only certain domain are allowed to be linked. Here you have the full list:

```
"https://hook.eu1.make.com/*",
"https://hook.us1.make.com/*",
"https://hook.integromat.com/*",
"https://hook.eu1.integromat.com/*",
"https://hook.us1.integromat.com/*",
"https://hooks.zapier.com/*",
"https://*.hooks.n8n.cloud/*",
"https://webhooks.integrately.com/*",
"https://maker.ifttt.com/trigger/*",
```
