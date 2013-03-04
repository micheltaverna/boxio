CREATE DATABASE  IF NOT EXISTS `boxio` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `boxio`;
-- MySQL dump 10.13  Distrib 5.5.16, for Win32 (x86)
--
-- Host: localhost    Database: boxio
-- ------------------------------------------------------
-- Server version	5.5.24-7

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cron`
--

DROP TABLE IF EXISTS `cron`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cron` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(64) NOT NULL,
  `minutes` varchar(256) DEFAULT '*',
  `heures` varchar(128) DEFAULT '*',
  `jour` varchar(128) DEFAULT '*',
  `jourSemaine` varchar(64) DEFAULT '*',
  `mois` varchar(128) DEFAULT '*',
  `id_favoris` int(11) DEFAULT NULL COMMENT 'Référence sur l''id de l''action favorite à executer (priorité sur id_macros si NOT NULL)',
  `id_macro` int(11) DEFAULT NULL COMMENT 'Référence sur l''id de la macro à executer (priorité sur id_macros si NOT NULL)',
  `trame` text,
  `active` bit(1) DEFAULT b'0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `nom_UNIQUE` (`nom`),
  KEY `id_cron` (`id`),
  KEY `id_favoris` (`id_favoris`),
  KEY `id_macros` (`id_macro`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=latin1 COMMENT='Table pour la gestion des actions périodique. Fonctionnement';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `references`
--

DROP TABLE IF EXISTS `references`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `references` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ref_legrand` int(11) NOT NULL COMMENT 'Reference legerand de l''appareil',
  `ref_unit_legrand` int(11) NOT NULL COMMENT 'Concatenation de la reference et du unit pour facilite les recherche en DB',
  `nom` varchar(64) NOT NULL COMMENT 'Nom du module',
  `family` enum('LIGHTING','SHUTTER','SCENE','COMFORT','ENERGY','ALARM') NOT NULL COMMENT 'famille du module',
  `media` enum('CPL','RF','IR') NOT NULL COMMENT 'type du media pour la creation des trames ou des scenarios',
  `nom_interne` varchar(64) DEFAULT NULL COMMENT 'nom interne au unit',
  `btn` varchar(64) DEFAULT NULL COMMENT 'Nom du bouton physique',
  `unit` int(11) DEFAULT NULL COMMENT 'Valeur du unit',
  `unit_status` tinyint(4) DEFAULT NULL,
  `possibility` set('ACTION','STATUS','MEMORY','COMMAND') DEFAULT NULL COMMENT 'Possibilites du unit ACTION=Recepteur d''ordre; STATUS=Retour d''état; MEMORY=Bloc mémoire des scenarios; COMMAND=Emetteur d''ordre',
  `function_code` smallint(6) DEFAULT NULL COMMENT 'Represente la famille',
  `unit_code` smallint(6) DEFAULT NULL,
  `Commentaires` text,
  PRIMARY KEY (`id`),
  KEY `ref_legrand` (`ref_legrand`),
  KEY `ref_unit_legrand` (`ref_unit_legrand`)
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `trame_standby`
--

DROP TABLE IF EXISTS `trame_standby`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `trame_standby` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `trame` varchar(50) NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MEMORY AUTO_INCREMENT=122 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `zones`
--

DROP TABLE IF EXISTS `zones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `zones` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(64) NOT NULL,
  `id_legrand` int(11) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `zone` (`id_legrand`,`nom`),
  KEY `id_legrand` (`id_legrand`)
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `trame`
--

DROP TABLE IF EXISTS `trame`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `trame` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `trame` text NOT NULL,
  `direction` enum('GET','SET') NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `date` (`date`),
  KEY `id_trame` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=146264 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `triggers`
--

DROP TABLE IF EXISTS `triggers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `triggers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(64) NOT NULL,
  `trigger` text NOT NULL,
  `id_favoris` int(11) DEFAULT NULL,
  `id_macro` int(11) DEFAULT NULL,
  `trame` text,
  `active` bit(1) DEFAULT b'0',
  PRIMARY KEY (`id`),
  KEY `id_favoris` (`id_favoris`),
  KEY `id_macro` (`id_macro`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `favoris`
--

DROP TABLE IF EXISTS `favoris`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `favoris` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(64) NOT NULL,
  `trame` text NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nom_UNIQUE` (`nom`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `scenarios`
--

DROP TABLE IF EXISTS `scenarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `scenarios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_legrand` int(11) NOT NULL,
  `unit` tinyint(4) NOT NULL,
  `id_legrand_listen` int(11) NOT NULL,
  `unit_listen` tinyint(4) NOT NULL,
  `value_listen` int(11) DEFAULT NULL,
  `media_listen` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `scenario` (`id_legrand`,`unit`,`id_legrand_listen`,`unit_listen`),
  KEY `ref_legrand` (`id_legrand`),
  KEY `ref_legrand_listen` (`id_legrand_listen`)
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `macros`
--

DROP TABLE IF EXISTS `macros`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `macros` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_macro` int(11) NOT NULL COMMENT 'Identifiant global de la macro',
  `nom` varchar(64) NOT NULL COMMENT 'Nom de la macro',
  `id_favoris` int(11) DEFAULT NULL COMMENT 'Id de la commande favoris a executer (si trame NOT NULL priorite sur la trame)',
  `nom_command` varchar(64) DEFAULT NULL,
  `trame` text COMMENT 'trame a envoyer',
  `timing` int(11) NOT NULL DEFAULT '0' COMMENT 'Attente en secondes avant d''executer la commande',
  PRIMARY KEY (`id`),
  KEY `id_macro` (`id_macro`),
  KEY `id_favoris` (`id_favoris`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `version`
--

DROP TABLE IF EXISTS `version`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `version` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `release` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `update` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `trame_decrypted`
--

DROP TABLE IF EXISTS `trame_decrypted`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `trame_decrypted` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_trame` int(11) NOT NULL,
  `direction` enum('GET','SET') NOT NULL,
  `mode` enum('UNKNOWN','MULTICAST','UNICAST','BROADCAST','UNICAST_DIRECT') NOT NULL DEFAULT 'UNKNOWN',
  `media` enum('UNKNOWN','CPL','RF','IR') NOT NULL DEFAULT 'UNKNOWN',
  `format` enum('UNKNOWN','ACK','NACK','BUS_COMMAND','STATUS_REQUEST','DIMENSION_REQUEST','DIMENSION_SET') NOT NULL DEFAULT 'UNKNOWN',
  `type` enum('UNKNOWN','LIGHTING','SHUTTER','THERMOREGULATION','ALARM','SCENE','MANAGEMENT','SPECIAL_COMMAND','CONFIGURATION') NOT NULL DEFAULT 'UNKNOWN',
  `value` enum('UNKNOWN','ON','OFF','DIM_STOP','MOVE_STOP','MOVE_UP','MOVE_DOWN','CONSIGNE','DEROGATION_CONSIGNE','FIN_DEROGATION','GO_TO_TEMPERATURE','ARRET','FIN_ARRET','STOP_FAN_SPEED','LOW_FAN_SPEED','HIGH_FAN_SPEED','CONFORT_JOUR_ROUGE','CONCIERGE_CALL','LOCKER_CONTROL','ACTION','STOP_ACTION','ACTION_FOR_TIME','ACTION_IN_TIME','INFO_SCENE_OFF','CLOCK_SYNCHRONISATION','LOW_BATTERY','OVERRIDE_FOR_TIME','END_OF_OVERRIDE','OPEN_LEARNING','CLOSE_LEARNING','ADDRESS_ERASE','MEMORY_RESET','MEMORY_FULL','MEMORY_READ','VALID_ACTION','INVALID_ACTION','CANCEL_ID','MANAGEMENT_CLOCK_SYNCHRONISATION','OCCUPIED','UNOCCUPIED') DEFAULT NULL,
  `dimension` enum('UNKNOWN','DIM_STEP','GO_TO_LEVEL_TIME','COMMANDE_ECS','INFORMATION_TARIF','QUEL_INDEX','INDEX_BASE','INDEX_HC','INDEX_BLEU','INDEX_BLANC','INDEX_ROUGE','SET_TEMP_CONFORT','READ_TEMP_CONFORT','INDICATION_TEMP_CONFORT','SET_TEMP_ECO','READ_TEMP_ECO','INDICATION_TEMP_ECO','SET_V3V_CONSIGNE','CONSIGN_V3V_REQUEST','READ_CLOCK_TIME_PARAMETER','INDICATION_CLOCK_TIME_PARAMETER','SET_CLOCK_TIME_PARAMETER','ANNOUNCE_ID','DEVICE_DESCRIPTION_REQUEST','DEVICE_DESCRIPTION_STATUS','REQUEST_ID','EXTENDED_MEMORY_DATA','MEMORY_DEPTH_INDICATION','MEMORY_DATA','UNIT_DESCRIPTION_REQUEST','UNIT_DESCRIPTION_STATUS','MEMORY_WRITE','SET_COMMUNICATION_PARAMETER') DEFAULT NULL,
  `param` varchar(128) DEFAULT NULL,
  `id_legrand` int(10) unsigned DEFAULT NULL,
  `unit` tinyint(3) unsigned DEFAULT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `id_legrand` (`id_legrand`),
  KEY `date` (`date`),
  KEY `id_trame` (`id`,`id_trame`)
) ENGINE=InnoDB AUTO_INCREMENT=146261 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `equipements_status`
--

DROP TABLE IF EXISTS `equipements_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `equipements_status` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_legrand` int(11) NOT NULL,
  `ref_unit_legrand` int(11) NOT NULL,
  `unit` tinyint(4) NOT NULL,
  `status` varchar(64) NOT NULL DEFAULT 'undefined',
  `server_opt` varchar(64) DEFAULT NULL COMMENT 'Option propre au serveur pour interpreter le status',
  `date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `equipements` (`id_legrand`,`unit`),
  KEY `id_legrand` (`id_legrand`),
  KEY `ref_unit_legrand` (`ref_unit_legrand`)
) ENGINE=InnoDB AUTO_INCREMENT=189 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `upd_date` BEFORE UPDATE ON `equipements_status`
 FOR EACH ROW begin
    SET NEW.date = CURRENT_TIMESTAMP();
end */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `equipements`
--

DROP TABLE IF EXISTS `equipements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `equipements` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_legrand` int(11) NOT NULL,
  `ref_legrand` int(11) NOT NULL,
  `nom` varchar(64) NOT NULL,
  `function` enum('UNKNOWN','LIGHTING','SHUTTER','CONFORT') DEFAULT 'UNKNOWN',
  `version` smallint(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_legrand` (`id_legrand`),
  KEY `ref_legrand` (`ref_legrand`),
  KEY `status` (`id_legrand`),
  KEY `references` (`ref_legrand`)
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2013-03-03 13:20:07
