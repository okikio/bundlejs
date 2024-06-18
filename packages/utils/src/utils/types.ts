/** export interface representing the parsed package name and its components. */
export interface ParsedPackageName {
  name: string;
  version: string;
  path: string;
}

/** export interface representing the URLs generated for the npm registry. */
export interface RegistryURLs {
  searchURL: string;
  packageURL: string;
  packageVersionURL: string;
  version: string | null;
  name: string;
  path: string;
}

export interface PackageURLs {
  searchURL: string;
  packageURL: string;
  packageVersionURL: string;
  version: string;
  name: string;
  path: string;
}

export interface PackageSearchResult {
  packages: SearchObject[];
  info: SearchInfo;
}

export interface SearchPackage {
  name: string;
  scope: string;
  version: string;
  description: string;
  keywords: string[];
  date: string;
  links: Links;
  author: Author;
  publisher: Publisher;
  maintainers: Maintainer[];
}

export interface Links {
  npm: string;
  homepage: string;
  repository: string;
  bugs: string;
}

export interface Author {
  name: string;
  email?: string;
  url?: string;
}

export interface Publisher {
  username: string;
  email: string;
}

export interface Maintainer {
  username: string;
  email: string;
}

export interface SearchInfo {
  total: number;
  time: string;
  objects: SearchObject[];
}

export interface SearchObject {
  package: SearchPackage;
  flags: Flags;
  score: Score;
  searchScore: number;
}

export interface Flags {
  insecure: number;
}

export interface Score {
  final: number;
  detail: Detail;
}

export interface Detail {
  quality: number;
  popularity: number;
  maintenance: number;
}

export interface PackageInfo {
  versions: string[];
  tags: Record<string, string>;
}

export interface FullPackage {
  name: string;
  scope: string;
  version: string;
  description: string;
  keywords: string[];
  date: string;
  links: Links;
  author: Author;
  publisher: Publisher;
  maintainers: Maintainer[];
  versions: Record<string, FullPackageVersion>;
  "dist-tags": Record<string, string>;
}

export interface FullPackageVersion {
  name: string;
  version: string;
  type: string;
  sideEffects: boolean;
  description: string;
  publishConfig: {
    access: string;
    main: string;
    types: string;
    browser: string;
    module: string;
    exports: Record<string, Record<string, string> | string>;
  };
  main: string;
  directories: {
    lib: string;
  };
  repository: {
    type: string;
    url: string;
  };
  keywords: string[];
  author: Author;
  license: string;
  bugs: {
    url: string;
  };
  homepage: string;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  gitHead: string;
  scripts: Record<string, string>;
  types: string;
  browser: string;
  module: string;
  exports: Record<string, Record<string, string> | string>;
  _id: string;
  _nodeVersion: string;
  _npmVersion: string;
  dist: {
    integrity: string;
    shasum: string;
    tarball: string;
    fileCount: number;
    unpackedSize: number;
    "npm-signature": string;
    signatures: {
      keyid: string;
      sig: string;
    }[];
  };
  _npmUser: {
    name: string;
    email: string;
  };
  maintainers: {
    name: string;
    email: string;
  }[];
  _npmOperationalInternal: {
    host: string;
    tmp: string;
  };
  _hasShrinkwrap: boolean;
}