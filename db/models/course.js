const {DataTypes, Sequelize} = require('sequelize');
const User = require('./user');

module.exports = (sequelize) => {
    class Course extends Sequelize.Model {}
    Course.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            estimatedTime: {
                type: DataTypes.STRING,
            },
            materialsNeeded: {
                type: DataTypes.STRING
            }
        }, {sequelize});
    return Course;
}