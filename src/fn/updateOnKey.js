import updateOn from 'app/fn/updateOn';

export default function updateOnKey(ComposedComponent, dbKey) {
  return updateOn(ComposedComponent, function (prevDb, nextDb) {
    if (Array.isArray(dbKey)) {
      return dbKey.every(function (key) {
        return prevDb.get(key) === nextDb.get(key);
      });
    }

    if (typeof dbKey === 'function') {
      return dbKey(prevDb) === dbKey(nextDb);
    }

    return prevDb.get(dbKey) === nextDb.get(dbKey);
  });
}