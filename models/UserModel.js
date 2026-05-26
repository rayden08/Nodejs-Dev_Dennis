const BaseModel = require('./BaseModel');

class UserModel extends BaseModel {
  constructor() {
    super();
    // seed a default user (username: admin, password: secret123)
    this.create({ username: 'admin', password: 'secret123', displayName: 'Administrator' });
  }

  findByUsername(username) {
    return this.data.find((u) => u.username === username) || null;
  }
}

module.exports = new UserModel();
