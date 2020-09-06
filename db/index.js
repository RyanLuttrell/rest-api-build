const Sequelize = require('sequelize');

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "fsjstd-restapi.db"
});

const db = {
  sequelize,
  Sequelize,
  models: {}
};

db.models.Course = require('./models/course')(sequelize);
db.models.User = require('./models/user')(sequelize);

module.exports = db;
