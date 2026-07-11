import fs from "node:fs/promises";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";

const localServer = process.env.SMOKE_URL ? null : await startStaticServer();
const url = process.env.SMOKE_URL || `http://127.0.0.1:${localServer.address().port}/`;
const chrome = process.env.CHROME_BIN || "/usr/bin/google-chrome-stable";
const port = Number(process.env.CDP_PORT || 9228);
const profileDir = await fs.mkdtemp(path.join(os.tmpdir(), "dotnet-quest-chrome-"));
const screenshotDir = path.join(process.cwd(), "tmp");

await fs.mkdir(screenshotDir, { recursive: true });

const child = spawn(chrome, [
  "--headless=new",
  "--disable-gpu",
  "--no-first-run",
  "--no-default-browser-check",
  "--disable-dev-shm-usage",
  "--remote-allow-origins=*",
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${profileDir}`,
  "about:blank"
], { stdio: "ignore" });

try {
  const tab = await waitForTab(port);
  const cdp = await connect(tab.webSocketDebuggerUrl);

  await cdp.send("Page.enable");
  await cdp.send("Runtime.enable");
  await cdp.send("Emulation.setDeviceMetricsOverride", {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });
  await cdp.send("Emulation.setTouchEmulationEnabled", { enabled: true });
  await cdp.send("Page.navigate", { url });
  await cdp.waitFor("Page.loadEventFired");
  await delay(250);

  const initial = await evaluate(cdp, () => {
    const nodes = [...document.querySelectorAll(".mission-node")];
    return {
      title: document.title,
      nodes: nodes.length,
      routeVisible: getComputedStyle(document.querySelector("#routePanel")).display !== "none",
      horizontalOverflow: document.documentElement.scrollWidth - window.innerWidth,
      firstNodeText: nodes[0]?.innerText || "",
      sources: document.querySelectorAll("#sourcesList li").length
    };
  });

  assert(initial.title.includes(".NET 10 Quest"), "title should load");
  assert(initial.nodes === 27, `expected 27 mission nodes, got ${initial.nodes}`);
  assert(initial.routeVisible, "route panel should be visible first");
  assert(initial.horizontalOverflow <= 1, `mobile overflow ${initial.horizontalOverflow}px`);
  assert(initial.sources === 7, `expected 7 sources, got ${initial.sources}`);

  await evaluate(cdp, () => {
    document.querySelector('[data-tab="challengePanel"]').click();
    document.querySelector('.answer-button[data-index="1"]').click();
    document.querySelector("#submitButton").click();
  });
  await delay(150);

  const answered = await evaluate(cdp, () => ({
    feedback: document.querySelector("#feedbackBox")?.innerText || "",
    xp: document.querySelector("#xpValue")?.textContent || "",
    secondStatus: document.querySelectorAll(".mission-node")[1]?.dataset.status || "",
    orderTrayDisplay: getComputedStyle(document.querySelector("#orderTray")).display,
    submitWidth: document.querySelector("#submitButton").getBoundingClientRect().width,
    panelWidth: document.querySelector("#challengePanel").getBoundingClientRect().width,
    overflow: document.documentElement.scrollWidth - window.innerWidth
  }));

  assert(answered.feedback.includes("Correcto"), "first mission should be answered correctly");
  assert(answered.xp === "40", `expected 40 XP, got ${answered.xp}`);
  assert(answered.secondStatus === "open", `second mission should unlock, got ${answered.secondStatus}`);
  assert(answered.orderTrayDisplay === "none", "order tray should stay hidden on choice missions");
  assert(answered.submitWidth > answered.panelWidth * 0.82, "submit button should span the action row");
  assert(answered.overflow <= 1, `mobile overflow after answer ${answered.overflow}px`);

  await capture(cdp, path.join(screenshotDir, "smoke-mobile.png"));

  await cdp.send("Emulation.setDeviceMetricsOverride", {
    width: 960,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });
  await delay(150);

  const desktop = await evaluate(cdp, () => ({
    routeDisplay: getComputedStyle(document.querySelector("#routePanel")).display,
    challengeDisplay: getComputedStyle(document.querySelector("#challengePanel")).display,
    navDisplay: getComputedStyle(document.querySelector(".bottom-nav")).display,
    overflow: document.documentElement.scrollWidth - window.innerWidth
  }));

  assert(desktop.routeDisplay !== "none", "route should stay visible on desktop");
  assert(desktop.challengeDisplay !== "none", "challenge should stay visible on desktop");
  assert(desktop.navDisplay === "none", "bottom nav should hide on desktop");
  assert(desktop.overflow <= 1, `desktop overflow ${desktop.overflow}px`);

  await capture(cdp, path.join(screenshotDir, "smoke-desktop.png"));
  await cdp.close();
  console.log("Chrome smoke OK: mobile flow, desktop layout, screenshots in tmp/.");
} finally {
  child.kill("SIGTERM");
  await waitForExit(child);
  if (localServer) {
    await new Promise((resolve) => localServer.close(resolve));
  }
  await removeProfileDir(profileDir);
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function waitForExit(childProcess) {
  if (childProcess.exitCode !== null || childProcess.signalCode !== null) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    childProcess.once("exit", resolve);
    setTimeout(resolve, 1500);
  });
}

async function removeProfileDir(dir) {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      await fs.rm(dir, { recursive: true, force: true });
      return;
    } catch (error) {
      if (attempt === 4) {
        console.warn(`Could not remove temporary Chrome profile: ${error.message}`);
        return;
      }
      await delay(250);
    }
  }
}

async function waitForTab(cdpPort) {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      const tabs = await getJson(`http://127.0.0.1:${cdpPort}/json`);
      const tab = tabs.find((item) => item.type === "page");
      if (tab?.webSocketDebuggerUrl) {
        return tab;
      }
    } catch {
      // Chrome is still starting.
    }
    await delay(100);
  }
  throw new Error("Chrome CDP did not become ready.");
}

