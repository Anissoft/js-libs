const Level = {
  'verbose': 4,
  'info': 3,
  'warning': 2,
  'error': 1,
  'silent': 0,
}

const originalMethods = {
  log: console.log,
  debug: console.debug,
  info: console.info,
  warn: console.warn,
  error: console.error,
}

export const logs: {
  level: keyof typeof Level;
  '@timestamp': number;
  message: string;
  data: string[];
  stack: string;
}[] = []

let LEVEL = Level.verbose;

export function setLevel(level: keyof typeof Level) {
  if (Object.keys(Level).includes(level)) {
    LEVEL = Level[level];
  } else {
    throw new Error(`Invalid value for level: ${level}`)
  }
}

export function clearLogs() {
  console.clear();
  logs.forEach((item, index) => {
    delete logs[logs.length - 1 - index];
  });
  logs.length = 0;
}

function prepeareLog(message: any, ...optionalParams: any[]) {
  return {
    '@timestamp': Date.now(),
    message: typeof message !== 'string' ? JSON.stringify(message) : message,
    data: optionalParams.map(item => typeof item !== 'string' ? JSON.stringify(item) : item),
    stack: (new Error().stack?.split(/\n/).filter((row, index) => index !== 1 && index !== 2).join('') || ''),
  }
}

console.debug = (message: any, ...optionalParams: any[]): void => {
  if (LEVEL >= Level.verbose) {
    originalMethods.debug(message, ...optionalParams)
  }
  try {
    logs.push({ level: 'verbose', ...prepeareLog(message, ...optionalParams) });
  } catch (error) {
    //
  }
}

console.log = (message: any, ...optionalParams: any[]): void => {
  if (LEVEL >= Level.info) {
    originalMethods.log(message, ...optionalParams)
  }
  try {
    logs.push({ level: 'info', ...prepeareLog(message, ...optionalParams) });
  } catch (error) {
    //
  }
}

console.info = (message: any, ...optionalParams: any[]): void => {
  if (LEVEL >= Level.info) {
    originalMethods.info(message, ...optionalParams)
  }
  try {
    logs.push({ level: 'info', ...prepeareLog(message, ...optionalParams) });
  } catch (error) {
    //
  }
}

console.warn = (message: any, ...optionalParams: any[]): void => {
  if (LEVEL >= Level.warning) {
    originalMethods.warn(message, ...optionalParams)
  }
  try {
    logs.push({ level: 'warning', ...prepeareLog(message, ...optionalParams) });
  } catch (error) {
    //
  }
}

console.error = (error: any, ...optionalParams: any[]): void => {
  if (LEVEL >= Level.error) {
    originalMethods.error(error, ...optionalParams)
  }
  try {
    const preparedLog = prepeareLog(error, ...optionalParams);
    if (error instanceof Error) {
      logs.push({
        level: 'error',
        ...preparedLog,
        message: `${error.name}: ${error.message}`,
        stack: error.stack || preparedLog.stack,
      });
    } else {
      logs.push({ level: 'error', ...preparedLog });
    }
  } catch (error) {
    //
  }
}

window.onunhandledrejection = event => {
  console.error(event);
  // console.warn(`UNHANDLED PROMISE REJECTION: ${event.reason}`);
};

window.onerror = function (message, source, lineNumber, colno, error) {
  console.error(error || { message, source, lineNumber, colno });
};