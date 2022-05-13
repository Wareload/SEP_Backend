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
//CREATE TABLE IF NOT EXISTS {NAME...}
let user = "CREATE TABLE IF NOT EXISTS `user` (\n" +
    "  `user_id` int NOT NULL AUTO_INCREMENT,\n" +
    "  `email` varchar(400) NOT NULL,\n" +
    "  `password` varchar(500) NOT NULL,\n" +
    "  `firstname` varchar(60) NOT NULL,\n" +
    "  `lastname` varchar(60) NOT NULL,\n" +
    "  `tags` json NOT NULL,\n" +
    "  PRIMARY KEY (`user_id`),\n" +
    "  UNIQUE KEY `user_id_UNIQUE` (`user_id`),\n" +
    "  UNIQUE KEY `email_UNIQUE` (`email`)\n" +
    ") ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;\n";
let team = "CREATE TABLE IF NOT EXISTS `team` (\n" +
    "  `team_id` int NOT NULL AUTO_INCREMENT,\n" +
    "  `name` varchar(60) NOT NULL,\n" +
    "  PRIMARY KEY (`team_id`),\n" +
    "  UNIQUE KEY `id_UNIQUE` (`team_id`)\n" +
    ") ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;\n"
let teammember = "CREATE TABLE IF NOT EXISTS `teammember` (\n" +
    "  `teammember_id` int NOT NULL AUTO_INCREMENT,\n" +
    "  `teamid` int NOT NULL,\n" +
    "  `userid` int NOT NULL,\n" +
    "  `leader` tinyint(1) NOT NULL,\n" +
    "  PRIMARY KEY (`teammember_id`),\n" +
    "  UNIQUE KEY `id_UNIQUE` (`teammember_id`),\n" +
    "  KEY `userid` (`userid`),\n" +
    "  KEY `teammember_ibfk_1` (`teamid`),\n" +
    "  CONSTRAINT `teammember_ibfk_1` FOREIGN KEY (`teamid`) REFERENCES `team` (`team_id`) ON DELETE CASCADE,\n" +
    "  CONSTRAINT `teammember_ibfk_2` FOREIGN KEY (`userid`) REFERENCES `user` (`user_id`)\n" +
    ") ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;\n";
try {
    connection.query(user)
    connection.query(team)
    connection.query(teammember)
} catch (e) {
    console.error("Error creating table user")
    process.exit(1)
}

export {connection as sql}