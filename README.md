# Soal MVC App (JavaScript)

Simple Express-based MVC demo implementing the coding selection test requirements.

Features:
- MVC-like structure with models/controllers
- OOP classes with inheritance (`BaseModel` -> `ItemModel`, `UserModel`)
- CRUD operations for `items` (in-memory)
- Compare feature that counts matching characters (case-sensitive / non-sensitive)
- Demonstrates nested loops, nested ifs, and math in the comparison logic

Run locally:

1. Install dependencies:

```bash
npm install
```

2. Start server:

```bash
npm start
```

3. Open http://localhost:3000 in your browser.

Default login:
- username: admin
- password: secret123

Notes:
- This is a simple in-memory demo intended for the coding task. For production, persist data using a database and use proper auth/session handling.
