/* global process */
import Sequelize from 'sequelize';


const debug = require('debug')('overrustle:database');
let { DB_DB, DB_PATH, NODE_ENV } = process.env;

DB_DB = DB_DB || 'overrustle';
DB_PATH = DB_PATH || './overrustle.sqlite';

debug(`Using database ${DB_DB}:${DB_PATH}`);

export const sequelize = new Sequelize(DB_DB, null, null, {
  dialect: 'sqlite',
  storage: DB_PATH || ':memory:',

  logging: NODE_ENV === 'production' ? false : debug,

  define: {
    paranoid: false,
    underscored: true,
  },
});

// TODO
export const User = sequelize.define('user', {});

export const Stream = sequelize.define('stream', {
  id: {
    type: Sequelize.UUIDV4,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
    unique: true,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  channel: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: 'channel_service',
    validate: {
      notEmpty: true,
    },
  },
  service: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: 'channel_service',
    validate: {
      notEmpty: true,
    },
  },
  // TODO - virtual getter for this
  overrustle: {
    type: Sequelize.STRING,
  },
  thumbnail: {
    type: Sequelize.STRING,
  },
  live: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  // special query for this
  // rustlers: {
  // },
  viewers: { // amount of people the service reports is watching this stream
    type: Sequelize.INTEGER,
    defaultValue: 1,
  },
}, {
  classMethods: {
    async findRustlersFor(id) {
      const [[{ rustlers }]] = await sequelize.query('SELECT COUNT(`rustlers`.`stream_id`) AS `rustlers` FROM `streams` AS `stream` LEFT OUTER JOIN `rustlers` AS `rustlers` ON `stream`.`id` = `rustlers`.`stream_id` WHERE `stream`.`id` = ? GROUP BY `stream`.`id` LIMIT 1;', {
        replacements: [id],
      });
      return rustlers;
    },
    async findAllWithRustlers() {
      const [ streams ] = await sequelize.query('SELECT `stream`.*, COUNT(`rustlers`.`stream_id`) AS `rustlers` FROM `streams` AS `stream` LEFT OUTER JOIN `rustlers` AS `rustlers` ON `stream`.`id` = `rustlers`.`stream_id` GROUP BY `stream`.`id`;');
      return streams;
    },
  },
});

export const Rustler = sequelize.define('rustler', {
  id: {
    type: Sequelize.UUIDV4,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
    unique: true,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  stream_id: { // the Stream that the rustler is watching
    type: Sequelize.UUIDV4,
    references: {
      model: 'streams',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  },
});

User.sync();
Rustler.sync();
Stream.sync();

Rustler.belongsTo(Stream, { as: 'stream' });
Stream.hasMany(Rustler);
