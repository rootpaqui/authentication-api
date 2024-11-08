export default (sequelize, DataTypes) => {
  return sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        unique: { msg: "This email already exists." },
      },
      password: {
        type: DataTypes.STRING,
      },
      refreshToken: {
        type: DataTypes.STRING
      }
    },
    { tableName: "users" }
  );
};
