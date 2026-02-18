import { Preferences as E } from "@capacitor/preferences";
import { Device as P } from "@capacitor/device";
import { Directory as b, Encoding as $, Filesystem as h } from "@capacitor/filesystem";
class ne {
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
var k;
(function(i) {
  i.Unimplemented = "UNIMPLEMENTED", i.Unavailable = "UNAVAILABLE";
})(k || (k = {}));
class j extends Error {
  constructor(e, t, r) {
    super(e), this.message = e, this.code = t, this.data = r;
  }
}
const V = (i) => {
  var e, t;
  return i != null && i.androidBridge ? "android" : !((t = (e = i == null ? void 0 : i.webkit) === null || e === void 0 ? void 0 : e.messageHandlers) === null || t === void 0) && t.bridge ? "ios" : "web";
}, J = (i) => {
  const e = i.CapacitorCustomPlatform || null, t = i.Capacitor || {}, r = t.Plugins = t.Plugins || {}, a = () => e !== null ? e.name : V(i), s = () => a() !== "web", n = (c) => {
    const o = w.get(c);
    return !!(o != null && o.platforms.has(a()) || d(c));
  }, d = (c) => {
    var o;
    return (o = t.PluginHeaders) === null || o === void 0 ? void 0 : o.find((S) => S.name === c);
  }, u = (c) => i.console.error(c), w = /* @__PURE__ */ new Map(), O = (c, o = {}) => {
    const S = w.get(c);
    if (S)
      return console.warn(`Capacitor plugin "${c}" already registered. Cannot register plugins twice.`), S.proxy;
    const C = a(), v = d(c);
    let p;
    const z = async () => (!p && C in o ? p = typeof o[C] == "function" ? p = await o[C]() : p = o[C] : e !== null && !p && "web" in o && (p = typeof o.web == "function" ? p = await o.web() : p = o.web), p), Y = (l, y) => {
      var f, m;
      if (v) {
        const D = v == null ? void 0 : v.methods.find((g) => y === g.name);
        if (D)
          return D.rtype === "promise" ? (g) => t.nativePromise(c, y.toString(), g) : (g, x) => t.nativeCallback(c, y.toString(), g, x);
        if (l)
          return (f = l[y]) === null || f === void 0 ? void 0 : f.bind(l);
      } else {
        if (l)
          return (m = l[y]) === null || m === void 0 ? void 0 : m.bind(l);
        throw new j(`"${c}" plugin is not implemented on ${C}`, k.Unimplemented);
      }
    }, R = (l) => {
      let y;
      const f = (...m) => {
        const D = z().then((g) => {
          const x = Y(g, l);
          if (x) {
            const T = x(...m);
            return y = T == null ? void 0 : T.remove, T;
          } else
            throw new j(`"${c}.${l}()" is not implemented on ${C}`, k.Unimplemented);
        });
        return l === "addListener" && (D.remove = async () => y()), D;
      };
      return f.toString = () => `${l.toString()}() { [capacitor code] }`, Object.defineProperty(f, "name", {
        value: l,
        writable: !1,
        configurable: !1
      }), f;
    }, W = R("addListener"), _ = R("removeListener"), G = (l, y) => {
      const f = W({ eventName: l }, y), m = async () => {
        const g = await f;
        _({
          eventName: l,
          callbackId: g
        }, y);
      }, D = new Promise((g) => f.then(() => g({ remove: m })));
      return D.remove = async () => {
        console.warn("Using addListener() without 'await' is deprecated."), await m();
      }, D;
    }, I = new Proxy({}, {
      get(l, y) {
        switch (y) {
          case "$$typeof":
            return;
          case "toJSON":
            return () => ({});
          case "addListener":
            return v ? G : W;
          case "removeListener":
            return _;
          default:
            return R(y);
        }
      }
    });
    return r[c] = I, w.set(c, {
      name: c,
      proxy: I,
      platforms: /* @__PURE__ */ new Set([...Object.keys(o), ...v ? [C] : []])
    }), I;
  };
  return t.convertFileSrc || (t.convertFileSrc = (c) => c), t.getPlatform = a, t.handleError = u, t.isNativePlatform = s, t.isPluginAvailable = n, t.registerPlugin = O, t.Exception = j, t.DEBUG = !!t.DEBUG, t.isLoggingEnabled = !!t.isLoggingEnabled, t;
}, N = (i) => i.Capacitor = J(i), M = /* @__PURE__ */ N(typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {}), U = M.registerPlugin;
class q {
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
    return new M.Exception(e, k.Unimplemented);
  }
  unavailable(e = "not available") {
    return new M.Exception(e, k.Unavailable);
  }
  async removeListener(e, t) {
    const r = this.listeners[e];
    if (!r)
      return;
    const a = r.indexOf(t);
    this.listeners[e].splice(a, 1), this.listeners[e].length || this.removeWindowListener(this.windowListeners[e]);
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
const B = (i) => encodeURIComponent(i).replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent).replace(/[()]/g, escape), H = (i) => i.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent);
class X extends q {
  async getCookies() {
    const e = document.cookie, t = {};
    return e.split(";").forEach((r) => {
      if (r.length <= 0)
        return;
      let [a, s] = r.replace(/=/, "CAP_COOKIE").split("CAP_COOKIE");
      a = H(a).trim(), s = H(s).trim(), t[a] = s;
    }), t;
  }
  async setCookie(e) {
    try {
      const t = B(e.key), r = B(e.value), a = `; expires=${(e.expires || "").replace("expires=", "")}`, s = (e.path || "/").replace("path=", ""), n = e.url != null && e.url.length > 0 ? `domain=${e.url}` : "";
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
U("CapacitorCookies", {
  web: () => new X()
});
const Q = async (i) => new Promise((e, t) => {
  const r = new FileReader();
  r.onload = () => {
    const a = r.result;
    e(a.indexOf(",") >= 0 ? a.split(",")[1] : a);
  }, r.onerror = (a) => t(a), r.readAsDataURL(i);
}), Z = (i = {}) => {
  const e = Object.keys(i);
  return Object.keys(i).map((a) => a.toLocaleLowerCase()).reduce((a, s, n) => (a[s] = i[e[n]], a), {});
}, ee = (i, e = !0) => i ? Object.entries(i).reduce((r, a) => {
  const [s, n] = a;
  let d, u;
  return Array.isArray(n) ? (u = "", n.forEach((w) => {
    d = e ? encodeURIComponent(w) : w, u += `${s}=${d}&`;
  }), u.slice(0, -1)) : (d = e ? encodeURIComponent(n) : n, u = `${s}=${d}`), `${r}&${u}`;
}, "").substr(1) : null, te = (i, e = {}) => {
  const t = Object.assign({ method: i.method || "GET", headers: i.headers }, e), a = Z(i.headers)["content-type"] || "";
  if (typeof i.data == "string")
    t.body = i.data;
  else if (a.includes("application/x-www-form-urlencoded")) {
    const s = new URLSearchParams();
    for (const [n, d] of Object.entries(i.data || {}))
      s.set(n, d);
    t.body = s.toString();
  } else if (a.includes("multipart/form-data") || i.data instanceof FormData) {
    const s = new FormData();
    if (i.data instanceof FormData)
      i.data.forEach((d, u) => {
        s.append(u, d);
      });
    else
      for (const d of Object.keys(i.data))
        s.append(d, i.data[d]);
    t.body = s;
    const n = new Headers(t.headers);
    n.delete("content-type"), t.headers = n;
  } else (a.includes("application/json") || typeof i.data == "object") && (t.body = JSON.stringify(i.data));
  return t;
};
class re extends q {
  /**
   * Perform an Http request given a set of options
   * @param options Options to build the HTTP request
   */
  async request(e) {
    const t = te(e, e.webFetchExtra), r = ee(e.params, e.shouldEncodeUrlParams), a = r ? `${e.url}?${r}` : e.url, s = await fetch(a, t), n = s.headers.get("content-type") || "";
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
U("CapacitorHttp", {
  web: () => new re()
});
const A = U("KeepAwake", {
  web: () => import("./web-CfzQdCT7.js").then((i) => new i.KeepAwakeWeb())
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
    await A.isSupported().then(async (e) => {
      e && await A.keepAwake();
    });
  }
  /**
   * Allow the screen to sleep
   * Used to allow the screen to dim or turn off
   */
  static async allowSleep() {
    await A.isSupported().then(async (e) => {
      e && await A.allowSleep();
    });
  }
  /**
   * Check if the screen is kept awake
   * @returns True if the screen is kept awake, false otherwise
   */
  static async isKeptAwake() {
    return await A.isKeptAwake().then((e) => e.isKeptAwake);
  }
}
const F = U("Network", {
  web: () => import("./web-E55ICfdi.js").then((i) => new i.NetworkWeb())
});
class oe {
  /**
   * Check if the device is connected to the network
   * @returns True if the device is connected to the network, false otherwise
   */
  static async isConnected() {
    return await F.getStatus().then((e) => e.connected);
  }
  /**
   * Get the type of connection the device is using
   * ConnectionType is one of 'wifi', 'cellular', 'none', 'unknown'
   * @returns The type of connection the device is using
   */
  static async getConnectionType() {
    return await F.getStatus().then((e) => e.connectionType);
  }
  /**
   * Get the status of the network connection
   * ConnectionStatus is an object with the following properties:
   * - connected: boolean
   * - connectionType: ConnectionType
   * @returns The status of the network connection
   */
  static async getStatus() {
    return await F.getStatus();
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
  DOCUMENTS: b.Documents,
  DATA: b.Data,
  LIBRARY: b.Library,
  CACHE: b.Cache,
  EXTERNAL: b.External,
  EXTERNAL_STORAGE: b.ExternalStorage,
  EXTERNAL_CACHE: b.ExternalCache,
  LIBRARY_NO_CLOUD: b.Library,
  TEMPORARY: b.Cache
}, L.ENCODING_MAP = {
  utf8: $.UTF8,
  ascii: $.ASCII,
  utf16: $.UTF16
};
let K = L;
export {
  ce as D,
  K as F,
  oe as N,
  ne as S,
  q as W
};
//# sourceMappingURL=index-ChCkp3hA.js.map
