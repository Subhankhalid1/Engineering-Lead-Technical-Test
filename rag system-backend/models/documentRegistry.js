class DocumentRegistry {
  constructor() {
    this.documents = new Map();
  }

  register(id, meta) {
    this.documents.set(id, { id, ...meta });
  }

  get(id) {
    return this.documents.get(id) || null;
  }

  list() {
    return Array.from(this.documents.values());
  }

  remove(id) {
    return this.documents.delete(id);
  }

  has(id) {
    return this.documents.has(id);
  }
}

export default new DocumentRegistry();
