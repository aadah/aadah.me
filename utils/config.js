var config = {}

config.db_connection_string =
    'mongodb://' +
    process.env.AADAH_DB_USER +
    ':' +
    process.env.AADAH_DB_PASS +
    '@' +
    process.env.AADAH_DB_HOST +
    ':' +
    process.env.AADAH_DB_PORT +
    '/' +
    process.env.AADAH_DB

config.port = process.env.AADAH_PORT

module.exports = config
