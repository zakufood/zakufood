import { spawn } from 'child_process';
import http from 'http';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getWsUrl(port) {
  for (let i = 0; i < 20; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json`);
      const list = await res.json();
      if (list && list[0] && list[0].webSocketDebuggerUrl) {
        return list[0].webSocketDebuggerUrl;
      }
    } catch (e) {
      await sleep(300);
    }
  }
  throw new Error('Chrome remote debugging not ready');
}

async function testCart() {
  console.log('>>> Launching headless Chrome with remote debugging...');
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9222;

  const chromeProc = spawn(chromePath, [
    '--headless=new',
    '--disable-gpu',
    `--remote-debugging-port=${port}`,
    '--window-size=1360,900',
    'http://localhost:5000'
  ]);

  try {
    const wsUrl = await getWsUrl(port);
    console.log('>>> Connected to Chrome:', wsUrl);

    const ws = new globalThis.WebSocket(wsUrl);

    let id = 1;
    const callbacks = new Map();

    ws.addEventListener('message', (event) => {
      const msg = JSON.parse(event.data.toString());
      if (msg.id && callbacks.has(msg.id)) {
        const { resolve, reject } = callbacks.get(msg.id);
        callbacks.delete(msg.id);
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
      }
    });

    await new Promise((resolve) => {
      if (ws.readyState === 1) resolve();
      else ws.addEventListener('open', resolve, { once: true });
    });

    function send(method, params = {}) {
      return new Promise((resolve, reject) => {
        const reqId = id++;
        callbacks.set(reqId, { resolve, reject });
        ws.send(JSON.stringify({ id: reqId, method, params }));
      });
    }

    await send('Page.enable');
    await send('Runtime.enable');
    await sleep(2000);

    // 1. Initial State Check
    console.log('\n>>> 1. Checking Initial Floating Cart State...');
    let res = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const widget = document.querySelector('aside[aria-label="Floating shopping cart"]');
          if (!widget) return null;
          const texts = Array.from(widget.querySelectorAll('span')).map(s => s.innerText.trim());
          return { found: true, texts };
        })()
      `,
      returnByValue: true
    });
    console.log('  Initial text in floating cart:', res.result.value);

    // 2. Add an item by clicking Add to Cart on the first card
    console.log('\n>>> 2. Adding First Product to Cart...');
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const buttons = Array.from(document.querySelectorAll('button')).filter(b => b.innerText.includes('Add to Cart'));
          if (buttons.length > 0) {
            buttons[0].click();
            return true;
          }
          return false;
        })()
      `
    });
    await sleep(1500);

    res = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const widget = document.querySelector('aside[aria-label="Floating shopping cart"]');
          const texts = Array.from(widget.querySelectorAll('span')).map(s => s.innerText.trim());
          return texts;
        })()
      `,
      returnByValue: true
    });
    console.log('  Floating cart after adding 1 item:', res.result.value);

    // 3. Add second product
    console.log('\n>>> 3. Adding Second Product to Cart...');
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const buttons = Array.from(document.querySelectorAll('button')).filter(b => b.innerText.includes('Add to Cart'));
          if (buttons.length > 1) {
            buttons[1].click();
            return true;
          }
          return false;
        })()
      `
    });
    await sleep(1500);

    res = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const widget = document.querySelector('aside[aria-label="Floating shopping cart"]');
          const texts = Array.from(widget.querySelectorAll('span')).map(s => s.innerText.trim());
          return texts;
        })()
      `,
      returnByValue: true
    });
    console.log('  Floating cart after adding 2 items:', res.result.value);

    // 4. Test clicking the floating widget to open Cart Drawer
    console.log('\n>>> 4. Testing Clicking Floating Widget to Open Cart Drawer...');
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const widget = document.querySelector('aside[aria-label="Floating shopping cart"]');
          if (widget) widget.click();
        })()
      `
    });
    await sleep(1000);

    const drawerCheck = await send('Runtime.evaluate', {
      expression: `
        (() => {
          return document.body.innerText.includes('Your Shopping Cart');
        })()
      `,
      returnByValue: true
    });
    console.log('  Cart Drawer open state:', drawerCheck.result.value ? 'OPEN (SUCCESS)' : 'CLOSED (FAILED)');

    // 5. Increase quantity inside cart drawer
    console.log('\n>>> 5. Increasing quantity of item in Cart Drawer...');
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          // Find buttons with Plus icon in the drawer
          const buttons = Array.from(document.querySelectorAll('button'));
          // In CartDrawer, plus button is next to quantity
          const plusBtn = buttons.find(b => b.querySelector('svg.lucide-plus') || b.innerHTML.includes('lucide-plus'));
          if (plusBtn) {
            plusBtn.click();
            plusBtn.click(); // +2 items
            return true;
          }
          return false;
        })()
      `
    });
    await sleep(1000);

    res = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const widget = document.querySelector('aside[aria-label="Floating shopping cart"]');
          const texts = Array.from(widget.querySelectorAll('span')).map(s => s.innerText.trim());
          return texts;
        })()
      `,
      returnByValue: true
    });
    console.log('  Floating cart after quantity increase (total quantities):', res.result.value);

    // Close the drawer to take clean screenshot of the widget with 4 items
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const closeBtn = Array.from(document.querySelectorAll('button')).find(b => b.querySelector('svg.lucide-x') || b.innerHTML.includes('lucide-x'));
          if (closeBtn) closeBtn.click();
        })()
      `
    });
    await sleep(1000);

    // 6. Capture screenshot of the floating widget with items!
    console.log('\n>>> 6. Capturing Screenshot of Floating Cart with Items...');
    const screenshot = await send('Page.captureScreenshot', { format: 'png' });
    const fs = await import('fs');
    fs.writeFileSync('C:\\Users\\USER\\zaku_floating_active.png', Buffer.from(screenshot.data, 'base64'));
    fs.copyFileSync('C:\\Users\\USER\\zaku_floating_active.png', 'C:\\Users\\USER\\.gemini\\antigravity\\brain\\f526b373-3ea7-49c5-981a-cba1287a05da\\zaku_floating_active.png');
    console.log('  Screenshot saved to zaku_floating_active.png');

    ws.close();
  } finally {
    chromeProc.kill();
  }
}

testCart().catch(console.error);
