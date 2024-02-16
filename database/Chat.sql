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
  KEY `sender_user_id` (`sender_user_id`),
  KEY `receiver_user_id` (`receiver_user_id`),
  CONSTRAINT `Messages_ibfk_1` FOREIGN KEY (`sender_user_id`) REFERENCES `Users` (`user_id`),
  CONSTRAINT `Messages_ibfk_2` FOREIGN KEY (`receiver_user_id`) REFERENCES `Users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `Messages` (`message_id`, `sender_user_id`, `receiver_user_id`, `message`, `epoch`) VALUES
(1,	3,	2,	'hello from Lando',	1708115952890),
(2,	2,	3,	'hello from Robbert',	1708115969587),
(3,	2,	3,	'Robbert are you there?',	1708115994328),
(4,	3,	2,	'Yes but busy',	1708116053916);

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
(1,	'tomasz@gmail.com',	'$2b$10$q/1pfoH9wioynFs83VD.QeRsy.0T0prCibmJARArJeB0tWqwBuTiS',	'Tomasz',	'Turek'),
(2,	'Robert@gmail.com',	'$2b$10$8SASAiGILdsJ4dcJ60UqjehpOLRrwKqJRRBR4/u3i7edqqsgVnM.6',	'Robert',	'Smith'),
(3,	'Lando@gmail.com',	'$2b$10$VdkOPJ0u3oezigYWwiQ98uRvyVWdYRTJKo.phqsOVoVS7BTpJKuwO',	'Lando',	'Norris');

-- 2024-02-16 20:42:22
