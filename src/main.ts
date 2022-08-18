import EE from "events";
import type { EventEmitter } from "events";

interface IPrintcartDesigner {
  token: string;
  productId: string;
  options?: IOptions;
}

interface IOptions {
  processBtnBgColor?: string;
  logoUrl?: string;
  designerUrl?: string;
}

const IFRAME_WRAPPER_ID = "pc-designer-iframe-wrapper";
const IFRAME_ID = "pc-designer-iframe";

class PrintcartDesigner {
  token: string;
  productId: string;
  options?: IOptions;

  #designerUrl: string;
  #emitter: EventEmitter;

  constructor(config: IPrintcartDesigner) {
    this.token = config.token;
    this.productId = config.productId;
    this.options = config.options;

    this.#designerUrl = this.options?.designerUrl
      ? this.options.designerUrl
      : import.meta.env.VITE_CUSTOMIZER_URL
      ? import.meta.env.VITE_CUSTOMIZER_URL
      : "https://customizer.printcart.com";
    //@ts-ignore
    this.#emitter = new EE();

    if (!this.token || !this.productId) {
      console.error("Missing Config Params");

      return;
    }

    this.#initIframe();
    this.#registerEventListener();
  }

  #initIframe() {
    const wrapper = document.createElement("div");

    wrapper.id = IFRAME_WRAPPER_ID;

    wrapper.style.cssText =
      "position:fixed;top:0;left:0;width:100vw;height:100vh;opacity:0;visibility:hidden;z-index:99999";

    const iframe = document.createElement("iframe");

    iframe.id = IFRAME_ID;
    iframe.width = "100%";
    iframe.height = "100%";

    wrapper.appendChild(iframe);
    document.body.appendChild(wrapper);
  }

  #registerEventListener() {
    window.addEventListener(
      "message",
      (event) => {
        if (
          event.origin === this.#designerUrl &&
          event.data.message === "closeDesignTool"
        ) {
          const wrapper = document.getElementById(IFRAME_WRAPPER_ID);

          if (!wrapper) return;

          wrapper.style.opacity = "0";
          wrapper.style.visibility = "hidden";

          this.#emit("close");
        }

        if (event.data.message === "finishLoad") {
          const iframe = document.getElementById(IFRAME_ID);

          this.#emit("onload");

          if (
            iframe &&
            iframe instanceof HTMLIFrameElement &&
            iframe.contentWindow
          ) {
            iframe.contentWindow.postMessage(
              { message: "customSettings", settings: this.options },
              this.#designerUrl
            );
          }
        }

        if (event.data.message === "finishProcess") {
          this.#emit("upload-success", event.data.data.data);
        }

        if (event.data.message === "uploadError") {
          this.#emit("upload-error", event.data);
        }
      },
      false
    );
  }

  #createDesignUrl() {
    const url = new URL(this.#designerUrl);

    url.searchParams.set("api_key", this.token);
    url.searchParams.set("product_id", this.productId);
    url.searchParams.set("parentUrl", window.location.href);

    return url;
  }

  open() {
    //TODO: Deduplicate
    const wrapper = document.getElementById(IFRAME_WRAPPER_ID);
    const iframe = document.getElementById(IFRAME_ID);

    if (!iframe || !(iframe instanceof HTMLIFrameElement) || !wrapper) {
      console.error("Can not find iframe element");

      return;
    }

    const url = this.#createDesignUrl();

    iframe.src = url.href;

    wrapper.style.opacity = "1";
    wrapper.style.visibility = "visible";

    this.#emit("open");
  }

  close() {
    const wrapper = document.getElementById(IFRAME_WRAPPER_ID);

    if (!wrapper) {
      console.error("Can not find iframe element");

      return;
    }

    wrapper.style.opacity = "0";
    wrapper.style.visibility = "hidden";

    this.#emit("close");
  }

  editDesign(designId: string) {
    const url = this.#createDesignUrl();

    url.searchParams.set("design_id", designId);
    url.searchParams.set("task", "edit");

    const wrapper = document.getElementById(IFRAME_WRAPPER_ID);
    const iframe = document.getElementById(IFRAME_ID);

    if (!iframe || !(iframe instanceof HTMLIFrameElement) || !wrapper) {
      console.error("Can not find iframe element");

      return;
    }

    iframe.src = url.href;

    wrapper.style.opacity = "1";
    wrapper.style.visibility = "visible";

    this.#emit("edit");
  }

  on(event: string, callback: (...args: any[]) => void) {
    this.#emitter.on(event, callback);

    return this;
  }

  #emit(event: string, ...args: any[]) {
    this.#emitter.emit(event, ...args);
  }
}

export default PrintcartDesigner;
