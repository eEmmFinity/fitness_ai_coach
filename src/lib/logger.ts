// Tiny structured logger. JSON in production (parse-friendly for log shippers),
// human-readable in dev. No deps. Replace with pino later if you want sampling/redaction.

type Level = 'debug' | 'info' | 'warn' | 'error';

const LEVELS: Record<Level, number> = { debug: 10, info: 20, warn: 30, error: 40 };
const MIN_LEVEL: Level = (process.env.LOG_LEVEL as Level) || 'info';
const isProd = process.env.NODE_ENV === 'production';

function emit(level: Level, msg: string, fields?: Record<string, unknown>) {
  if (LEVELS[level] < LEVELS[MIN_LEVEL]) return;

  const base = {
    level,
    time: new Date().toISOString(),
    msg,
    ...fields,
  };

  if (isProd) {
    const fn = level === 'error' || level === 'warn' ? console.error : console.log;
    fn(JSON.stringify(base));
    return;
  }

  const tag =
    level === 'error' ? '✖' : level === 'warn' ? '⚠' : level === 'info' ? '·' : '∙';
  // eslint-disable-next-line no-console
  console.log(`${tag} ${msg}`, fields ?? '');
}

export const log = {
  debug: (msg: string, fields?: Record<string, unknown>) => emit('debug', msg, fields),
  info: (msg: string, fields?: Record<string, unknown>) => emit('info', msg, fields),
  warn: (msg: string, fields?: Record<string, unknown>) => emit('warn', msg, fields),
  error: (msg: string, err?: unknown, fields?: Record<string, unknown>) => {
    const errFields =
      err instanceof Error
        ? { errName: err.name, errMsg: err.message, stack: isProd ? undefined : err.stack }
        : err !== undefined
        ? { err }
        : {};
    emit('error', msg, { ...fields, ...errFields });
  },
};
