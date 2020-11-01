import { createLogger, format, transports } from "winston";
export default createLogger({
  level: "info",
  format: format.simple(),
  transports: [
    // - Write to all logs with level `info` and above to `combined.log`
    new transports.File({ filename: "combined.log" }),
    // - Write all logs error (and above) to Console/terminal
    new transports.Console(),
  ],
});
