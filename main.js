var designTool = {
  designToolUrl: __DESIGN_TOOL_URL__,

  apiKey: "",

  productId: "",

  settings: "",

  init: function () {
    this.settings = this.getSettings();

    var btnId =
      this.settings && this.settings.buttonId ? this.settings.buttonId : null;

    this.createDesignButton(btnId);

    this.createIframe();
  },

  getSettings: function () {
    var settings = window.PCDesignToolSettings;

    return settings;
  },

  createDesignButton: function (btnId) {
    if (btnId) {
      var btn = document.getElementById(btnId);

      btn.onclick = this.designBtnOnclickHandler;

      return;
    }

    var designBtn = document.createElement("button");

    designBtn.id = "pcdesigntool-design-btn";
    designBtn.onclick = this.designBtnOnclickHandler;
    designBtn.style.cssText =
      "position:fixed;top:50%;right:0;z-index:9999;padding:12px 16px;font-size:1.5rem;background:#2F7BF8;color:#fff;border:0;border-radius:4px";
    designBtn.textContent = "Start Design";

    document.body.appendChild(designBtn);
  },

  createIframe: function () {
    var script = document.getElementById("printcart-design-tool-sdk");

    this.apiKey = script.getAttribute("data-unauthToken");
    this.productId = script.getAttribute("data-productId");

    var locationHref = window.location.href;

    var iframeSrc =
      this.designToolUrl +
      "?api_key=" +
      this.apiKey +
      "&product_id=" +
      this.productId +
      "&parentUrl=" +
      locationHref;

    var wrapper = document.createElement("div");

    wrapper.id = "pcdesigntool-iframe-wrapper";

    wrapper.style.cssText =
      "position:fixed;top:0;left:0;width:100vw;height:100vh;opacity:0;visibility:hidden;z-index:99999";

    var iframe = document.createElement("iframe");

    iframe.id = "pcdesigntool-iframe";

    iframe.width = "100%";
    iframe.height = "100%";
    iframe.scrolling = "no";
    iframe.frameBorder = "0";
    iframe.noresize = "noresize";
    iframe.allowfullscreen = 1;
    iframe.mozallowfullscreen = 1;
    iframe.webkitallowfullscreen = 1;
    iframe.setAttribute("data-src", iframeSrc);

    wrapper.appendChild(iframe);
    document.body.appendChild(wrapper);
  },

  designBtnOnclickHandler: function () {
    var wrapper = document.getElementById("pcdesigntool-iframe-wrapper");
    var iframe = document.getElementById("pcdesigntool-iframe");

    wrapper.style.opacity = 1;
    wrapper.style.visibility = "visible";

    var src = iframe.getAttribute("data-src");

    iframe.src = src;
  },
};

designTool.init();

// designTool.prototype.open = designTool.designBtnOnclickHandler;

window["PrintcartDesignTool"] = designTool;
