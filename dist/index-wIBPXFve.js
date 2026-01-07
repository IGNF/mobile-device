import { Preferences as E } from "@capacitor/preferences";
import { Device as P } from "@capacitor/device";
import { Directory as m, Encoding as T, Filesystem as h } from "@capacitor/filesystem";
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
    await E.set({ key: e, value: i });
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
(function(a) {
  a.Unimplemented = "UNIMPLEMENTED", a.Unavailable = "UNAVAILABLE";
})(A || (A = {}));
class F extends Error {
  constructor(e, t, r) {
    super(e), this.message = e, this.code = t, this.data = r;
  }
}
const N = (a) => {
  var e, t;
  return a != null && a.androidBridge ? "android" : !((t = (e = a == null ? void 0 : a.webkit) === null || e === void 0 ? void 0 : e.messageHandlers) === null || t === void 0) && t.bridge ? "ios" : "web";
}, V = (a) => {
  const e = a.CapacitorCustomPlatform || null, t = a.Capacitor || {}, r = t.Plugins = t.Plugins || {}, i = () => e !== null ? e.name : N(a), s = () => i() !== "web", n = (c) => {
    const o = w.get(c);
    return !!(o != null && o.platforms.has(i()) || d(c));
  }, d = (c) => {
    var o;
    return (o = t.PluginHeaders) === null || o === void 0 ? void 0 : o.find((S) => S.name === c);
  }, u = (c) => a.console.error(c), w = /* @__PURE__ */ new Map(), O = (c, o = {}) => {
    const S = w.get(c);
    if (S)
      return console.warn(`Capacitor plugin "${c}" already registered. Cannot register plugins twice.`), S.proxy;
    const v = i(), C = d(c);
    let p;
    const B = async () => (!p && v in o ? p = typeof o[v] == "function" ? p = await o[v]() : p = o[v] : e !== null && !p && "web" in o && (p = typeof o.web == "function" ? p = await o.web() : p = o.web), p), Y = (l, y) => {
      var f, b;
      if (C) {
        const D = C == null ? void 0 : C.methods.find((g) => y === g.name);
        if (D)
          return D.rtype === "promise" ? (g) => t.nativePromise(c, y.toString(), g) : (g, I) => t.nativeCallback(c, y.toString(), g, I);
        if (l)
          return (f = l[y]) === null || f === void 0 ? void 0 : f.bind(l);
      } else {
        if (l)
          return (b = l[y]) === null || b === void 0 ? void 0 : b.bind(l);
        throw new F(`"${c}" plugin is not implemented on ${v}`, A.Unimplemented);
      }
    }, U = (l) => {
      let y;
      const f = (...b) => {
        const D = B().then((g) => {
          const I = Y(g, l);
          if (I) {
            const R = I(...b);
            return y = R == null ? void 0 : R.remove, R;
          } else
            throw new F(`"${c}.${l}()" is not implemented on ${v}`, A.Unimplemented);
        });
        return l === "addListener" && (D.remove = async () => y()), D;
      };
      return f.toString = () => `${l.toString()}() { [capacitor code] }`, Object.defineProperty(f, "name", {
        value: l,
        writable: !1,
        configurable: !1
      }), f;
    }, _ = U("addListener"), W = U("removeListener"), z = (l, y) => {
      const f = _({ eventName: l }, y), b = async () => {
        const g = await f;
        W({
          eventName: l,
          callbackId: g
        }, y);
      }, D = new Promise((g) => f.then(() => g({ remove: b })));
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
            return C ? z : _;
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
      platforms: /* @__PURE__ */ new Set([...Object.keys(o), ...C ? [v] : []])
    }), $;
  };
  return t.convertFileSrc || (t.convertFileSrc = (c) => c), t.getPlatform = i, t.handleError = u, t.isNativePlatform = s, t.isPluginAvailable = n, t.registerPlugin = O, t.Exception = F, t.DEBUG = !!t.DEBUG, t.isLoggingEnabled = !!t.isLoggingEnabled, t;
}, J = (a) => a.Capacitor = V(a), M = /* @__PURE__ */ J(typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {}), x = M.registerPlugin;
class G {
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
    const i = this.listeners[e];
    if (!i) {
      if (r) {
        let s = this.retainedEventArguments[e];
        s || (s = []), s.push(t), this.retainedEventArguments[e] = s;
      }
      return;
    }
    i.forEach((s) => s(t));
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
    return new M.Exception(e, A.Unimplemented);
  }
  unavailable(e = "not available") {
    return new M.Exception(e, A.Unavailable);
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
const H = (a) => encodeURIComponent(a).replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent).replace(/[()]/g, escape), K = (a) => a.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent);
class X extends G {
  async getCookies() {
    const e = document.cookie, t = {};
    return e.split(";").forEach((r) => {
      if (r.length <= 0)
        return;
      let [i, s] = r.replace(/=/, "CAP_COOKIE").split("CAP_COOKIE");
      i = K(i).trim(), s = K(s).trim(), t[i] = s;
    }), t;
  }
  async setCookie(e) {
    try {
      const t = H(e.key), r = H(e.value), i = `; expires=${(e.expires || "").replace("expires=", "")}`, s = (e.path || "/").replace("path=", ""), n = e.url != null && e.url.length > 0 ? `domain=${e.url}` : "";
      document.cookie = `${t}=${r || ""}${i}; path=${s}; ${n};`;
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
const Q = async (a) => new Promise((e, t) => {
  const r = new FileReader();
  r.onload = () => {
    const i = r.result;
    e(i.indexOf(",") >= 0 ? i.split(",")[1] : i);
  }, r.onerror = (i) => t(i), r.readAsDataURL(a);
}), Z = (a = {}) => {
  const e = Object.keys(a);
  return Object.keys(a).map((i) => i.toLocaleLowerCase()).reduce((i, s, n) => (i[s] = a[e[n]], i), {});
}, ee = (a, e = !0) => a ? Object.entries(a).reduce((r, i) => {
  const [s, n] = i;
  let d, u;
  return Array.isArray(n) ? (u = "", n.forEach((w) => {
    d = e ? encodeURIComponent(w) : w, u += `${s}=${d}&`;
  }), u.slice(0, -1)) : (d = e ? encodeURIComponent(n) : n, u = `${s}=${d}`), `${r}&${u}`;
}, "").substr(1) : null, te = (a, e = {}) => {
  const t = Object.assign({ method: a.method || "GET", headers: a.headers }, e), i = Z(a.headers)["content-type"] || "";
  if (typeof a.data == "string")
    t.body = a.data;
  else if (i.includes("application/x-www-form-urlencoded")) {
    const s = new URLSearchParams();
    for (const [n, d] of Object.entries(a.data || {}))
      s.set(n, d);
    t.body = s.toString();
  } else if (i.includes("multipart/form-data") || a.data instanceof FormData) {
    const s = new FormData();
    if (a.data instanceof FormData)
      a.data.forEach((d, u) => {
        s.append(u, d);
      });
    else
      for (const d of Object.keys(a.data))
        s.append(d, a.data[d]);
    t.body = s;
    const n = new Headers(t.headers);
    n.delete("content-type"), t.headers = n;
  } else (i.includes("application/json") || typeof a.data == "object") && (t.body = JSON.stringify(a.data));
  return t;
};
class re extends G {
  /**
   * Perform an Http request given a set of options
   * @param options Options to build the HTTP request
   */
  async request(e) {
    const t = te(e, e.webFetchExtra), r = ee(e.params, e.shouldEncodeUrlParams), i = r ? `${e.url}?${r}` : e.url, s = await fetch(i, t), n = s.headers.get("content-type") || "";
    let { responseType: d = "text" } = s.ok ? e : {};
    n.includes("application/json") && (d = "json");
    let u, w;
    switch (d) {
      case "arraybuffer":
      case "blob":
        w = await s.blob(), u = await Q(w);
        break;
      case "json":
        u = await s.json();
        break;
      case "document":
      case "text":
      default:
        u = await s.text();
    }
    const O = {};
    return s.headers.forEach((c, o) => {
      O[o] = c;
    }), {
      data: u,
      headers: O,
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
x("CapacitorHttp", {
  web: () => new re()
});
const k = x("KeepAwake", {
  web: () => import("./web-CL1un26V.js").then((a) => new a.KeepAwakeWeb())
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
const j = x("Network", {
  web: () => import("./web-h4REhjnU.js").then((a) => new a.NetworkWeb())
});
class oe {
  /**
   * Check if the device is connected to the network
   * @returns True if the device is connected to the network, false otherwise
   */
  static async isConnected() {
    return await j.getStatus().then((e) => e.connected);
  }
  /**
   * Get the type of connection the device is using
   * ConnectionType is one of 'wifi', 'cellular', 'none', 'unknown'
   * @returns The type of connection the device is using
   */
  static async getConnectionType() {
    return await j.getStatus().then((e) => e.connectionType);
  }
  /**
   * Get the status of the network connection
   * ConnectionStatus is an object with the following properties:
   * - connected: boolean
   * - connectionType: ConnectionType
   * @returns The status of the network connection
   */
  static async getStatus() {
    return await j.getStatus();
  }
}
const L = class L {
  static getCapacitorDirectory(e) {
    const t = e || this.defaultDirectory;
    return this.DIRECTORY_MAP[t];
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
    const t = this.getCapacitorDirectory(e.directory), r = e.encoding ? this.ENCODING_MAP[e.encoding] : void 0, i = await h.readFile({
      path: e.path,
      directory: t,
      encoding: r
    });
    return typeof i.data == "string" ? i.data : await i.data.text();
  }
  /**
   * Write data to a file, creating parent directories when needed.
   */
  static async writeFile(e) {
    const t = this.getCapacitorDirectory(e.directory), r = e.encoding ? this.ENCODING_MAP[e.encoding] : void 0;
    return (await h.writeFile({
      path: e.path,
      data: e.data,
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
    const t = this.getCapacitorDirectory(e.directory), r = e.encoding ? this.ENCODING_MAP[e.encoding] : void 0;
    return await h.appendFile({
      path: e.path,
      data: e.data,
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
    })).files.map((i) => ({
      name: i.name,
      uri: i.uri,
      isDirectory: i.type === "directory",
      size: i.size
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
    const t = this.getCapacitorDirectory(e.directory), r = this.getCapacitorDirectory(e.toDirectory), i = this.DIRECTORY_MAP[t], s = this.getCapacitorDirectory(r);
    return (await h.copy({
      from: e.from,
      to: e.to,
      directory: i,
      toDirectory: s
    })).uri;
  }
  /**
   * Move or rename a file or directory.
   */
  static async rename(e) {
    const t = this.getCapacitorDirectory(e.directory), r = this.getCapacitorDirectory(e.toDirectory), i = this.DIRECTORY_MAP[t], s = this.getCapacitorDirectory(r);
    return await h.rename({
      from: e.from,
      to: e.to,
      directory: i,
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
  DOCUMENTS: m.Documents,
  DATA: m.Data,
  LIBRARY: m.Library,
  CACHE: m.Cache,
  EXTERNAL: m.External,
  EXTERNAL_STORAGE: m.ExternalStorage,
  EXTERNAL_CACHE: m.ExternalCache,
  LIBRARY_NO_CLOUD: m.Library,
  TEMPORARY: m.Cache
}, L.ENCODING_MAP = {
  utf8: T.UTF8,
  ascii: T.ASCII,
  utf16: T.UTF16,
  base64: T.UTF8
  // Capacitor doesn't have base64, use UTF8 as fallback
};
let q = L;
export {
  ce as D,
  q as F,
  oe as N,
  ne as S,
  G as W
};
//# sourceMappingURL=index-wIBPXFve.js.map
