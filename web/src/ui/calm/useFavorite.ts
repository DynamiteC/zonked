import { useCallback, useEffect, useState } from 'react';
import { NO_FAVORITES, isFavorite, parseFavorites, toggleFavorite } from '../../app/favorites';
import type { Favorites } from '../../app/favorites';
import type { Store } from '../../storage/db';

/** Heart for one template, kept in the same favorites record Studio uses. */
export function useFavorite(store: Store, id: string | null): { readonly on: boolean; readonly toggle: () => void } {
  const [favs, setFavs] = useState<Favorites>(NO_FAVORITES);
  useEffect(() => {
    let live = true;
    store.getRecord('favorites').then((r) => live && setFavs(parseFavorites(r, Date.now()))).catch(() => undefined);
    return () => {
      live = false;
    };
  }, [store]);
  const toggle = useCallback(() => {
    if (id === null) return;
    const next = toggleFavorite(favs, 'template', id, Date.now());
    setFavs(next);
    store.setRecord('favorites', next).catch(() => undefined);
  }, [favs, id, store]);
  return { on: id !== null && isFavorite(favs, 'template', id), toggle };
}
