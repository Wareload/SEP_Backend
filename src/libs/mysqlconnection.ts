// @ts-ignore
import mysql from 'mysql-await'

//create mysql connection to export
const connection = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    connectionLimit: 20
});
//user table
const user = "CREATE TABLE IF NOT EXISTS `user` (\n" +
    "  `user_id` int NOT NULL AUTO_INCREMENT,\n" +
    "  `email` varchar(500) NOT NULL,\n" +
    "  `password` varchar(500) NOT NULL,\n" +
    "  `firstname` varchar(70) NOT NULL,\n" +
    "  `lastname` varchar(70) NOT NULL,\n" +
    "  `tags` json NOT NULL,\n" +
    "  PRIMARY KEY (`user_id`),\n" +
    "  UNIQUE KEY `user_id_UNIQUE` (`user_id`),\n" +
    "  UNIQUE KEY `email_UNIQUE` (`email`)\n" +
    ") ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;\n";
//team table
const team = "CREATE TABLE IF NOT EXISTS `team` (\n" +
    "  `team_id` int NOT NULL AUTO_INCREMENT,\n" +
    "  `name` varchar(60) NOT NULL,\n" +
    "  PRIMARY KEY (`team_id`),\n" +
    "  UNIQUE KEY `id_UNIQUE` (`team_id`)\n" +
    ") ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;\n"
//teammember table
const teammember = "CREATE TABLE IF NOT EXISTS `teammember` (\n" +
    "  `teammember_id` int NOT NULL AUTO_INCREMENT,\n" +
    "  `teamid` int NOT NULL,\n" +
    "  `userid` int NOT NULL,\n" +
    "  `leader` tinyint(1) NOT NULL,\n" +
    "  PRIMARY KEY (`teammember_id`),\n" +
    "  UNIQUE KEY `id_UNIQUE` (`teammember_id`),\n" +
    "  UNIQUE KEY `teamid` (`teamid`,`userid`),\n" +
    "  KEY `userid` (`userid`),\n" +
    "  KEY `teammember_ibfk_1` (`teamid`),\n" +
    "  CONSTRAINT `teammember_ibfk_1` FOREIGN KEY (`teamid`) REFERENCES `team` (`team_id`) ON DELETE CASCADE,\n" +
    "  CONSTRAINT `teammember_ibfk_2` FOREIGN KEY (`userid`) REFERENCES `user` (`user_id`)\n" +
    ") ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;\n"
//invitations table
const invitations = "CREATE TABLE IF NOT EXISTS `invitation` (\n" +
    "  `id` int NOT NULL AUTO_INCREMENT,\n" +
    "  `user_id` int NOT NULL,\n" +
    "  `team_id` int NOT NULL,\n" +
    "  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,\n" +
    "  PRIMARY KEY (`id`),\n" +
    "  UNIQUE KEY `id_UNIQUE` (`id`),\n" +
    "  UNIQUE KEY `user_id` (`user_id`,`team_id`),\n" +
    "  KEY `fk1_idx` (`team_id`),\n" +
    "  KEY `invitation_ibfk_1` (`user_id`),\n" +
    "  CONSTRAINT `invitation_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE,\n" +
    "  CONSTRAINT `invitation_ibfk_2` FOREIGN KEY (`team_id`) REFERENCES `team` (`team_id`) ON DELETE CASCADE\n" +
    ") ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;\n";

//mood table
const mood = "CREATE TABLE IF NOT EXISTS `mood` (\n" +
    "  `mood_id` int NOT NULL AUTO_INCREMENT,\n" +
    "  `user_id` int NOT NULL,\n" +
    "  `team_id` int NOT NULL,\n" +
    "  `mood` smallint NOT NULL,\n" +
    "  `note` varchar(290) NOT NULL,\n" +
    "  `datestamp` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,\n" +
    "  PRIMARY KEY (`mood_id`),\n" +
    "  UNIQUE KEY `mood_id_UNIQUE` (`mood_id`),\n" +
    "  KEY `mood_fk1_idx` (`team_id`),\n" +
    "  KEY `user_id` (`user_id`),\n" +
    "  CONSTRAINT `mood_fk1` FOREIGN KEY (`team_id`) REFERENCES `team` (`team_id`) ON DELETE CASCADE ON UPDATE CASCADE,\n" +
    "  CONSTRAINT `mood_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)\n" +
    ") ENGINE=InnoDB AUTO_INCREMENT=80 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;\n"

async function setup() {
    try {
        //create tables if not exists
        await connection.awaitQuery(user)
        await connection.awaitQuery(team)
        await connection.awaitQuery(teammember)
        await connection.awaitQuery(invitations)
        await connection.awaitQuery(mood)
    } catch (e) {
        console.error(e)
        process.exit(1)
    }
}

await setup();

export {connection as sql}