const itemModel = require('../models/ItemModel');

function requireAuth(req) {
  const auth = req.headers.authorization || '';
  if (!auth.startsWith('Bearer ')) return false;
  const token = auth.slice(7);
  // accept any token that starts with token- for demo
  return token.startsWith('token-');
}

function list(req, res) {
  if (!requireAuth(req)) return res.status(401).json({ error: 'unauthorized' });
  res.json(itemModel.findAll());
}

function create(req, res) {
  if (!requireAuth(req)) return res.status(401).json({ error: 'unauthorized' });
  const { title, content } = req.body || {};
  if (!title) return res.status(400).json({ error: 'title required' });
  const item = itemModel.create({ title, content: content || '' });
  res.status(201).json(item);
}

function get(req, res) {
  if (!requireAuth(req)) return res.status(401).json({ error: 'unauthorized' });
  const item = itemModel.findById(req.params.id);
  if (!item) return res.status(404).json({ error: 'not found' });
  res.json(item);
}

function update(req, res) {
  if (!requireAuth(req)) return res.status(401).json({ error: 'unauthorized' });
  const item = itemModel.update(req.params.id, req.body || {});
  if (!item) return res.status(404).json({ error: 'not found' });
  res.json(item);
}

function remove(req, res) {
  if (!requireAuth(req)) return res.status(401).json({ error: 'unauthorized' });
  const ok = itemModel.remove(req.params.id);
  if (!ok) return res.status(404).json({ error: 'not found' });
  res.json({ success: true });
}

module.exports = { list, create, get, update, remove };
