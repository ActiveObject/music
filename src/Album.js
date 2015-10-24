export function fromVk(data) {
  return {
    id: String(data.id),
    owner: data.owner_id,
    title: data.title
  };
}
