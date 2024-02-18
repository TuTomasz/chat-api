-- Adminer 4.8.1 MySQL 8.3.0 dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

SET NAMES utf8mb4;

DROP TABLE IF EXISTS `Messages`;
CREATE TABLE `Messages` (
  `message_id` int NOT NULL AUTO_INCREMENT,
  `sender_user_id` int DEFAULT NULL,
  `receiver_user_id` int DEFAULT NULL,
  `message` text,
  `epoch` bigint DEFAULT NULL,
  PRIMARY KEY (`message_id`),
  KEY `receiver_user_id` (`receiver_user_id`),
  KEY `sender_user_id` (`sender_user_id`,`receiver_user_id`),
  CONSTRAINT `Messages_ibfk_1` FOREIGN KEY (`sender_user_id`) REFERENCES `Users` (`user_id`),
  CONSTRAINT `Messages_ibfk_2` FOREIGN KEY (`receiver_user_id`) REFERENCES `Users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `Messages` (`message_id`, `sender_user_id`, `receiver_user_id`, `message`, `epoch`) VALUES
(2,	1,	3,	'Hello Max',	1708286023272),
(3,	3,	1,	'Hello Lando',	1708286035311),
(4,	3,	1,	'Are you there',	1708286046450),
(5,	3,	1,	'Are you there ??',	1708286053005),
(6,	1,	3,	'Yeah Im busy',	1708286066935);

DROP TABLE IF EXISTS `Users`;
CREATE TABLE `Users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `Users` (`user_id`, `email`, `password`, `first_name`, `last_name`) VALUES
(1,	'Lando@gmail.com',	'$2b$10$I5FUMj27kWy9j/kT5duC8O4viNQe52lhM8O80UpeSccQBuZjtTha2',	'Lando',	'Norris'),
(2,	'Tomasz@gmail.com',	'$2b$10$o4qXRB5d0SrP9D90P96BDu3vhOEZkIDxGZxSs9GcsqIwa89VRygLu',	'Tomasz',	'Turek'),
(3,	'Max@gmail.com',	'$2b$10$UQalQWjLOS.kiWbCb6yzJOTXGiE214aiXVpzALlh9n2bNe.pS9r2.',	'Max',	'Verstapen');

INSERT INTO `migrations` (`id`, `name`, `run_on`) VALUES
(1,	'/20240216175820-Users',	'2024-02-18 14:51:29'),
(2,	'/20240216175836-Messages',	'2024-02-18 14:51:29');

-- 2024-02-18 19:55:34
