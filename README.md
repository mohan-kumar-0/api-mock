# api-mock

Powerful Express middleware to mock APIs with dynamic responses and latency simulation.

## 🚀 Installation

```bash
npm install api-mock
```

## 📖 Usage

```javascript
const express = require('express');
const apiMock = require('api-mock');

const app = express();
app.use(apiMock({ endpoints: { '/api/test': { get: { body: { ok: true } } } } }));
```

## ⚖️ License
MIT
