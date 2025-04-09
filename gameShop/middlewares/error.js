// Middleware för hantering av 404
const notFound = (req, res, next) => {
  // Skapa ett nytt Error objekt med info om vilken url som saknas
  const error = new Error(`Not Found - ${req.originalUrl}`);

  // Sätt HTTP status till 404
  res.status(404);

  // Skicka vidare felet till nästa felhanterare
  next(error);
};

// Allmän felhanteringsmiddleware
const errorHandler = (err, req, res, next) => {
  // Använd befintlig statuskod om den inte är 200, annars sätt till 500
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);

  // Skicka tillbaka ett json svar med felmeddelande
  res.json({
      message: err.message,

      // Visa inte i produktion
      stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};

module.exports = { notFound, errorHandler };
