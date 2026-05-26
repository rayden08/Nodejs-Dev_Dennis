const BaseModel = require('./BaseModel');

class ItemModel extends BaseModel {
  constructor() {
    super();
    // seed with sample items
    this.create({ title: 'First item', content: 'Hello world' });
    this.create({ title: 'Second item', content: 'Another note' });
  }

  // Example method that uses nested loops and nested ifs
  findCharsInAllContent(chars, caseSensitive = true) {
    const results = [];
    // nested loop: for each item, check each char
    for (let item of this.data) {
      let foundCount = 0;
      for (let i = 0; i < chars.length; i++) {
        const ch = chars[i];
        // nested if: check case sensitivity and character presence
        if (caseSensitive) {
          if (item.content.indexOf(ch) !== -1) {
            foundCount++;
          }
        } else {
          if (item.content.toLowerCase().indexOf(String(ch).toLowerCase()) !== -1) {
            foundCount++;
          }
        }
      }
      // simple math to get percentage per item
      const pct = Math.round((foundCount / chars.length) * 100);
      results.push({ id: item.id, title: item.title, matchedPercent: pct });
    }
    return results;
  }
}

module.exports = new ItemModel();
