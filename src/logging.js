import { API_URI } from ".";

export const log_level = {
    DEBUG: "debug",
    INFO: "info",
    WARNING: "warning",
    ERROR: "error"
};

const LOG_SOURCE = "client";

export function clientLog(log, severity, ip) {
    var payload = {}
    switch (severity) {
        case (log_level.DEBUG):
            console.debug(log);
            break;
        case (log_level.ERROR):
            payload = {
                message: {
                    error: log.message,
                    stack: log.stack
                },
                severity: severity,
                source: LOG_SOURCE,
                ip: ip
            };
            break;
        default:
            payload = {
                message: log,
                severity: severity,
                source: LOG_SOURCE,
                ip: ip
            };
            break;
    }
    if (severity !== log_level.DEBUG) {
        var options = {
            method: "POST",
            body: JSON.stringify(payload),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        }
        fetch(`${API_URI}log/`, options).catch((error) => {
            console.log(error);
        });
    }
}
