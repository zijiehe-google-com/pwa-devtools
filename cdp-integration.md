<!-- Output copied to clipboard! -->

<!-----
NEW: Check the "Suppress top comment" to remove this info from the output.

Conversion time: 1.397 seconds.


Using this Markdown file:

1. Cut and paste this output into your source file.
2. See the notes and action items below regarding this conversion run.
3. Check the rendered output (headings, lists, code blocks, tables) for proper
   formatting and use a linkchecker before you publish this page.

Conversion notes:

* GDC version 1.1.19 r36
* Wed Jul 10 2024 10:46:18 GMT-0700 (Pacific Daylight Time)
* Source doc: https://docs.google.com/open?id=1vi5wbtQ92_S1sfioM5u4Y0VGYGxfUsBI8k_fuQVdNFU
----->



# Instruction of using PWA via CDP

[zijiehe@google.com](mailto:zijiehe@google.com)

Jul 10, 2024

Visibility: Public


## Declaration

Use of this instruction requires no google internal knowledge nor exposes any confidential information. Anyone with basic programming knowledge can retrieve the following information or perform the same tests on a public linux devbox.


## Terms

[Chrome DevTools Protocol (i.e. CDP)](https://chromedevtools.github.io/devtools-protocol/) allows for tools to instrument, inspect, debug and profile Chromium, Chrome and other Blink-based browsers.

[Progressive Web App (i.e. PWA)](https://web.dev/explore/progressive-web-apps) are web apps built and enhanced with modern APIs to provide enhanced capabilities while still reaching any web user on any device with a single codebase.

CDP + PWA provides CDP to control the behavior of the browser to debug and test PWA.


## Demo

The preferred way of running CDP is to [use puppeteer](https://developer.chrome.com/docs/puppeteer). This document won’t cover too much detail about the puppeteer itself, but only focuses on how to use it to access PWA commands.


#### Prerequisites

The demo needs npm and nodejs, puppeteer is installed by npm. An apt-based installation script is at https://github.com/zijiehe-google-com/pwa-devtools/blob/main/install.sh.

Demo uses Chrome dev channel (or google-chrome-unstable in some contexts) on linux; see https://www.google.com/chrome/dev/?platform=linux&extra=devchannel for the instruction of installation. Eventually the required changes will be released to the Chrome production (M128 or upper), and regular google-chrome can be used.


#### Important Caveat - uninstall when you are done!

This 'actually' installs the web app on your system - to ensure this is properly cleaned up after your test is complete, please make sure you uninstall the web app in the test!


#### Basic Ideas

(May skip this section if you are familiar with puppeteer and CDP.)

Create a browser instance via puppeteer.launch,


```
export const browser = await puppeteer.launch({
  // No need to use unstable once the PWA implementations roll to prod.
  executablePath:
      '/usr/bin/google-chrome-unstable',
  headless: false,
  args: ['--window-size=700,700', '--window-position=10,10'],
  // Use pipe to allow executing high privilege commands.
  pipe: true,
});
```


Create a browser CDP session,


```
const browserSession = await browser.target().createCDPSession();
```


Send CDP commands via CDP session. This function also logs the I/O to the console, but only the `session.send` matters.


```
async function send(session, msg, param) {
  if (session == null) {
    session = browserSession;
  }
  console.log('    >>> Sending: ', msg, ': ', JSON.stringify(param));
  console.log('    <<< Response: ', trim(JSON.stringify(
      (await session.send(msg, param)
                    .catch(error => console.log('    <<< Error: ', error))))));
}
```


Create a page CDP session,


```
async function current_page_session() {
  return (await browser.pages()).pop().createCDPSession();
}
```



#### Demo2.mjs

The demo installs a webapp https://developer.chrome.com/, launches it, inspects its states, opens it into its own app window, and uninstalls it.

The source code is at https://github.com/zijiehe-google-com/pwa-devtools/blob/main/demo2.mjs.

A video of running demo2.mjs on chrome canary channel on linux can be found at https://youtu.be/G4wmhSCXhH4.


#### Access via WebSocket

Though it’s less preferred, directly using WebSocket is also possible. It requires more effort to manage the I/O. More details won’t be discussed here, https://github.com/zijiehe-google-com/pwa-devtools/blob/main/demo.mjs is an example.


## Supported APIs

[See the source code.](https://source.chromium.org/search?q=domain%5CsPWA$%20f:browser_protocol.pdl%20-f:devtools-frontend&ssfr=1)
