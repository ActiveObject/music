import updateOn from 'app/fn/updateOn';

export default function updateOnKey(ComposedComponent, dbKey) {
  return updateOn(ComposedComponent, (db) => db.get(dbKey));
}