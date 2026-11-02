export function notFound(req, res) { res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'The requested resource was not found.' } }); }
export function errorHandler(error, req, res, _next) {
  req.log?.error({ err: error }, 'Request failed');
  if (error.code === 11000) return res.status(409).json({ success: false, error: { code: 'ACCUSATION_EXISTS', message: 'A final accusation has already been submitted.' } });
  if (error.name === 'CastError') return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'The requested case was not found.' } });
  const status = error.status || 500;
  res.status(status).json({ success: false, error: { code: error.code || 'INTERNAL_ERROR', message: status < 500 ? error.message : 'Something went wrong. Please try again.' } });
}
