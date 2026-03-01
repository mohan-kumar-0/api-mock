/**
 * api-mock
 * Simple and powerful API mocking middleware for Express.
 */

module.exports = function apiMocker(config = {}) {
    const {
        delay = 0,
        endpoints = {},
        verbose = false
    } = config;

    return (req, res, next) => {
        const path = req.path;
        const method = req.method.toLowerCase();
        const endpoint = endpoints[path];

        if (endpoint) {
            const response = endpoint[method] || endpoint['default'];

            if (response) {
                if (verbose) console.log(`[Mocker] Matching ${method.toUpperCase()} ${path}`);

                const sendResponse = () => {
                    const status = response.status || 200;
                    const body = typeof response.body === 'function' ? response.body(req) : response.body;
                    res.status(status).json(body);
                };

                const currentDelay = response.delay !== undefined ? response.delay : delay;

                if (currentDelay > 0) {
                    return setTimeout(sendResponse, currentDelay);
                }
                return sendResponse();
            }
        }

        next();
    };
};
