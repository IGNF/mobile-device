# @ign/mobile-device

Couche appareil partagée par les applications Capacitor de l'IGN. Le paquet enveloppe les plugins natifs les plus courants derrière des classes statiques, pour que chaque application appelle les mêmes méthodes typées au lieu de répéter la glue Capacitor (enums, sérialisation, permissions, listeners).

L'API publique couvre quatre sujets :

- **Device** — identité de l'appareil, plateforme, maintien de l'écran allumé
- **Network** — état de la connexion et écoute des changements
- **Storage** — préférences clé-valeur, avec des types autres que la chaîne
- **FileSystem** — lecture, écriture et gestion de fichiers, avec des répertoires nommés par des chaînes

Point d'entrée : `@ign/mobile-device` (ESM, déclarations TypeScript incluses). Capacitor 8.

## Installation

Le paquet n'est pas publié sur le registre npm. `@ign/mobile-device` est le nom d'import, résolu depuis le dépôt Git `IGNF/mobile-device`. C'est ainsi que les applications l'installent, par exemple Espace collaboratif :

```bash
npm install https://github.com/IGNF/mobile-device.git#main
npx cap sync
```

Dans `package.json` :

```json
"@ign/mobile-device": "https://github.com/IGNF/mobile-device.git#main"
```

`#main` suit la branche. Pour figer une version, remplacez-la par un tag ou un commit. Le dépôt doit être accessible avec vos identifiants GitHub (le lockfile des applications résout souvent l'URL en `git+ssh://git@github.com/IGNF/mobile-device.git`).

Le build (`dist/`) est versionné : l'application consomme le bundle et les déclarations sans recompiler le paquet.

Les plugins natifs suivent avec le paquet :

| Plugin | Usage |
| --- | --- |
| `@capacitor/device` | identité et plateforme |
| `@capacitor-community/keep-awake` | écran maintenu allumé |
| `@capacitor/network` | connectivité |
| `@capacitor/preferences` | stockage clé-valeur |
| `@capacitor/filesystem` | fichiers |

`npx cap sync` enregistre ces plugins dans les projets iOS et Android de l'application hôte.

## Import

```ts
import { Device, Network, Storage, FileSystem } from '@ign/mobile-device';
```

Les méthodes sont asynchrones, sauf `FileSystem.isLocalFile`, `getFileName` et `getFileExtension`. Les erreurs Capacitor (fichier absent, permission refusée, plugin indisponible) remontent à l'appelant.

## Device

```ts
const id = await Device.getDeviceId();
const info = await Device.getDeviceInfo();

if (await Device.isDeviceIOS()) {
  // branche iOS
}

await Device.keepAwake();
const awake = await Device.isKeptAwake();
await Device.allowSleep();
```

| Méthode | Rôle |
| --- | --- |
| `getDeviceId()` | Identifiant de l'appareil |
| `getDeviceInfo()` | Fiche Capacitor `DeviceInfo` (plateforme, modèle, OS, appareil virtuel, etc.) |
| `isDeviceMobile()` | `true` sur iOS et Android |
| `isDeviceIOS()` | `true` sur iOS |
| `isDeviceAndroid()` | `true` sur Android |
| `isDeviceEmulator()` | `true` sur un émulateur ou un simulateur |
| `keepAwake()` | Empêche la mise en veille de l'écran lorsque le plugin est supporté |
| `allowSleep()` | Autorise à nouveau la mise en veille |
| `isKeptAwake()` | Indique si l'écran est maintenu allumé |

Sur le web, Keep Awake n'est en général pas supporté : `keepAwake` et `allowSleep` se terminent alors sans effet.

## Network

```ts
const online = await Network.isConnected();
const type = await Network.getConnectionType(); // 'wifi' | 'cellular' | 'none' | 'unknown'
const status = await Network.getStatus();       // { connected, connectionType }

const listener = await Network.watch((status) => {
  console.log(status.connected, status.connectionType);
});

await Network.unwatch(listener);
```

Conservez le handle renvoyé par `watch` et passez-le à `unwatch` quand l'écoute n'a plus lieu d'être (fermeture d'un écran, arrêt d'un service).

## Storage

Préférences persistantes. Capacitor Preferences ne conserve que des chaînes ; `Storage` sérialise les booléens, nombres, dates, tableaux et objets.

```ts
await Storage.set('lastSync', new Date());
await Storage.set('offline', true);
await Storage.set('profile', { name: 'Ada' });

const lastSync = await Storage.get('lastSync', 'date');    // Date | null
const offline = await Storage.get('offline', 'boolean');   // boolean | null
const profile = await Storage.get('profile', 'object');    // objet | null

const exists = await Storage.has('profile');
const keys = await Storage.keys();

await Storage.remove('offline');
await Storage.clear();
```

À l'écriture, le type est détecté tout seul (`string`, `boolean`, `number`, `date`, `array`, `object`). On peut aussi le passer explicitement en troisième argument.

À la lecture, passez le même type pour récupérer une valeur désérialisée. Sans type, `get` renvoie la chaîne brute. Une clé absente renvoie `null`. Un JSON illisible pour `array` ou `object` renvoie `null`.

Les dates sont stockées en ISO 8601. Les tableaux et les objets passent par `JSON.stringify` / `JSON.parse`.

`clear()` efface **toutes** les préférences de l'application, y compris celles écrites en dehors de cette classe.

## FileSystem

Lecture, écriture, copie et parcours de fichiers. Les répertoires sont des chaînes (`'DATA'`, `'CACHE'`, …). Si `directory` est omis, c'est `FileSystem.defaultDirectory` qui s'applique (`'DATA'` par défaut ; l'application peut le réassigner).

```ts
await FileSystem.writeFile({
  path: 'notes/brouillon.txt',
  data: 'Bonjour',
  encoding: 'utf8',
  recursive: true,
});

const text = await FileSystem.readFile({
  path: 'notes/brouillon.txt',
  encoding: 'utf8',
});

await FileSystem.appendFile({
  path: 'notes/brouillon.txt',
  data: '\nSuite',
  encoding: 'utf8',
});

const entries = await FileSystem.listDirectory({ path: 'notes' });
const meta = await FileSystem.stat({ path: 'notes/brouillon.txt' });
const uri = await FileSystem.getUri({ path: 'notes/brouillon.txt' });

await FileSystem.copy({ from: 'notes/brouillon.txt', to: 'notes/copie.txt' });
await FileSystem.rename({ from: 'notes/copie.txt', to: 'notes/archive.txt' });

await FileSystem.deleteFile({ path: 'notes/archive.txt' });
await FileSystem.removeDirectory({ path: 'notes', recursive: true });
```

Binaire, via un `Blob` ou une chaîne base64. Un préfixe data URL (`data:image/png;base64,...`) est retiré à l'écriture et à la lecture.

```ts
await FileSystem.writeFile({
  path: 'photos/carte.png',
  data: blob,
  encoding: 'base64',
  directory: 'CACHE',
});

const base64 = await FileSystem.readFile({
  path: 'photos/carte.png',
  encoding: 'base64',
  directory: 'CACHE',
});
```

### Méthodes

| Méthode | Retour | Rôle |
| --- | --- | --- |
| `readFile` | `string` | Contenu texte ou base64 |
| `writeFile` | URI | Écrit le fichier ; `recursive` crée les dossiers parents |
| `appendFile` | `true` | Ajoute des données, en créant le fichier s'il manque |
| `deleteFile` | `true` | Supprime un fichier |
| `stat` | métadonnées | Nom, URI, taille, dates, fichier ou dossier |
| `getUri` | URI | URI Capacitor du chemin |
| `listDirectory` | entrées | Nom, URI, dossier ou fichier, taille |
| `createDirectory` | `true` | Crée un dossier ; `recursive` crée les parents |
| `removeDirectory` | `true` | Supprime un dossier ; `recursive` vide le contenu |
| `copy` | URI | Copie un fichier ou un dossier (`directory`, `toDirectory`) |
| `rename` | URI | Déplace ou renomme (`directory`, `toDirectory`) |
| `checkPermissions` | `boolean` | Stockage public Android déjà accordé |
| `requestPermissions` | `boolean` | Demande le stockage public Android |
| `isLocalFile` | `boolean` | `file://`, `content://`, `capacitor://`, ou chemin sans schéma `http(s)` |
| `getFileName` | `string` | Dernier segment du chemin |
| `getFileExtension` | `string` | Extension sans le point, ou `''` |

Encodages : `utf8`, `ascii`, `utf16`, `base64`.

### Répertoires

| Valeur | Dossier Capacitor |
| --- | --- |
| `DOCUMENTS` | Documents |
| `DATA` | Data (défaut) |
| `LIBRARY` | Library |
| `LIBRARY_NO_CLOUD` | Library |
| `CACHE` | Cache |
| `TEMPORARY` | Cache |
| `EXTERNAL` | External (Android) |
| `EXTERNAL_STORAGE` | ExternalStorage (Android) |
| `EXTERNAL_CACHE` | ExternalCache (Android) |

`checkPermissions` et `requestPermissions` portent sur le stockage public Android (`publicStorage`). Sur iOS, l'API Filesystem exige le Privacy Manifest Apple : voir la [documentation Capacitor Filesystem](https://capacitorjs.com/docs/apis/filesystem).

Les types d'options (`FileSystemWriteOptions`, `FileSystemDirectory`, `FileEncoding`, etc.) sont exportés par le paquet.

## Développement

```bash
npm run dev        # build Vite en watch
npm run build      # déclarations TypeScript, puis bundle
npm run typecheck  # vérification des types, sans émission
npm run clean      # supprime dist/
```

Le code source vit dans `src/`. Chaque capacité a son dossier (`device/`, `network/`, `storage/`, `filesystem/`). Les nouveaux exports passent par `src/index.ts`. Le paquet publié ne contient que `dist/`.