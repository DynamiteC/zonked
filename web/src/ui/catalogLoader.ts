type CatalogModule = typeof import('../catalog');

let cache: Promise<CatalogModule> | undefined;

/** Loads the catalog chunk once, on demand. Keeps the 210+ template data out of the first load. */
export function loadCatalog(): Promise<CatalogModule> {
  cache ??= import('../catalog');
  return cache;
}
