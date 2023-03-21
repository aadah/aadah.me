var config = {}

config.db_connection_string =`mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@mongodb/${process.env.DB}`

config.port = process.env.HTTP_PORT

module.exports = config
