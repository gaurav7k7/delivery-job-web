import { ZodError } from 'zod';
import { ApiError } from '../utils/ApiError.js';

/**
 * Validates { body, query, params } against a Zod schema. Only `body` and
 * `params` are written back to `req` — Express 5 made `req.query` a read-only
 * getter, so query values are validated for shape/type but consumed from the
 * original `req.query` by downstream code (e.g. pagination.util.js).
 */
export function validate(schema) {
  return (req, res, next) => {
    try {
      const parsed = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      if (parsed.body !== undefined) req.body = parsed.body;
      if (parsed.params !== undefined) req.params = parsed.params;
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const fieldErrors = {};
        for (const issue of err.issues) {
          fieldErrors[issue.path.join('.') || '_'] = issue.message;
        }
        return next(ApiError.unprocessable('Validation failed', fieldErrors));
      }
      next(err);
    }
  };
}
