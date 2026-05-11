// import app from "./app.js";
// import { pinoLogger } from "./app/utils/pinno.logger.js";

// const PORT = process.env.PORT || 9000;

// app.listen(PORT, () => {
//   pinoLogger.info(`🚀 Server is running on port ${PORT}`);
//   pinoLogger.info(`📊 Health check: http://localhost:${PORT}/health`);
// });

// --------------------------------------------------------------------------------------------

import app from "./app.js";
import { pinoLogger } from "./app/utils/pinno.logger.js";

const PORT = process.env.PORT || 9000;

// Bind to 0.0.0.0 to allow Railway's proxy to reach the app
app.listen(PORT, '0.0.0.0', () => {
  pinoLogger.info(`🚀 Server is running on port ${PORT}`);
  pinoLogger.info(`📊 Health check: http://0.0.0:${PORT}/health`);
});

