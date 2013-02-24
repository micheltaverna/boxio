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
-- Temporary table structure for view `view_equipements`
--

DROP TABLE IF EXISTS `view_equipements`;
/*!50001 DROP VIEW IF EXISTS `view_equipements`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `view_equipements` (
  `nom` varchar(64),
  `zone` varchar(64),
  `id_legrand` int(11),
  `ref_legrand` int(11)
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `view_all_trame`
--

DROP TABLE IF EXISTS `view_all_trame`;
/*!50001 DROP VIEW IF EXISTS `view_all_trame`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `view_all_trame` (
  `id` int(11),
  `trame` text,
  `direction` enum('GET','SET'),
  `mode` enum('UNKNOWN','MULTICAST','UNICAST','BROADCAST','UNICAST_DIRECT'),
  `media` enum('UNKNOWN','CPL','RF','IR'),
  `format` enum('UNKNOWN','ACK','NACK','BUS_COMMAND','STATUS_REQUEST','DIMENSION_REQUEST','DIMENSION_SET'),
  `type` enum('UNKNOWN','LIGHTING','SHUTTER','THERMOREGULATION','ALARM','SCENE','MANAGEMENT','SPECIAL_COMMAND','CONFIGURATION'),
  `value` enum('UNKNOWN','ON','OFF','DIM_STOP','MOVE_STOP','MOVE_UP','MOVE_DOWN','CONSIGNE','DEROGATION_CONSIGNE','FIN_DEROGATION','GO_TO_TEMPERATURE','ARRET','FIN_ARRET','STOP_FAN_SPEED','LOW_FAN_SPEED','HIGH_FAN_SPEED','CONFORT_JOUR_ROUGE','CONCIERGE_CALL','LOCKER_CONTROL','ACTION','STOP_ACTION','ACTION_FOR_TIME','ACTION_IN_TIME','INFO_SCENE_OFF','CLOCK_SYNCHRONISATION','LOW_BATTERY','OVERRIDE_FOR_TIME','END_OF_OVERRIDE','OPEN_LEARNING','CLOSE_LEARNING','ADDRESS_ERASE','MEMORY_RESET','MEMORY_FULL','MEMORY_READ','VALID_ACTION','INVALID_ACTION','CANCEL_ID','MANAGEMENT_CLOCK_SYNCHRONISATION','OCCUPIED','UNOCCUPIED'),
  `dimension` enum('UNKNOWN','DIM_STEP','GO_TO_LEVEL_TIME','COMMANDE_ECS','INFORMATION_TARIF','QUEL_INDEX','INDEX_BASE','INDEX_HC','INDEX_BLEU','INDEX_BLANC','INDEX_ROUGE','SET_TEMP_CONFORT','READ_TEMP_CONFORT','INDICATION_TEMP_CONFORT','SET_TEMP_ECO','READ_TEMP_ECO','INDICATION_TEMP_ECO','SET_V3V_CONSIGNE','CONSIGN_V3V_REQUEST','READ_CLOCK_TIME_PARAMETER','INDICATION_CLOCK_TIME_PARAMETER','SET_CLOCK_TIME_PARAMETER','ANNOUNCE_ID','DEVICE_DESCRIPTION_REQUEST','DEVICE_DESCRIPTION_STATUS','REQUEST_ID','EXTENDED_MEMORY_DATA','MEMORY_DEPTH_INDICATION','MEMORY_DATA','UNIT_DESCRIPTION_REQUEST','UNIT_DESCRIPTION_STATUS','MEMORY_WRITE','SET_COMMUNICATION_PARAMETER'),
  `param` varchar(128),
  `id_legrand` int(10) unsigned,
  `unit` tinyint(3) unsigned,
  `Date` timestamp
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `view_macros`
--

DROP TABLE IF EXISTS `view_macros`;
/*!50001 DROP VIEW IF EXISTS `view_macros`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `view_macros` (
  `id_command` int(11),
  `id_macro` int(11),
  `nom` varchar(64),
  `id_favoris` int(11),
  `trame_favoris` text,
  `trame` text,
  `timing` int(11)
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `view_unknown_equipement`
--

DROP TABLE IF EXISTS `view_unknown_equipement`;
/*!50001 DROP VIEW IF EXISTS `view_unknown_equipement`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `view_unknown_equipement` (
  `id` int(11),
  `trame` text,
  `direction` enum('GET','SET'),
  `mode` enum('UNKNOWN','MULTICAST','UNICAST','BROADCAST','UNICAST_DIRECT'),
  `media` enum('UNKNOWN','CPL','RF','IR'),
  `format` enum('UNKNOWN','ACK','NACK','BUS_COMMAND','STATUS_REQUEST','DIMENSION_REQUEST','DIMENSION_SET'),
  `type` enum('UNKNOWN','LIGHTING','SHUTTER','THERMOREGULATION','ALARM','SCENE','MANAGEMENT','SPECIAL_COMMAND','CONFIGURATION'),
  `value` enum('UNKNOWN','ON','OFF','DIM_STOP','MOVE_STOP','MOVE_UP','MOVE_DOWN','CONSIGNE','DEROGATION_CONSIGNE','FIN_DEROGATION','GO_TO_TEMPERATURE','ARRET','FIN_ARRET','STOP_FAN_SPEED','LOW_FAN_SPEED','HIGH_FAN_SPEED','CONFORT_JOUR_ROUGE','CONCIERGE_CALL','LOCKER_CONTROL','ACTION','STOP_ACTION','ACTION_FOR_TIME','ACTION_IN_TIME','INFO_SCENE_OFF','CLOCK_SYNCHRONISATION','LOW_BATTERY','OVERRIDE_FOR_TIME','END_OF_OVERRIDE','OPEN_LEARNING','CLOSE_LEARNING','ADDRESS_ERASE','MEMORY_RESET','MEMORY_FULL','MEMORY_READ','VALID_ACTION','INVALID_ACTION','CANCEL_ID','MANAGEMENT_CLOCK_SYNCHRONISATION','OCCUPIED','UNOCCUPIED'),
  `dimension` enum('UNKNOWN','DIM_STEP','GO_TO_LEVEL_TIME','COMMANDE_ECS','INFORMATION_TARIF','QUEL_INDEX','INDEX_BASE','INDEX_HC','INDEX_BLEU','INDEX_BLANC','INDEX_ROUGE','SET_TEMP_CONFORT','READ_TEMP_CONFORT','INDICATION_TEMP_CONFORT','SET_TEMP_ECO','READ_TEMP_ECO','INDICATION_TEMP_ECO','SET_V3V_CONSIGNE','CONSIGN_V3V_REQUEST','READ_CLOCK_TIME_PARAMETER','INDICATION_CLOCK_TIME_PARAMETER','SET_CLOCK_TIME_PARAMETER','ANNOUNCE_ID','DEVICE_DESCRIPTION_REQUEST','DEVICE_DESCRIPTION_STATUS','REQUEST_ID','EXTENDED_MEMORY_DATA','MEMORY_DEPTH_INDICATION','MEMORY_DATA','UNIT_DESCRIPTION_REQUEST','UNIT_DESCRIPTION_STATUS','MEMORY_WRITE','SET_COMMUNICATION_PARAMETER'),
  `param` varchar(128),
  `id_legrand` int(10) unsigned,
  `unit` tinyint(3) unsigned,
  `Date` timestamp,
  `nom_equipement` varchar(64)
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `view_scenarios`
--

DROP TABLE IF EXISTS `view_scenarios`;
/*!50001 DROP VIEW IF EXISTS `view_scenarios`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `view_scenarios` (
  `id_legrand` int(11),
  `unit` tinyint(4),
  `reference` varchar(64),
  `family` enum('LIGHTING','SHUTTER','SCENE','COMFORT','ENERGY','ALARM'),
  `media` enum('CPL','RF','IR'),
  `reference_interne` varchar(64),
  `nom` varchar(64),
  `zone` varchar(64),
  `id_legrand_listen` int(11),
  `unit_listen` tinyint(4),
  `scenario_listen` int(11),
  `family_listen` int(11),
  `reference_listen` varchar(64),
  `reference_interne_listen` varchar(64),
  `nom_listen` varchar(64),
  `zone_listen` varchar(64)
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `view_favoris`
--

DROP TABLE IF EXISTS `view_favoris`;
/*!50001 DROP VIEW IF EXISTS `view_favoris`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `view_favoris` (
  `id` int(11),
  `nom` varchar(64),
  `trame` text
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `view_equipements_status`
--

DROP TABLE IF EXISTS `view_equipements_status`;
/*!50001 DROP VIEW IF EXISTS `view_equipements_status`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `view_equipements_status` (
  `id_legrand` int(11),
  `unit` tinyint(4),
  `idunit` varchar(15),
  `ref_legrand` int(11),
  `equipement` varchar(64),
  `reference` varchar(64),
  `nom_interne` varchar(64),
  `Btn` varchar(64),
  `possibility` set('ACTION','STATUS','MEMORY','COMMAND'),
  `server_opt` varchar(64),
  `status` varchar(64),
  `unit_status` tinyint(4),
  `zone` varchar(64),
  `Date` timestamp
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `view_zones`
--

DROP TABLE IF EXISTS `view_zones`;
/*!50001 DROP VIEW IF EXISTS `view_zones`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `view_zones` (
  `nom` varchar(64)
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `view_references`
--

DROP TABLE IF EXISTS `view_references`;
/*!50001 DROP VIEW IF EXISTS `view_references`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `view_references` (
  `ref_legrand` int(11),
  `nom` varchar(64),
  `family` enum('LIGHTING','SHUTTER','SCENE','COMFORT','ENERGY','ALARM'),
  `media` enum('CPL','RF','IR')
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `view_cron`
--

DROP TABLE IF EXISTS `view_cron`;
/*!50001 DROP VIEW IF EXISTS `view_cron`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `view_cron` (
  `id` int(11),
  `nom` varchar(64),
  `minutes` varchar(256),
  `heures` varchar(128),
  `jour` varchar(128),
  `jourSemaine` varchar(64),
  `mois` varchar(128),
  `id_favoris` int(11),
  `id_macro` int(11),
  `trame` text,
  `active` bit(1)
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Final view structure for view `view_equipements`
--

/*!50001 DROP TABLE IF EXISTS `view_equipements`*/;
/*!50001 DROP VIEW IF EXISTS `view_equipements`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`boxio`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `view_equipements` AS select `equipements`.`nom` AS `nom`,`zones`.`nom` AS `zone`,`equipements`.`id_legrand` AS `id_legrand`,`equipements`.`ref_legrand` AS `ref_legrand` from (`zones` left join `equipements` on((`equipements`.`id_legrand` = `zones`.`id_legrand`))) order by `zones`.`nom`,`equipements`.`nom` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `view_all_trame`
--

/*!50001 DROP TABLE IF EXISTS `view_all_trame`*/;
/*!50001 DROP VIEW IF EXISTS `view_all_trame`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`boxio`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `view_all_trame` AS select `trame_decrypted`.`id` AS `id`,`trame`.`trame` AS `trame`,`trame_decrypted`.`direction` AS `direction`,`trame_decrypted`.`mode` AS `mode`,`trame_decrypted`.`media` AS `media`,`trame_decrypted`.`format` AS `format`,`trame_decrypted`.`type` AS `type`,`trame_decrypted`.`value` AS `value`,`trame_decrypted`.`dimension` AS `dimension`,`trame_decrypted`.`param` AS `param`,`trame_decrypted`.`id_legrand` AS `id_legrand`,`trame_decrypted`.`unit` AS `unit`,`trame_decrypted`.`date` AS `Date` from (`trame` left join `trame_decrypted` on((`trame`.`id` = `trame_decrypted`.`id_trame`))) order by `trame`.`id` desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `view_macros`
--

/*!50001 DROP TABLE IF EXISTS `view_macros`*/;
/*!50001 DROP VIEW IF EXISTS `view_macros`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`boxio`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `view_macros` AS select `macros`.`id` AS `id_command`,`macros`.`id_macro` AS `id_macro`,`macros`.`nom` AS `nom`,`macros`.`id_favoris` AS `id_favoris`,`favoris`.`trame` AS `trame_favoris`,`macros`.`trame` AS `trame`,`macros`.`timing` AS `timing` from (`macros` left join `favoris` on((`favoris`.`id` = `macros`.`id_favoris`))) order by `macros`.`nom`,`macros`.`id_macro`,`macros`.`timing` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `view_unknown_equipement`
--

/*!50001 DROP TABLE IF EXISTS `view_unknown_equipement`*/;
/*!50001 DROP VIEW IF EXISTS `view_unknown_equipement`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `view_unknown_equipement` AS select `trame_decrypted`.`id` AS `id`,`trame`.`trame` AS `trame`,`trame_decrypted`.`direction` AS `direction`,`trame_decrypted`.`mode` AS `mode`,`trame_decrypted`.`media` AS `media`,`trame_decrypted`.`format` AS `format`,`trame_decrypted`.`type` AS `type`,`trame_decrypted`.`value` AS `value`,`trame_decrypted`.`dimension` AS `dimension`,`trame_decrypted`.`param` AS `param`,`trame_decrypted`.`id_legrand` AS `id_legrand`,`trame_decrypted`.`unit` AS `unit`,`trame_decrypted`.`date` AS `Date`,`equipements`.`nom` AS `nom_equipement` from ((`trame_decrypted` left join `trame` on((`trame`.`id` = `trame_decrypted`.`id_trame`))) left join `equipements` on((`trame_decrypted`.`id_legrand` = `equipements`.`id_legrand`))) where ((`trame_decrypted`.`date` > (now() - interval 1 day)) and isnull(`equipements`.`nom`) and (`trame_decrypted`.`id_legrand` is not null)) group by `trame_decrypted`.`id_legrand` order by `trame_decrypted`.`date` desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `view_scenarios`
--

/*!50001 DROP TABLE IF EXISTS `view_scenarios`*/;
/*!50001 DROP VIEW IF EXISTS `view_scenarios`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`boxio`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `view_scenarios` AS select `scenarios`.`id_legrand` AS `id_legrand`,`scenarios`.`unit` AS `unit`,`references`.`nom` AS `reference`,`references`.`family` AS `family`,`references`.`media` AS `media`,`references`.`nom_interne` AS `reference_interne`,`equipements`.`nom` AS `nom`,`zones`.`nom` AS `zone`,`scenarios`.`id_legrand_listen` AS `id_legrand_listen`,`scenarios`.`unit_listen` AS `unit_listen`,`scenarios`.`value_listen` AS `scenario_listen`,`scenarios`.`family_listen` AS `family_listen`,`references_listen`.`nom` AS `reference_listen`,`references_listen`.`nom_interne` AS `reference_interne_listen`,`equipements_listen`.`nom` AS `nom_listen`,`zones_listen`.`nom` AS `zone_listen` from ((((((`scenarios` left join `equipements_status` on(((`scenarios`.`id_legrand` = `equipements_status`.`id_legrand`) and (`scenarios`.`unit` = `equipements_status`.`unit`)))) left join `equipements` on((`equipements_status`.`id_legrand` = `equipements`.`id_legrand`))) left join (`equipements_status` `equipements_status_listen` left join (`equipements` `equipements_listen` left join `zones` `zones_listen` on((`equipements_listen`.`id_legrand` = `zones_listen`.`id_legrand`))) on((`equipements_status_listen`.`id_legrand` = `equipements_listen`.`id_legrand`))) on(((`scenarios`.`id_legrand_listen` = `equipements_status_listen`.`id_legrand`) and (`scenarios`.`unit_listen` = `equipements_status_listen`.`unit`)))) left join `zones` on((`equipements`.`id_legrand` = `zones`.`id_legrand`))) left join `references` on((`equipements_status`.`ref_unit_legrand` = `references`.`ref_unit_legrand`))) left join `references` `references_listen` on((`equipements_status_listen`.`ref_unit_legrand` = `references_listen`.`ref_unit_legrand`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `view_favoris`
--

/*!50001 DROP TABLE IF EXISTS `view_favoris`*/;
/*!50001 DROP VIEW IF EXISTS `view_favoris`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`boxio`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `view_favoris` AS select `favoris`.`id` AS `id`,`favoris`.`nom` AS `nom`,`favoris`.`trame` AS `trame` from `favoris` order by `favoris`.`nom` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `view_equipements_status`
--

/*!50001 DROP TABLE IF EXISTS `view_equipements_status`*/;
/*!50001 DROP VIEW IF EXISTS `view_equipements_status`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`boxio`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `view_equipements_status` AS select `equipements_status`.`id_legrand` AS `id_legrand`,`equipements_status`.`unit` AS `unit`,concat(`equipements_status`.`id_legrand`,`equipements_status`.`unit`) AS `idunit`,`equipements`.`ref_legrand` AS `ref_legrand`,`equipements`.`nom` AS `equipement`,`references`.`nom` AS `reference`,`references`.`nom_interne` AS `nom_interne`,`references`.`btn` AS `Btn`,`references`.`possibility` AS `possibility`,`equipements_status`.`server_opt` AS `server_opt`,`equipements_status`.`status` AS `status`,`references`.`unit_status` AS `unit_status`,`zones`.`nom` AS `zone`,`equipements_status`.`date` AS `Date` from (((`equipements_status` left join `equipements` on((`equipements_status`.`id_legrand` = `equipements`.`id_legrand`))) left join `zones` on((`equipements`.`id_legrand` = `zones`.`id_legrand`))) left join `references` on((`equipements_status`.`ref_unit_legrand` = `references`.`ref_unit_legrand`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `view_zones`
--

/*!50001 DROP TABLE IF EXISTS `view_zones`*/;
/*!50001 DROP VIEW IF EXISTS `view_zones`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `view_zones` AS select `zones`.`nom` AS `nom` from `zones` group by `zones`.`nom` order by `zones`.`nom` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `view_references`
--

/*!50001 DROP TABLE IF EXISTS `view_references`*/;
/*!50001 DROP VIEW IF EXISTS `view_references`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`boxio`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `view_references` AS select `references`.`ref_legrand` AS `ref_legrand`,`references`.`nom` AS `nom`,`references`.`family` AS `family`,`references`.`media` AS `media` from `references` group by `references`.`ref_legrand` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `view_cron`
--

/*!50001 DROP TABLE IF EXISTS `view_cron`*/;
/*!50001 DROP VIEW IF EXISTS `view_cron`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`boxio`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `view_cron` AS select `cron`.`id` AS `id`,`cron`.`nom` AS `nom`,`cron`.`minutes` AS `minutes`,`cron`.`heures` AS `heures`,`cron`.`jour` AS `jour`,`cron`.`jourSemaine` AS `jourSemaine`,`cron`.`mois` AS `mois`,`cron`.`id_favoris` AS `id_favoris`,`cron`.`id_macro` AS `id_macro`,`cron`.`trame` AS `trame`,`cron`.`active` AS `active` from `cron` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Dumping events for database 'boxio'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2012-12-08 10:44:10
