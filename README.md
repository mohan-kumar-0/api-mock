# express-api-mockr

Powerful Express middleware to mock REST APIs with dynamic responses, per-route latency simulation, and request-aware body generation. Perfect for frontend development without a real backend.

[![npm version](https://img.shields.io/npm/v/express-api-mockr.svg)](https://www.npmjs.com/package/express-api-mockr)
[![license](https://img.shields.io/npm/l/express-api-mockr.svg)](https://github.com/mohan-kumar-0/api-mock/blob/main/LICENSE)

---

## Features

- **Route-Based Mocking** -- Define responses by URL path and HTTP method (GET, POST, PUT, DELETE).
- **Dynamic Responses** -- Use functions to generate responses based on the incoming request object.
- **Latency Simulation** -- Add global or per-route delays to simulate real network latency.
- **Status Codes** -- Return any HTTP status code per route.
- **Verbose Logging** -- Optional console logging of matched routes for debugging.
- **Express Native** -- Drop-in middleware compatible with Express 4 and 5.

---

## Installation

```bash
npm install express-api-mockr
```

---

## Usage

### Basic Setup

```javascript
const express = require('express');
const apiMock = require('express-api-mockr');

const app = express();
app.use(express.json());

app.use(apiMock({
  endpoints: {
    '/api/users': {
      get: {
        status: 200,
        body: [
          { id: 1, name: 'Alice', role: 'Admin' },
          { id: 2, name: 'Bob', role: 'User' },
          { id: 3, name: 'Charlie', role: 'Editor' }
        ]
      }
    }
  }
}));

app.listen(3000, () => {
  console.log('Mock server running on http://localhost:3000');
});
```

### Dynamic Responses

Use a function for the `body` property to generate responses based on the request.

```javascript
app.use(apiMock({
  endpoints: {
    '/api/users': {
      post: {
        status: 201,
        body: (req) => ({
          id: Math.floor(Math.random() * 10000),
          name: req.body.name,
          email: req.body.email,
          createdAt: new Date().toISOString()
        })
      }
    },
    '/api/search': {
      get: {
        body: (req) => ({
          query: req.query.q,
          results: [],
          timestamp: Date.now()
        })
      }
    }
  }
}));
```

### Simulating Latency

```javascript
app.use(apiMock({
  delay: 500, // Global 500ms delay for all routes
  endpoints: {
    '/api/fast': {
      get: {
        delay: 0, // Override: no delay for this route
        body: { message: 'instant response' }
      }
    },
    '/api/slow': {
      get: {
        delay: 3000, // Override: 3 second delay for this route
        body: { message: 'slow response' }
      }
    }
  }
}));
```

### Error Simulation

```javascript
app.use(apiMock({
  endpoints: {
    '/api/protected': {
      get: {
        status: 401,
        body: { error: 'Unauthorized', message: 'Token required' }
      }
    },
    '/api/broken': {
      default: {
        status: 500,
        body: { error: 'Internal Server Error' }
      }
    }
  }
}));
```

### Verbose Logging

```javascript
app.use(apiMock({
  verbose: true, // Logs "[Mocker] Matching GET /api/users" to console
  endpoints: { /* ... */ }
}));
```

### Fallthrough Behavior

If a request does not match any defined endpoint, the middleware calls `next()` and passes control to the next middleware or route handler in the stack.

---

## API Reference

### `apiMock(config)`

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `endpoints` | `Object` | `{}` | Route definitions keyed by path |
| `delay` | `number` | `0` | Global delay in milliseconds |
| `verbose` | `boolean` | `false` | Log matched routes to console |

### Endpoint Definition

```javascript
{
  '/api/path': {
    get: { status: 200, body: { ... }, delay: 0 },
    post: { status: 201, body: (req) => ({ ... }) },
    default: { status: 404, body: { error: 'Not found' } }
  }
}
```

---

## License

MIT -- see [LICENSE](https://github.com/mohan-kumar-0/api-mock/blob/main/LICENSE) for details.

Made by [Mohan Kumar](https://kumarmohan.com)