function getJson(targetUrl) {
  return new Promise((resolve, reject) => {
    http.get(targetUrl, (response) => {
      let data = "";
      response.setEncoding("utf8");
      response.on("data", (chunk) => {
        data += chunk;
      });
      response.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch (error) {
          reject(error);
        }
      });
    }).on("error", reject);
  });
}

function startStaticServer() {
  const root = process.cwd();
  const mimeTypes = new Map([
    [".css", "text/css; charset=utf-8"],
    [".html", "text/html; charset=utf-8"],
    [".js", "text/javascript; charset=utf-8"],
    [".json", "application/json; charset=utf-8"],
    [".svg", "image/svg+xml; charset=utf-8"],
    [".webmanifest", "application/manifest+json; charset=utf-8"]
  ]);

  const server = http.createServer(async (request, response) => {
    try {
      const requestUrl = new URL(request.url || "/", "http://localhost");
      const pathname = decodeURIComponent(requestUrl.pathname);
      const relativePath = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
      const filePath = path.resolve(root, relativePath);

      if (filePath !== root && !filePath.startsWith(`${root}${path.sep}`)) {
        response.writeHead(403);
        response.end("Forbidden");
        return;
      }

      const body = await fs.readFile(filePath);
      response.writeHead(200, {
        "content-type": mimeTypes.get(path.extname(filePath)) || "application/octet-stream"
      });
      response.end(body);
    } catch {
      response.writeHead(404);
      response.end("Not found");
    }
  });

  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      server.off("error", reject);
      resolve(server);
    });
  });
}

async function connect(wsUrl) {
  const socket = new WebSocket(wsUrl);
  const pending = new Map();
  const listeners = new Map();
  let nextId = 1;

  await new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true });
    socket.addEventListener("error", reject, { once: true });
  });

  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (message.id && pending.has(message.id)) {
      const { resolve, reject } = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) {
        reject(new Error(message.error.message));
      } else {
        resolve(message.result || {});
      }
      return;
    }

    if (message.method && listeners.has(message.method)) {
      for (const resolve of listeners.get(message.method)) {
        resolve(message.params || {});
      }
      listeners.delete(message.method);
    }
  });

  return {
    send(method, params = {}) {
      const id = nextId;
      nextId += 1;
      socket.send(JSON.stringify({ id, method, params }));
      return new Promise((resolve, reject) => {
        pending.set(id, { resolve, reject });
      });
    },
    waitFor(method) {
      return new Promise((resolve) => {
        const queue = listeners.get(method) || [];
        queue.push(resolve);
        listeners.set(method, queue);
      });
    },
    close() {
      socket.close();
    }
  };
}

async function evaluate(cdp, fn) {
  const result = await cdp.send("Runtime.evaluate", {
    expression: `(${fn.toString()})()`,
    returnByValue: true,
    awaitPromise: true
  });

  if (result.exceptionDetails) {
    const details = result.exceptionDetails;
    const description = details.exception?.description || details.text || "Evaluation failed.";
    throw new Error(description);
  }

  return result.result.value;
}

async function capture(cdp, filePath) {
  const result = await cdp.send("Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: true
  });
  await fs.writeFile(filePath, Buffer.from(result.data, "base64"));
}
