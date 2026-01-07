import { Preferences as P } from "@capacitor/preferences";
import { Device as A } from "@capacitor/device";
import { Directory as p, Encoding as S, Filesystem as h } from "@capacitor/filesystem";
class ne {
  /**
   * Set a value
   * @param key - The key to store the value under
   * @param value - The value to store
   * @param type - The type of the value
   */
  static async set(e, t, r) {
    r || (typeof t == "string" ? r = "string" : typeof t == "boolean" ? r = "boolean" : typeof t == "number" ? r = "number" : Array.isArray(t) ? r = "array" : t instanceof Date ? r = "date" : r = "object");
    let i;
    switch (r) {
      case "string":
        i = t;
        break;
      case "boolean":
        i = t.toString();
        break;
      case "number":
        i = t.toString();
        break;
      case "date":
        i = t instanceof Date ? t.toISOString() : new Date(t).toISOString();
        break;
      case "array":
      case "object":
        i = JSON.stringify(t);
        break;
    }
    await P.set({ key: e, value: i });
  }
  /**
   * Get a value
   * @param key - The key to get the value from
   * @param type - The type of the value - if not provided, the value will be returned as is (a string)
   * @returns The value
   */
  static async get(e, t) {
    const r = await P.get({ key: e });
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
    await P.remove({ key: e });
  }
  /**
   * Get all keys
   * @returns All keys
   */
  static async keys() {
    return await P.keys().then((e) => e.keys);
  }
  /**
   * Check if a key exists
   * @param key - The key to check
   * @returns True if the key exists, false otherwise
   */
  static async has(e) {
    return await P.keys().then((t) => t.keys.includes(e));
  }
  /**
   * Clear all values
   */
  static async clear() {
    await P.clear();
  }
}
/*! Capacitor: https://capacitorjs.com/ - MIT License */
var C;
(function(s) {
  s.Unimplemented = "UNIMPLEMENTED", s.Unavailable = "UNAVAILABLE";
})(C || (C = {}));
class M extends Error {
  constructor(e, t, r) {
    super(e), this.message = e, this.code = t, this.data = r;
  }
}
const N = (s) => {
  var e, t;
  return s != null && s.androidBridge ? "android" : !((t = (e = s == null ? void 0 : s.webkit) === null || e === void 0 ? void 0 : e.messageHandlers) === null || t === void 0) && t.bridge ? "ios" : "web";
}, V = (s) => {
  const e = s.CapacitorCustomPlatform || null, t = s.Capacitor || {}, r = t.Plugins = t.Plugins || {}, i = () => e !== null ? e.name : N(s), a = () => i() !== "web", n = (c) => {
    const o = w.get(c);
    return !!(o != null && o.platforms.has(i()) || d(c));
  }, d = (c) => {
    var o;
    return (o = t.PluginHeaders) === null || o === void 0 ? void 0 : o.find((R) => R.name === c);
  }, u = (c) => s.console.error(c), w = /* @__PURE__ */ new Map(), L = (c, o = {}) => {
    const R = w.get(c);
    if (R)
      return console.warn(`Capacitor plugin "${c}" already registered. Cannot register plugins twice.`), R.proxy;
    const E = i(), v = d(c);
    let m;
    const G = async () => (!m && E in o ? m = typeof o[E] == "function" ? m = await o[E]() : m = o[E] : e !== null && !m && "web" in o && (m = typeof o.web == "function" ? m = await o.web() : m = o.web), m), B = (l, y) => {
      var g, b;
      if (v) {
        const D = v == null ? void 0 : v.methods.find((f) => y === f.name);
        if (D)
          return D.rtype === "promise" ? (f) => t.nativePromise(c, y.toString(), f) : (f, I) => t.nativeCallback(c, y.toString(), f, I);
        if (l)
          return (g = l[y]) === null || g === void 0 ? void 0 : g.bind(l);
      } else {
        if (l)
          return (b = l[y]) === null || b === void 0 ? void 0 : b.bind(l);
        throw new M(`"${c}" plugin is not implemented on ${E}`, C.Unimplemented);
      }
    }, U = (l) => {
      let y;
      const g = (...b) => {
        const D = G().then((f) => {
          const I = B(f, l);
          if (I) {
            const T = I(...b);
            return y = T == null ? void 0 : T.remove, T;
          } else
            throw new M(`"${c}.${l}()" is not implemented on ${E}`, C.Unimplemented);
        });
        return l === "addListener" && (D.remove = async () => y()), D;
      };
      return g.toString = () => `${l.toString()}() { [capacitor code] }`, Object.defineProperty(g, "name", {
        value: l,
        writable: !1,
        configurable: !1
      }), g;
    }, j = U("addListener"), W = U("removeListener"), z = (l, y) => {
      const g = j({ eventName: l }, y), b = async () => {
        const f = await g;
        W({
          eventName: l,
          callbackId: f
        }, y);
      }, D = new Promise((f) => g.then(() => f({ remove: b })));
      return D.remove = async () => {
        console.warn("Using addListener() without 'await' is deprecated."), await b();
      }, D;
    }, $ = new Proxy({}, {
      get(l, y) {
        switch (y) {
          case "$$typeof":
            return;
          case "toJSON":
            return () => ({});
          case "addListener":
            return v ? z : j;
          case "removeListener":
            return W;
          default:
            return U(y);
        }
      }
    });
    return r[c] = $, w.set(c, {
      name: c,
      proxy: $,
      platforms: /* @__PURE__ */ new Set([...Object.keys(o), ...v ? [E] : []])
    }), $;
  };
  return t.convertFileSrc || (t.convertFileSrc = (c) => c), t.getPlatform = i, t.handleError = u, t.isNativePlatform = a, t.isPluginAvailable = n, t.registerPlugin = L, t.Exception = M, t.DEBUG = !!t.DEBUG, t.isLoggingEnabled = !!t.isLoggingEnabled, t;
}, J = (s) => s.Capacitor = V(s), F = /* @__PURE__ */ J(typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {}), x = F.registerPlugin;
class q {
  constructor() {
    this.listeners = {}, this.retainedEventArguments = {}, this.windowListeners = {};
  }
  addListener(e, t) {
    let r = !1;
    this.listeners[e] || (this.listeners[e] = [], r = !0), this.listeners[e].push(t);
    const a = this.windowListeners[e];
    a && !a.registered && this.addWindowListener(a), r && this.sendRetainedArgumentsForEvent(e);
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
    const i = this.listeners[e];
    if (!i) {
      if (r) {
        let a = this.retainedEventArguments[e];
        a || (a = []), a.push(t), this.retainedEventArguments[e] = a;
      }
      return;
    }
    i.forEach((a) => a(t));
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
    return new F.Exception(e, C.Unimplemented);
  }
  unavailable(e = "not available") {
    return new F.Exception(e, C.Unavailable);
  }
  async removeListener(e, t) {
    const r = this.listeners[e];
    if (!r)
      return;
    const i = r.indexOf(t);
    this.listeners[e].splice(i, 1), this.listeners[e].length || this.removeWindowListener(this.windowListeners[e]);
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
const Y = (s) => encodeURIComponent(s).replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent).replace(/[()]/g, escape), H = (s) => s.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent);
class X extends q {
  async getCookies() {
    const e = document.cookie, t = {};
    return e.split(";").forEach((r) => {
      if (r.length <= 0)
        return;
      let [i, a] = r.replace(/=/, "CAP_COOKIE").split("CAP_COOKIE");
      i = H(i).trim(), a = H(a).trim(), t[i] = a;
    }), t;
  }
  async setCookie(e) {
    try {
      const t = Y(e.key), r = Y(e.value), i = `; expires=${(e.expires || "").replace("expires=", "")}`, a = (e.path || "/").replace("path=", ""), n = e.url != null && e.url.length > 0 ? `domain=${e.url}` : "";
      document.cookie = `${t}=${r || ""}${i}; path=${a}; ${n};`;
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
x("CapacitorCookies", {
  web: () => new X()
});
const Q = async (s) => new Promise((e, t) => {
  const r = new FileReader();
  r.onload = () => {
    const i = r.result;
    e(i.indexOf(",") >= 0 ? i.split(",")[1] : i);
  }, r.onerror = (i) => t(i), r.readAsDataURL(s);
}), Z = (s = {}) => {
  const e = Object.keys(s);
  return Object.keys(s).map((i) => i.toLocaleLowerCase()).reduce((i, a, n) => (i[a] = s[e[n]], i), {});
}, ee = (s, e = !0) => s ? Object.entries(s).reduce((r, i) => {
  const [a, n] = i;
  let d, u;
  return Array.isArray(n) ? (u = "", n.forEach((w) => {
    d = e ? encodeURIComponent(w) : w, u += `${a}=${d}&`;
  }), u.slice(0, -1)) : (d = e ? encodeURIComponent(n) : n, u = `${a}=${d}`), `${r}&${u}`;
}, "").substr(1) : null, te = (s, e = {}) => {
  const t = Object.assign({ method: s.method || "GET", headers: s.headers }, e), i = Z(s.headers)["content-type"] || "";
  if (typeof s.data == "string")
    t.body = s.data;
  else if (i.includes("application/x-www-form-urlencoded")) {
    const a = new URLSearchParams();
    for (const [n, d] of Object.entries(s.data || {}))
      a.set(n, d);
    t.body = a.toString();
  } else if (i.includes("multipart/form-data") || s.data instanceof FormData) {
    const a = new FormData();
    if (s.data instanceof FormData)
      s.data.forEach((d, u) => {
        a.append(u, d);
      });
    else
      for (const d of Object.keys(s.data))
        a.append(d, s.data[d]);
    t.body = a;
    const n = new Headers(t.headers);
    n.delete("content-type"), t.headers = n;
  } else (i.includes("application/json") || typeof s.data == "object") && (t.body = JSON.stringify(s.data));
  return t;
};
class re extends q {
  /**
   * Perform an Http request given a set of options
   * @param options Options to build the HTTP request
   */
  async request(e) {
    const t = te(e, e.webFetchExtra), r = ee(e.params, e.shouldEncodeUrlParams), i = r ? `${e.url}?${r}` : e.url, a = await fetch(i, t), n = a.headers.get("content-type") || "";
    let { responseType: d = "text" } = a.ok ? e : {};
    n.includes("application/json") && (d = "json");
    let u, w;
    switch (d) {
      case "arraybuffer":
      case "blob":
        w = await a.blob(), u = await Q(w);
        break;
      case "json":
        u = await a.json();
        break;
      case "document":
      case "text":
      default:
        u = await a.text();
    }
    const L = {};
    return a.headers.forEach((c, o) => {
      L[o] = c;
    }), {
      data: u,
      headers: L,
      status: a.status,
      url: a.url
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
x("CapacitorHttp", {
  web: () => new re()
});
const k = x("KeepAwake", {
  web: () => import("./web-CLNLbAHq.js").then((s) => new s.KeepAwakeWeb())
});
class ce {
  /**
   * Device methods
   */
  /**
   * Get the device id
   * @returns The device id
   */
  static async getDeviceId() {
    return (await A.getId()).identifier;
  }
  /**
   * Get the device info
   * @returns The device info (see DeviceInfo interface)
   */
  static async getDeviceInfo() {
    return await A.getInfo();
  }
  /**
   * Check if the device is mobile
   * @returns True if the device is mobile, false otherwise (web)
   */
  static async isDeviceMobile() {
    return await A.getInfo().then((e) => e.platform === "ios" || e.platform === "android");
  }
  /**
   * Check if the device is iOS
   * @returns True if the device is iOS, false otherwise
   */
  static async isDeviceIOS() {
    return await A.getInfo().then((e) => e.platform === "ios");
  }
  /**
   * Check if the device is Android
   * @returns True if the device is Android, false otherwise
   */
  static async isDeviceAndroid() {
    return await A.getInfo().then((e) => e.platform === "android");
  }
  /**
   * Check if the device is an emulator
   * @returns True if the device is an emulator, false otherwise
   */
  static async isDeviceEmulator() {
    return await A.getInfo().then((e) => e.isVirtual);
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
const _ = x("Network", {
  web: () => import("./web-B80ryF12.js").then((s) => new s.NetworkWeb())
});
class oe {
  /**
   * Check if the device is connected to the network
   * @returns True if the device is connected to the network, false otherwise
   */
  static async isConnected() {
    return await _.getStatus().then((e) => e.connected);
  }
  /**
   * Get the type of connection the device is using
   * ConnectionType is one of 'wifi', 'cellular', 'none', 'unknown'
   * @returns The type of connection the device is using
   */
  static async getConnectionType() {
    return await _.getStatus().then((e) => e.connectionType);
  }
  /**
   * Get the status of the network connection
   * ConnectionStatus is an object with the following properties:
   * - connected: boolean
   * - connectionType: ConnectionType
   * @returns The status of the network connection
   */
  static async getStatus() {
    return await _.getStatus();
  }
}
const O = class O {
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
    const t = e.directory || this.defaultDirectory, r = this.DIRECTORY_MAP[t], i = e.encoding ? this.ENCODING_MAP[e.encoding] : void 0, a = await h.readFile({
      path: e.path,
      directory: r,
      encoding: i
    });
    return typeof a.data == "string" ? a.data : await a.data.text();
  }
  /**
   * Write data to a file, creating parent directories when needed.
   */
  static async writeFile(e) {
    const t = e.directory || this.defaultDirectory, r = this.DIRECTORY_MAP[t], i = e.encoding ? this.ENCODING_MAP[e.encoding] : void 0;
    return (await h.writeFile({
      path: e.path,
      data: e.data,
      directory: r,
      encoding: i,
      recursive: e.recursive
      // create any missing parent directories if true
    })).uri;
  }
  /**
   * Append data to an existing file, creating the file if it is missing.
   */
  static async appendFile(e) {
    const t = e.directory || this.defaultDirectory, r = this.DIRECTORY_MAP[t], i = e.encoding ? this.ENCODING_MAP[e.encoding] : void 0;
    return await h.appendFile({
      path: e.path,
      data: e.data,
      directory: r,
      encoding: i
    }), !0;
  }
  /**
   * Delete the file located at the provided path.
   */
  static async deleteFile(e) {
    const t = e.directory || this.defaultDirectory, r = this.DIRECTORY_MAP[t];
    return await h.deleteFile({
      path: e.path,
      directory: r
    }), !0;
  }
  /**
   * Retrieve metadata about a file or directory (size, timestamps, etc.).
   */
  static async stat(e) {
    const t = e.directory || this.defaultDirectory, r = this.DIRECTORY_MAP[t], i = await h.stat({
      path: e.path,
      directory: r
    });
    return {
      name: i.uri.split("/").pop() || "",
      uri: i.uri,
      size: i.size,
      modifiedAt: i.mtime,
      createdAt: i.ctime,
      isDirectory: i.type === "directory"
    };
  }
  /**
   * Compute the Capacitor file URI for a given path and directory.
   */
  static async getUri(e) {
    const t = e.directory || this.defaultDirectory, r = this.DIRECTORY_MAP[t];
    return (await h.getUri({
      path: e.path,
      directory: r
    })).uri;
  }
  /**
   * List the files and directories within a specific path.
   */
  static async listDirectory(e) {
    const t = e.directory || this.defaultDirectory, r = this.DIRECTORY_MAP[t];
    return (await h.readdir({
      path: e.path,
      directory: r
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
    const t = e.directory || this.defaultDirectory, r = e.toDirectory || t, i = this.DIRECTORY_MAP[t], a = this.DIRECTORY_MAP[r];
    return (await h.copy({
      from: e.from,
      to: e.to,
      directory: i,
      toDirectory: a
    })).uri;
  }
  /**
   * Move or rename a file or directory.
   */
  static async rename(e) {
    const t = e.directory || this.defaultDirectory, r = e.toDirectory || t, i = this.DIRECTORY_MAP[t], a = this.DIRECTORY_MAP[r];
    return await h.rename({
      from: e.from,
      to: e.to,
      directory: i,
      toDirectory: a
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
O.defaultDirectory = "DATA", O.DIRECTORY_MAP = {
  DOCUMENTS: p.Documents,
  DATA: p.Data,
  LIBRARY: p.Library,
  CACHE: p.Cache,
  EXTERNAL: p.External,
  EXTERNAL_STORAGE: p.ExternalStorage,
  EXTERNAL_CACHE: p.ExternalCache,
  LIBRARY_NO_CLOUD: p.Library,
  TEMPORARY: p.Cache
}, O.ENCODING_MAP = {
  utf8: S.UTF8,
  ascii: S.ASCII,
  utf16: S.UTF16,
  base64: S.UTF8
  // Capacitor doesn't have base64, use UTF8 as fallback
};
let K = O;
export {
  ce as D,
  K as F,
  oe as N,
  ne as S,
  q as W
};
//# sourceMappingURL=index-DFoILYNA.js.map
