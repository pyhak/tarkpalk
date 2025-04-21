import type { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Express route handler wrapper, mis lubab kasutada async/await ilma try/catch korduseta.
 * Kõik visatud vead suunatakse Expressi error handlerisse.
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
): RequestHandler {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
}
