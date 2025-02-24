const log = (level, message, ...args) => {
    const timestamp = new Date().toISOString();
    console[level](`[${timestamp}] ${message}`, ...args);
};

export const logInfo = (message, ...args) => {
    log('log', message, ...args);
};

export const logWarn = (message, ...args) => {
    log('warn', message, ...args);
};

export const logError = (message, ...args) => {
    log('error', message, ...args);
};
