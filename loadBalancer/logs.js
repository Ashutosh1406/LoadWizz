import winston from "winston"

const logger = winston.createLogger({
    level:'Information Here',
    format:winston.format.json(),
    defaultMeta: {service:'User-Services'},
    transports:[
        new winston.transports.File({filename:'err.log',level:'error'}),
        new winston.transports.File({filename:'totalLogs'}),
        new winston.transports.File({filename:'devLogs'})
    ],
});

export default logger
