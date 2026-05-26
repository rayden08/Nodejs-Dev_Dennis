class BaseModel {
  constructor() {
    this.data = [];
    this.nextId = 1;
  }

  create(obj) {
    obj.id = this.nextId++;
    this.data.push(obj);
    return obj;
  }

  findAll() {
    return this.data.slice();
  }

  findById(id) {
    return this.data.find((d) => d.id === Number(id)) || null;
  }

  update(id, attrs) {
    const item = this.findById(id);
    if (!item) return null;
    // shallow merge
    Object.assign(item, attrs);
    return item;
  }

  remove(id) {
    const idx = this.data.findIndex((d) => d.id === Number(id));
    if (idx === -1) return false;
    this.data.splice(idx, 1);
    return true;
  }
}

module.exports = BaseModel;
