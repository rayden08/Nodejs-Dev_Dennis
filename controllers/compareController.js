const itemModel = require('../models/ItemModel');

// POST /api/compare
// body: { input1, input2, type: 'sensitive'|'non-sensitive' }
function compare(req, res) {
  const { input1, input2, type } = req.body || {};
  if (typeof input1 !== 'string' || typeof input2 !== 'string') {
    return res.status(400).json({ error: 'input1 and input2 must be strings' });
  }

  const sensitive = type === 'sensitive';

  // Use nested loop + nested if to count how many characters from input1 appear in input2
  const chars = input1.split('');
  let matchCount = 0;

  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    let found = false;
    for (let j = 0; j < input2.length; j++) {
      const target = input2[j];
      if (sensitive) {
        if (ch === target) {
          found = true;
          break;
        }
      } else {
        if (String(ch).toLowerCase() === String(target).toLowerCase()) {
          found = true;
          break;
        }
      }
    }
    if (found) matchCount++;
  }

  const percent = Math.round((matchCount / chars.length) * 100);

  // also show breakdown across seeded items (example of using ItemModel method)
  const perItem = itemModel.findCharsInAllContent(chars, sensitive);

  res.json({ input1, input2, type: sensitive ? 'sensitive' : 'non-sensitive', matchCount, total: chars.length, percent, perItem });
}

module.exports = { compare };
