// @ts-ignore
import mysql from 'mysql-await'

//create mysql connection to export
const connection = mysql.createPool({
    host: process.env.DB_HOST,
    // @ts-ignore
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    connectionLimit: 10
});

let user = "CREATE TABLE IF NOT EXISTS `user` (\n" +
    "  `user_id` int NOT NULL AUTO_INCREMENT,\n" +
    "  `email` varchar(400) NOT NULL,\n" +
    "  `password` varchar(500) NOT NULL,\n" +
    "  PRIMARY KEY (`user_id`),\n" +
    "  UNIQUE KEY `user_id_UNIQUE` (`user_id`),\n" +
    "  UNIQUE KEY `email_UNIQUE` (`email`)\n" +
    ") ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;\n"
try {
    connection.query(user);
}catch (e){
    console.error("Error creating table user")
    process.exit(1)
}

export {connection as sql}