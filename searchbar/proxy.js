const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const { Transform } = require("stream");

const app = express();

const htmlInjection = `
<!-- AUTONOMI TOOLBAR -->

<div id="autonomi-toolbar" style="
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 2147483647;
  background: #222;
  padding: 7px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.3);
  font-family: sans-serif;
">
  <div style="
    display: flex;
    align-items: center;
    padding: 3px 8px;
    background-color: #222;
    border-radius: 4px;
  ">
    <img
      id="headerLogo"
      alt="logo"
      style="height: 32px; margin-right: 12px;"
    />

    <div style="display: flex; flex: 1; align-items: center;">
      <input
        id="xornameInput"
        type="text"
        placeholder="Enter Autonomi URL"
        style="
          flex: 1;
          height: 32px;
          padding: 0 12px;
          font-size: 14px;
          border: 1px solid #444;
          border-right: none;
          border-radius: 4px 0 0 4px;
          background: white;
          color: black;
          box-sizing: border-box;
        "
      />

      <button
        id="searchBtn"
        title="Search"
        style="
          height: 32px;
          padding: 0 12px;
          border: 1px solid #444;
          border-left: none;
          border-radius: 0 8px 8px 0;
          background: #7c7c7c;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          user-select: none;
        "
        onmouseover="this.style.background='#555'"
        onmouseout="this.style.background='#7c7c7c'"
      >
        🔍
      </button>

      <button
        id="downloadBtn"
        title="Download"
        style="
          height: 32px;
          padding: 0 12px;
          margin-left: 5px;
          border: 1px solid #444;
          border-radius: 8px;
          background: #7c7c7c;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          user-select: none;
        "
        onmouseover="this.style.background='#555'"
        onmouseout="this.style.background='#7c7c7c'"
      >
        ⬇️
      </button>
    </div>
  </div>
</div>

<script>
      const wrapper = document.createElement("div");
            wrapper.id = "autonomi-toolbar-wrapper";
            wrapper.style.position = "fixed";
            wrapper.style.top = "0";
            wrapper.style.left = "0";
            wrapper.style.right = "0";
            wrapper.style.zIndex = "2147483647";
            wrapper.innerHTML = document.currentScript.parentElement.innerHTML;



            const tryInsert = () => {
                if (document.body && document.documentElement) {
                    document.body.insertBefore(
                        wrapper,
                        document.body.firstChild
                    );

                    const toolbar = wrapper.querySelector("#autonomi-toolbar");

                    // after layout
                    requestAnimationFrame(() => {
                        const toolbarHeight = toolbar.offsetHeight;

                        // push page content down
                        document.body.style.marginTop = toolbarHeight + "px";
                        document.documentElement.style.scrollPaddingTop = toolbarHeight + "px";

                        // offset fixed elements top if they overlap toolbar
                        function offsetFixedElements() {
                            document.querySelectorAll("*").forEach((el) => {
                                const style = getComputedStyle(el);
                                if (
                                    style.position === "fixed" &&
                                    !wrapper.contains(el) &&
                                    parseFloat(style.top) < toolbarHeight
                                ) {
                                    const originalTop = parseFloat(style.top);
                                    el.style.top = 
                                        originalTop + toolbarHeight
                                    + "px";
                                }
                            });
                        }

                        offsetFixedElements();

                        // future additions of fixed elements and offset them
                        const observer = new MutationObserver(() => {
                            offsetFixedElements();
                        });
                        observer.observe(document.body, {
                            childList: true,
                            subtree: true,
                        });
                    });

                    // set image src for logo
                    const img = document.getElementById("headerLogo");
                    if (img) {
                        img.src = chrome.runtime.getURL(
                            "images/header-light.png"
                        );
                    }

                    setupEventListeners();
                } else {
                    setTimeout(tryInsert, 50);
                }
            };

            tryInsert();
</script>
`;

const injectToolbar = () => {
    return new Transform({
        transform(chunk, encoding, callback) {
            let body = chunk.toString();
            if (body.includes("</body>")) {
                body = body.replace("</body>", `${htmlInjection}</body>`);
            }
            this.push(body);
            callback();
        },
    });
};

app.use(
    "/",
    createProxyMiddleware({
        target: "http://dweb:8083", // internal docker address of dweb
        changeOrigin: true,
        selfHandleResponse: true,
        onProxyRes(proxyRes, req, res) {
            const contentType = proxyRes.headers["content-type"] || "";
            if (contentType.includes("text/html")) {
                res.setHeader("Content-Type", contentType);
                proxyRes.pipe(injectToolbar()).pipe(res);
            } else {
                proxyRes.pipe(res);
            }
        },
    })
);

app.listen(3000, () => {
    console.log("Proxy listening on http://localhost:3000");
});
