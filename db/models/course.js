const {DataTypes, Sequelize} = require('sequelize');

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
        Course.associate = (models) => {
            Course.belongsTo(models.User, {
                foreignKey: {
                    fieldName: 'userId'
                }
            })
        }
    return Course;
}