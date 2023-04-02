"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Todos extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

    static async getTodos() {
      return this.findAll();
    }
    static async addTodo({ title, dueDate }) {
      return this.create({ title: title, dueDate: dueDate, completed: false });
    }
    static async remove(id) {
      return this.destroy({
        where: {
          id: id,
        },
      });
    }
    markAsCompleted() {
      return this.update({ completed: true });
    }
    toggleMarkAsCompleted() {
      return this.update({ completed: !this.completed });
    }
    // eslint-disable-next-line no-unused-vars
    static associate(models) {
      // define association here
    }
  }
  Todos.init(
    {
      title: DataTypes.STRING,
      dueDate: DataTypes.DATEONLY,
      completed: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Todos",
    }
  );
  return Todos;
};
