import { Preferences as E } from "@capacitor/preferences";
import { Device as P } from "@capacitor/device";
import { Directory as p, Encoding as F, Filesystem as h } from "@capacitor/filesystem";
class le {
  /**
   * Set a value
   * @param key - The key to store the value under
   * @param value - The value to store
   * @param type - The type of the value
   */
  static async set(e, t, r) {
    r || (typeof t == "string" ? r = "string" : typeof t == "boolean" ? r = "boolean" : typeof t == "number" ? r = "number" : Array.isArray(t) ? r = "array" : t instanceof Date ? r = "date" : r = "object");
    let a;
    switch (r) {
      case "string":
        a = t;
        break;
      case "boolean":
        a = t.toString();
        break;
      case "number":
        a = t.toString();
        break;
      case "date":
        a = t instanceof Date ? t.toISOString() : new Date(t).toISOString();
        break;
      case "array":
      case "object":
        a = JSON.stringify(t);
        break;
    }
    await E.set({ key: e, value: a });
  }
  /**
   * Get a value
   * @param key - The key to get the value from
   * @param type - The type of the value - if not provided, the value will be returned as is (a string)
   * @returns The value
   */
  static async get(e, t) {
    const r = await E.get({ key: e });
    if (!r.value) return null;
    if (!t || t === "string")
      return r.value;
    switch (t) {
      case "boolean":
        return r.value === "true";
      case "number":
        return parseFloat(r.value);
      case "date":
        return new Date(r.value);
      case "array":
      case "object":
        try {
          return JSON.parse(r.value);
        } catch {
          return null;
        }
      default:
        return r.value;
    }
  }
  /**
   * Remove a value
   * @param key - The key to remove the value from
   */
  static async remove(e) {
    await E.remove({ key: e });
  }
  /**
   * Get all keys
   * @returns All keys
   */
  static async keys() {
    return await E.keys().then((e) => e.keys);
  }
  /**
   * Check if a key exists
   * @param key - The key to check
   * @returns True if the key exists, false otherwise
   */
  static async has(e) {
    return await E.keys().then((t) => t.keys.includes(e));
  }
  /**
   * Clear all values
   */
  static async clear() {
    await E.clear();
  }
}
/*! Capacitor: https://capacitorjs.com/ - MIT License */
var A;
(function(i) {
  i.Unimplemented = "UNIMPLEMENTED", i.Unavailable = "UNAVAILABLE";
})(A || (A = {}));
class j extends Error {
  constructor(e, t, r) {
    super(e), this.message = e, this.code = t, this.data = r;
  }
}
const J = (i) => {
  var e, t;
  return i != null && i.androidBridge ? "android" : !((t = (e = i == null ? void 0 : i.webkit) === null || e === void 0 ? void 0 : e.messageHandlers) === null || t === void 0) && t.bridge ? "ios" : "web";
}, X = (i) => {
  const e = i.CapacitorCustomPlatform || null, t = i.Capacitor || {}, r = t.Plugins = t.Plugins || {}, a = () => e !== null ? e.name : J(i), s = () => a() !== "web", n = (c) => {
    const o = w.get(c);
    return !!(o != null && o.platforms.has(a()) || l(c));
  }, l = (c) => {
    var o;
    return (o = t.PluginHeaders) === null || o === void 0 ? void 0 : o.find((x) => x.name === c);
  }, u = (c) => i.console.error(c), w = /* @__PURE__ */ new Map(), S = (c, o = {}) => {
    const x = w.get(c);
    if (x)
      return console.warn(`Capacitor plugin "${c}" already registered. Cannot register plugins twice.`), x.proxy;
    const v = a(), C = l(c);
    let b;
    const Y = async () => (!b && v in o ? b = typeof o[v] == "function" ? b = await o[v]() : b = o[v] : e !== null && !b && "web" in o && (b = typeof o.web == "function" ? b = await o.web() : b = o.web), b), N = (d, y) => {
      var g, m;
      if (C) {
        const D = C == null ? void 0 : C.methods.find((f) => y === f.name);
        if (D)
          return D.rtype === "promise" ? (f) => t.nativePromise(c, y.toString(), f) : (f, T) => t.nativeCallback(c, y.toString(), f, T);
        if (d)
          return (g = d[y]) === null || g === void 0 ? void 0 : g.bind(d);
      } else {
        if (d)
          return (m = d[y]) === null || m === void 0 ? void 0 : m.bind(d);
        throw new j(`"${c}" plugin is not implemented on ${v}`, A.Unimplemented);
      }
    }, I = (d) => {
      let y;
      const g = (...m) => {
        const D = Y().then((f) => {
          const T = N(f, d);
          if (T) {
            const U = T(...m);
            return y = U == null ? void 0 : U.remove, U;
          } else
            throw new j(`"${c}.${d}()" is not implemented on ${v}`, A.Unimplemented);
        });
        return d === "addListener" && (D.remove = async () => y()), D;
      };
      return g.toString = () => `${d.toString()}() { [capacitor code] }`, Object.defineProperty(g, "name", {
        value: d,
        writable: !1,
        configurable: !1
      }), g;
    }, M = I("addListener"), _ = I("removeListener"), V = (d, y) => {
      const g = M({ eventName: d }, y), m = async () => {
        const f = await g;
        _({
          eventName: d,
          callbackId: f
        }, y);
      }, D = new Promise((f) => g.then(() => f({ remove: m })));
      return D.remove = async () => {
        console.warn("Using addListener() without 'await' is deprecated."), await m();
      }, D;
    }, $ = new Proxy({}, {
      get(d, y) {
        switch (y) {
          case "$$typeof":
            return;
          case "toJSON":
            return () => ({});
          case "addListener":
            return C ? V : M;
          case "removeListener":
            return _;
          default:
            return I(y);
        }
      }
    });
    return r[c] = $, w.set(c, {
      name: c,
      proxy: $,
      platforms: /* @__PURE__ */ new Set([...Object.keys(o), ...C ? [v] : []])
    }), $;
  };
  return t.convertFileSrc || (t.convertFileSrc = (c) => c), t.getPlatform = a, t.handleError = u, t.isNativePlatform = s, t.isPluginAvailable = n, t.registerPlugin = S, t.Exception = j, t.DEBUG = !!t.DEBUG, t.isLoggingEnabled = !!t.isLoggingEnabled, t;
}, Q = (i) => i.Capacitor = X(i), W = /* @__PURE__ */ Q(typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {}), O = W.registerPlugin;
class B {
  constructor() {
    this.listeners = {}, this.retainedEventArguments = {}, this.windowListeners = {};
  }
  addListener(e, t) {
    let r = !1;
    this.listeners[e] || (this.listeners[e] = [], r = !0), this.listeners[e].push(t);
    const s = this.windowListeners[e];
    s && !s.registered && this.addWindowListener(s), r && this.sendRetainedArgumentsForEvent(e);
    const n = async () => this.removeListener(e, t);
    return Promise.resolve({ remove: n });
  }
  async removeAllListeners() {
    this.listeners = {};
    for (const e in this.windowListeners)
      this.removeWindowListener(this.windowListeners[e]);
    this.windowListeners = {};
  }
  notifyListeners(e, t, r) {
    const a = this.listeners[e];
    if (!a) {
      if (r) {
        let s = this.retainedEventArguments[e];
        s || (s = []), s.push(t), this.retainedEventArguments[e] = s;
      }
      return;
    }
    a.forEach((s) => s(t));
  }
  hasListeners(e) {
    var t;
    return !!(!((t = this.listeners[e]) === null || t === void 0) && t.length);
  }
  registerWindowListener(e, t) {
    this.windowListeners[t] = {
      registered: !1,
      windowEventName: e,
      pluginEventName: t,
      handler: (r) => {
        this.notifyListeners(t, r);
      }
    };
  }
  unimplemented(e = "not implemented") {
    return new W.Exception(e, A.Unimplemented);
  }
  unavailable(e = "not available") {
    return new W.Exception(e, A.Unavailable);
  }
  async removeListener(e, t) {
    const r = this.listeners[e];
    if (!r)
      return;
    const a = r.indexOf(t);
    a !== -1 && this.listeners[e].splice(a, 1), this.listeners[e].length || this.removeWindowListener(this.windowListeners[e]);
  }
  addWindowListener(e) {
    window.addEventListener(e.windowEventName, e.handler), e.registered = !0;
  }
  removeWindowListener(e) {
    e && (window.removeEventListener(e.windowEventName, e.handler), e.registered = !1);
  }
  sendRetainedArgumentsForEvent(e) {
    const t = this.retainedEventArguments[e];
    t && (delete this.retainedEventArguments[e], t.forEach((r) => {
      this.notifyListeners(e, r);
    }));
  }
}
const H = (i) => encodeURIComponent(i).replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent).replace(/[()]/g, escape), K = (i) => i.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent);
class Z extends B {
  async getCookies() {
    const e = document.cookie, t = {};
    return e.split(";").forEach((r) => {
      if (r.length <= 0)
        return;
      let [a, s] = r.replace(/=/, "CAP_COOKIE").split("CAP_COOKIE");
      a = K(a).trim(), s = K(s).trim(), t[a] = s;
    }), t;
  }
  async setCookie(e) {
    try {
      const t = H(e.key), r = H(e.value), a = e.expires ? `; expires=${e.expires.replace("expires=", "")}` : "", s = (e.path || "/").replace("path=", ""), n = e.url != null && e.url.length > 0 ? `domain=${e.url}` : "";
      document.cookie = `${t}=${r || ""}${a}; path=${s}; ${n};`;
    } catch (t) {
      return Promise.reject(t);
    }
  }
  async deleteCookie(e) {
    try {
      document.cookie = `${e.key}=; Max-Age=0`;
    } catch (t) {
      return Promise.reject(t);
    }
  }
  async clearCookies() {
    try {
      const e = document.cookie.split(";") || [];
      for (const t of e)
        document.cookie = t.replace(/^ +/, "").replace(/=.*/, `=;expires=${(/* @__PURE__ */ new Date()).toUTCString()};path=/`);
    } catch (e) {
      return Promise.reject(e);
    }
  }
  async clearAllCookies() {
    try {
      await this.clearCookies();
    } catch (e) {
      return Promise.reject(e);
    }
  }
}
O("CapacitorCookies", {
  web: () => new Z()
});
const ee = async (i) => new Promise((e, t) => {
  const r = new FileReader();
  r.onload = () => {
    const a = r.result;
    e(a.indexOf(",") >= 0 ? a.split(",")[1] : a);
  }, r.onerror = (a) => t(a), r.readAsDataURL(i);
}), te = (i = {}) => {
  const e = Object.keys(i);
  return Object.keys(i).map((a) => a.toLocaleLowerCase()).reduce((a, s, n) => (a[s] = i[e[n]], a), {});
}, re = (i, e = !0) => i ? Object.entries(i).reduce((r, a) => {
  const [s, n] = a;
  let l, u;
  return Array.isArray(n) ? (u = "", n.forEach((w) => {
    l = e ? encodeURIComponent(w) : w, u += `${s}=${l}&`;
  }), u.slice(0, -1)) : (l = e ? encodeURIComponent(n) : n, u = `${s}=${l}`), `${r}&${u}`;
}, "").substr(1) : null, ae = (i, e = {}) => {
  const t = Object.assign({ method: i.method || "GET", headers: i.headers }, e), a = te(i.headers)["content-type"] || "";
  if (typeof i.data == "string")
    t.body = i.data;
  else if (a.includes("application/x-www-form-urlencoded")) {
    const s = new URLSearchParams();
    for (const [n, l] of Object.entries(i.data || {}))
      s.set(n, l);
    t.body = s.toString();
  } else if (a.includes("multipart/form-data") || i.data instanceof FormData) {
    const s = new FormData();
    if (i.data instanceof FormData)
      i.data.forEach((l, u) => {
        s.append(u, l);
      });
    else
      for (const l of Object.keys(i.data))
        s.append(l, i.data[l]);
    t.body = s;
    const n = new Headers(t.headers);
    n.delete("content-type"), t.headers = n;
  } else (a.includes("application/json") || typeof i.data == "object") && (t.body = JSON.stringify(i.data));
  return t;
};
class ie extends B {
  /**
   * Perform an Http request given a set of options
   * @param options Options to build the HTTP request
   */
  async request(e) {
    const t = ae(e, e.webFetchExtra), r = re(e.params, e.shouldEncodeUrlParams), a = r ? `${e.url}?${r}` : e.url, s = await fetch(a, t), n = s.headers.get("content-type") || "";
    let { responseType: l = "text" } = s.ok ? e : {};
    n.includes("application/json") && (l = "json");
    let u, w;
    switch (l) {
      case "arraybuffer":
      case "blob":
        w = await s.blob(), u = await ee(w);
        break;
      case "json":
        u = await s.json();
        break;
      case "document":
      case "text":
      default:
        u = await s.text();
    }
    const S = {};
    return s.headers.forEach((c, o) => {
      S[o] = c;
    }), {
      data: u,
      headers: S,
      status: s.status,
      url: s.url
    };
  }
  /**
   * Perform an Http GET request given a set of options
   * @param options Options to build the HTTP request
   */
  async get(e) {
    return this.request(Object.assign(Object.assign({}, e), { method: "GET" }));
  }
  /**
   * Perform an Http POST request given a set of options
   * @param options Options to build the HTTP request
   */
  async post(e) {
    return this.request(Object.assign(Object.assign({}, e), { method: "POST" }));
  }
  /**
   * Perform an Http PUT request given a set of options
   * @param options Options to build the HTTP request
   */
  async put(e) {
    return this.request(Object.assign(Object.assign({}, e), { method: "PUT" }));
  }
  /**
   * Perform an Http PATCH request given a set of options
   * @param options Options to build the HTTP request
   */
  async patch(e) {
    return this.request(Object.assign(Object.assign({}, e), { method: "PATCH" }));
  }
  /**
   * Perform an Http DELETE request given a set of options
   * @param options Options to build the HTTP request
   */
  async delete(e) {
    return this.request(Object.assign(Object.assign({}, e), { method: "DELETE" }));
  }
}
O("CapacitorHttp", {
  web: () => new ie()
});
var q;
(function(i) {
  i.Dark = "DARK", i.Light = "LIGHT", i.Default = "DEFAULT";
})(q || (q = {}));
var z;
(function(i) {
  i.StatusBar = "StatusBar", i.NavigationBar = "NavigationBar";
})(z || (z = {}));
class se extends B {
  async setStyle() {
    this.unavailable("not available for web");
  }
  async setAnimation() {
    this.unavailable("not available for web");
  }
  async show() {
    this.unavailable("not available for web");
  }
  async hide() {
    this.unavailable("not available for web");
  }
}
O("SystemBars", {
  web: () => new se()
});
const k = O("KeepAwake", {
  web: () => import("./web-DnEcETYi.js").then((i) => new i.KeepAwakeWeb())
});
class de {
  /**
   * Device methods
   */
  /**
   * Get the device id
   * @returns The device id
   */
  static async getDeviceId() {
    return (await P.getId()).identifier;
  }
  /**
   * Get the device info
   * @returns The device info (see DeviceInfo interface)
   */
  static async getDeviceInfo() {
    return await P.getInfo();
  }
  /**
   * Check if the device is mobile
   * @returns True if the device is mobile, false otherwise (web)
   */
  static async isDeviceMobile() {
    return await P.getInfo().then((e) => e.platform === "ios" || e.platform === "android");
  }
  /**
   * Check if the device is iOS
   * @returns True if the device is iOS, false otherwise
   */
  static async isDeviceIOS() {
    return await P.getInfo().then((e) => e.platform === "ios");
  }
  /**
   * Check if the device is Android
   * @returns True if the device is Android, false otherwise
   */
  static async isDeviceAndroid() {
    return await P.getInfo().then((e) => e.platform === "android");
  }
  /**
   * Check if the device is an emulator
   * @returns True if the device is an emulator, false otherwise
   */
  static async isDeviceEmulator() {
    return await P.getInfo().then((e) => e.isVirtual);
  }
  /**
   * Awake methods
   */
  /**
   * Keep the screen awake
   * Used to prevent the screen from dimming or turning off
   */
  static async keepAwake() {
    await k.isSupported().then(async (e) => {
      e && await k.keepAwake();
    });
  }
  /**
   * Allow the screen to sleep
   * Used to allow the screen to dim or turn off
   */
  static async allowSleep() {
    await k.isSupported().then(async (e) => {
      e && await k.allowSleep();
    });
  }
  /**
   * Check if the screen is kept awake
   * @returns True if the screen is kept awake, false otherwise
   */
  static async isKeptAwake() {
    return await k.isKeptAwake().then((e) => e.isKeptAwake);
  }
}
const R = O("Network", {
  web: () => import("./web-BlYmWAZ2.js").then((i) => new i.NetworkWeb())
});
class ue {
  /**
   * Check if the device is connected to the network
   * @returns True if the device is connected to the network, false otherwise
   */
  static async isConnected() {
    return await R.getStatus().then((e) => e.connected);
  }
  /**
   * Get the type of connection the device is using
   * ConnectionType is one of 'wifi', 'cellular', 'none', 'unknown'
   * @returns The type of connection the device is using
   */
  static async getConnectionType() {
    return await R.getStatus().then((e) => e.connectionType);
  }
  /**
   * Get the status of the network connection
   * ConnectionStatus is an object with the following properties:
   * - connected: boolean
   * - connectionType: ConnectionType
   * @returns The status of the network connection
   */
  static async getStatus() {
    return await R.getStatus();
  }
  /**
   * Watch for changes in the network connection
   * @param callback The callback to call when the network connection changes
   * @returns The listener handle
   */
  static async watch(e) {
    return await R.addListener("networkStatusChange", (t) => {
      e(t);
    });
  }
  /**
   * Unwatch for changes in the network connection
   * @param listener The listener to unsubscribe from
   */
  static async unwatch(e) {
    await e.remove();
  }
}
const L = class L {
  static getCapacitorDirectory(e) {
    const t = e || this.defaultDirectory;
    return this.DIRECTORY_MAP[t];
  }
  static getCapacitorEncoding(e) {
    if (!(!e || e === "base64"))
      return this.ENCODING_MAP[e];
  }
  static stripDataUrlPrefix(e) {
    return e.includes(",") ? e.split(",")[1] : e;
  }
  static async blobToBase64(e) {
    const t = new Uint8Array(await e.arrayBuffer());
    let r = "";
    const a = 32768;
    for (let s = 0; s < t.length; s += a)
      r += String.fromCharCode(...t.subarray(s, s + a));
    return btoa(r);
  }
  /**
   * Check current file system permissions (Android scoped storage).
   */
  static async checkPermissions() {
    return (await h.checkPermissions()).publicStorage === "granted";
  }
  /**
   * Request file system permissions from the user (Android scoped storage).
   */
  static async requestPermissions() {
    return (await h.requestPermissions()).publicStorage === "granted";
  }
  /**
   * Read the contents of a file and return the raw data payload.
  */
  static async readFile(e) {
    const t = this.getCapacitorDirectory(e.directory), r = this.getCapacitorEncoding(e.encoding), a = await h.readFile({
      path: e.path,
      directory: t,
      encoding: r
    });
    return typeof a.data == "string" ? e.encoding === "base64" ? this.stripDataUrlPrefix(a.data) : a.data : e.encoding === "base64" ? await this.blobToBase64(a.data) : await a.data.text();
  }
  /**
   * Write data to a file, creating parent directories when needed.
   */
  static async writeFile(e) {
    const t = this.getCapacitorDirectory(e.directory), r = this.getCapacitorEncoding(e.encoding), a = typeof e.data == "string" && e.encoding === "base64" ? this.stripDataUrlPrefix(e.data) : e.data;
    return (await h.writeFile({
      path: e.path,
      data: a,
      directory: t,
      encoding: r,
      recursive: e.recursive
      // create any missing parent directories if true
    })).uri;
  }
  /**
   * Append data to an existing file, creating the file if it is missing.
   */
  static async appendFile(e) {
    const t = this.getCapacitorDirectory(e.directory), r = this.getCapacitorEncoding(e.encoding), a = typeof e.data == "string" ? e.encoding === "base64" ? this.stripDataUrlPrefix(e.data) : e.data : await this.blobToBase64(e.data);
    return await h.appendFile({
      path: e.path,
      data: a,
      directory: t,
      encoding: r
    }), !0;
  }
  /**
   * Delete the file located at the provided path.
   */
  static async deleteFile(e) {
    const t = this.getCapacitorDirectory(e.directory);
    return await h.deleteFile({
      path: e.path,
      directory: t
    }), !0;
  }
  /**
   * Retrieve metadata about a file or directory (size, timestamps, etc.).
   */
  static async stat(e) {
    const t = this.getCapacitorDirectory(e.directory), r = await h.stat({
      path: e.path,
      directory: t
    });
    return {
      name: r.uri.split("/").pop() || "",
      uri: r.uri,
      size: r.size,
      modifiedAt: r.mtime,
      createdAt: r.ctime,
      isDirectory: r.type === "directory"
    };
  }
  /**
   * Compute the Capacitor file URI for a given path and directory.
   */
  static async getUri(e) {
    const t = this.getCapacitorDirectory(e.directory);
    return (await h.getUri({
      path: e.path,
      directory: t
    })).uri;
  }
  /**
   * List the files and directories within a specific path.
   */
  static async listDirectory(e) {
    const t = this.getCapacitorDirectory(e.directory);
    return (await h.readdir({
      path: e.path,
      directory: t
    })).files.map((a) => ({
      name: a.name,
      uri: a.uri,
      isDirectory: a.type === "directory",
      size: a.size
    }));
  }
  /**
   * Create a directory, optionally including missing parent folders.
   */
  static async createDirectory(e) {
    const t = e.directory || this.defaultDirectory, r = this.DIRECTORY_MAP[t];
    return await h.mkdir({
      path: e.path,
      directory: r,
      recursive: e.recursive
      // create any missing parent directories if true
    }), !0;
  }
  /**
   * Remove a directory and, optionally, its nested contents.
   */
  static async removeDirectory(e) {
    const t = e.directory || this.defaultDirectory, r = this.DIRECTORY_MAP[t];
    return await h.rmdir({
      path: e.path,
      directory: r,
      recursive: e.recursive
    }), !0;
  }
  /**
   * Copy a file or directory to a new location.
   */
  static async copy(e) {
    const t = this.getCapacitorDirectory(e.directory), r = this.getCapacitorDirectory(e.toDirectory), a = this.DIRECTORY_MAP[t], s = this.getCapacitorDirectory(r);
    return (await h.copy({
      from: e.from,
      to: e.to,
      directory: a,
      toDirectory: s
    })).uri;
  }
  /**
   * Move or rename a file or directory.
   */
  static async rename(e) {
    const t = this.getCapacitorDirectory(e.directory), r = this.getCapacitorDirectory(e.toDirectory), a = this.DIRECTORY_MAP[t], s = this.getCapacitorDirectory(r);
    return await h.rename({
      from: e.from,
      to: e.to,
      directory: a,
      toDirectory: s
    }), await this.getUri({
      path: e.to,
      directory: r
    });
  }
  /**
   * Determine whether the provided path resolves to a local file URI.
   */
  static isLocalFile(e) {
    return e.startsWith("file://") || e.startsWith("content://") || e.startsWith("capacitor://") || !e.startsWith("http://") && !e.startsWith("https://");
  }
  /**
   * Return the file extension (without the leading dot) for a given path.
   * Example: 'document.pdf' returns 'pdf'
   */
  static getFileExtension(e) {
    const t = this.getFileName(e), r = t.lastIndexOf(".");
    return r === -1 || r === t.length - 1 ? "" : t.substring(r + 1);
  }
  /**
   * Return the final segment (filename) from a provided path string.
   * Example: '/path/to/file.txt' returns 'file.txt'
   */
  static getFileName(e) {
    const t = e.replace(/\/+$/, ""), r = t.lastIndexOf("/");
    return r === -1 ? t : t.substring(r + 1);
  }
};
L.defaultDirectory = "DATA", L.DIRECTORY_MAP = {
  DOCUMENTS: p.Documents,
  DATA: p.Data,
  LIBRARY: p.Library,
  CACHE: p.Cache,
  EXTERNAL: p.External,
  EXTERNAL_STORAGE: p.ExternalStorage,
  EXTERNAL_CACHE: p.ExternalCache,
  LIBRARY_NO_CLOUD: p.Library,
  TEMPORARY: p.Cache
}, L.ENCODING_MAP = {
  utf8: F.UTF8,
  ascii: F.ASCII,
  utf16: F.UTF16
};
let G = L;
export {
  de as D,
  G as F,
  ue as N,
  le as S,
  B as W
};
//# sourceMappingURL=index-DDhgTavP.js.map
