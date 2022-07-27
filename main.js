var designTool = {
  init: function () {
    const settings = this.getSettings();

    const btnId = settings && settings.buttonId ? settings.buttonId : null;

    this.createDesignButton(btnId);

    this.createIframe();

    window.addEventListener(
      "message",
      (event) => {
        const designToolUrl = import.meta.env.VITE_CUSTOMIZER_URL;

        if (
          event.origin === designToolUrl &&
          event.data.message === "closeDesignTool"
        ) {
          const wrapper = document.getElementById("pcdesigntool-iframe-wrapper");

          wrapper.style.opacity = 0;
          wrapper.style.visibility = "hidden";
        }

        if (event.data.message === "finishLoad") {
          const iframe = document.getElementById("pcdesigntool-iframe");

          iframe.contentWindow.postMessage(
            { message: "customSettings", settings: settings },
            designToolUrl
          );
        }
      },
      false
    );
  },

  getSettings: function () {
    const settings = window.PCDesignToolSettings;

    return settings;
  },

  createDesignButton: function (btnId) {
    if (btnId) {
      let btn = document.getElementById(btnId);

      btn.onclick = this.designBtnOnclickHandler;

      return;
    }

    let designBtn = document.createElement("button");

    designBtn.id = "pcdesigntool-design-btn";
    designBtn.onclick = this.designBtnOnclickHandler;
    designBtn.style.cssText =
      "position:fixed;top:50%;right:0;z-index:9999;padding:12px 16px;font-size:1.5rem;background:#2F7BF8;color:#fff;border:0;border-radius:4px";
    designBtn.textContent = "Start Design";

    document.body.appendChild(designBtn);
  },

  createIframe: function () {
    let wrapper = document.createElement("div");

    wrapper.id = "pcdesigntool-iframe-wrapper";

    wrapper.style.cssText =
      "position:fixed;top:0;left:0;width:100vw;height:100vh;opacity:0;visibility:hidden;z-index:99999";

    let iframe = document.createElement("iframe");

    iframe.id = "pcdesigntool-iframe";

    iframe.width = "100%";
    iframe.height = "100%";
    iframe.scrolling = "no";
    iframe.frameBorder = "0";
    iframe.noresize = "noresize";
    iframe.allowfullscreen = 1;
    iframe.mozallowfullscreen = 1;
    iframe.webkitallowfullscreen = 1;
    // iframe.setAttribute("data-src", iframeSrc);

    wrapper.appendChild(iframe);
    document.body.appendChild(wrapper);
  },

  designBtnOnclickHandler: function (event) {
    event.preventDefault();
    let wrapper = document.getElementById("pcdesigntool-iframe-wrapper");
    let iframe = document.getElementById("pcdesigntool-iframe");
    let script = document.getElementById("printcart-design-tool-sdk");

    const url = new URL(window.location.href);

    const apiKey = script.getAttribute("data-unauthToken");
    const productId = script.getAttribute("data-productId");

    const designToolUrl = import.meta.env.VITE_CUSTOMIZER_URL;

    const src =
      designToolUrl +
      "?api_key=" +
      apiKey +
      "&product_id=" +
      productId +
      "&parentUrl=" +
      url.origin;

    iframe.src = src;

    wrapper.style.opacity = 1;
    wrapper.style.visibility = "visible";
  },
};

designTool.init();

// designTool.prototype.open = designTool.designBtnOnclickHandler;

window["PrintcartDesignTool"] = designTool;
