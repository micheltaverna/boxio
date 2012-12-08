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
-- Dumping events for database 'boxio'
--

--
-- Dumping routines for database 'boxio'
--
/*!50003 DROP PROCEDURE IF EXISTS `add_cron` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50020 DEFINER=`boxio`@`%`*/ /*!50003 PROCEDURE `add_cron`(IN nom_p VARCHAR(64), 
IN minutes_p VARCHAR(256), IN heures_p VARCHAR(128), IN jour_p VARCHAR(128), IN jourSemaine_p VARCHAR(64), IN mois_p VARCHAR(128),
IN id_favoris_p INT(11), IN id_macro_p INT(11), IN trame_p TEXT, IN active_p BIT(1))
add_cron: BEGIN
    #Variables
    DECLARE res INT DEFAULT NULL;
    DECLARE id_favoris_new INT DEFAULT id_favoris_p;
    DECLARE id_macro_new INT DEFAULT id_macro_p;
    DECLARE trame_new TEXT DEFAULT trame_p;
    
    #TEST D'INTEGRITE DE LA DEMANDE
    
    #test de la validite de la macro si NOT NULL
    IF id_macro_p IS NOT NULL THEN
        SELECT COUNT(*) INTO res FROM macros WHERE id_macro=id_macro_p;
        IF res = 0 THEN
            SELECT 'Erreur Id_macro Inconnu' AS Erreur, id_macro_p AS id_macro;
            LEAVE add_cron;
        END IF;
    END IF;

    #test de la validite du favori si NOT NULL
    IF id_favoris_p IS NOT NULL THEN
        SELECT COUNT(*) INTO res FROM favoris WHERE id=id_favoris_p;
        IF res = 0 THEN
            SELECT 'Erreur Id_favoris Inconnu' AS Erreur, id_favoris_p AS id_favoris;
            LEAVE add_cron;
        END IF;
    END IF;

    #test de la trame si NOT NULL (Priorite sur Trame)
    IF trame_p IS NOT NULL THEN
        SELECT NULL INTO id_favoris_new;
        SELECT NULL INTO id_macro_new;
    END IF;

    #test du favoris et de la macros si NOT NULL (Priorite sur favoris)
    IF id_favoris_p IS NOT NULL AND id_macro_p IS NOT NULL THEN
        SELECT NULL INTO id_macro_new;
    END IF;

    #AJOUT DE LA CRON
    INSERT INTO cron SET nom=nom_p, minutes=minutes_p, heures=heures_p, jour=jour_p, jourSemaine=jourSemaine_p, mois=mois_p,
    id_favoris=id_favoris_new, id_macro=id_macro_new, trame=trame_new, active=active_p
    ON DUPLICATE KEY UPDATE minutes=minutes_p, heures=heures_p, jour=jour_p, jourSemaine=jourSemaine_p, mois=mois_p,
    id_favoris=id_favoris_new, id_macro=id_macro_new, trame=trame_new, active=active_p;
    
    #On retourne la cron complete
    SELECT * FROM view_cron WHERE nom=nom_p;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `add_equipement` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50020 DEFINER=`legrand`@`%`*/ /*!50003 PROCEDURE `add_equipement`(IN id_legrand_p INT, IN ref_legrand_p INT, IN nom_p VARCHAR(64), IN zone_p VARCHAR(64))
add_equipement: BEGIN
    #Variables
    DECLARE i INT DEFAULT 1;
    DECLARE res INT DEFAULT 0;
    DECLARE ref_exist INT DEFAULT NULL;

    #Test si la reference exist
    SELECT DISTINCT ref_legrand INTO ref_exist FROM legrand.references WHERE ref_legrand=ref_legrand_p;
    IF ref_exist IS NULL THEN
        SELECT 'Erreur Référence' AS Erreur, ref_legrand_p AS ref_legrand;
        LEAVE add_equipement;
    END IF;

    #On insert dans equipements
    INSERT INTO equipements SET id_legrand=id_legrand_p,ref_legrand=ref_legrand_p,nom=nom_p
    ON DUPLICATE KEY UPDATE ref_legrand=ref_legrand_p,nom=nom_p;

    #On insert dans zones
    INSERT INTO zones SET id_legrand=id_legrand_p,nom=zone_p
    ON DUPLICATE KEY UPDATE nom=zone_p;
    
    #On recupere le nombre de unit
    SELECT COUNT(*) INTO res FROM legrand.references WHERE ref_legrand=ref_legrand_p;
 
    WHILE i <= res DO
        #On insert dans equipements_status
        INSERT IGNORE INTO legrand.equipements_status SET id_legrand=id_legrand_p,unit=i,ref_unit_legrand=CONCAT(ref_legrand_p,i);
        SET i = i + 1;
    END WHILE;
    
    #On affiche les elements ajoutes
    SELECT * FROM legrand.view_equipements_status WHERE id_legrand=id_legrand_p;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `add_favoris` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50020 DEFINER=`boxio`@`%`*/ /*!50003 PROCEDURE `add_favoris`(IN nom_p VARCHAR(64), IN trame_p TEXT)
add_favoris: BEGIN
    #On insert dans favoris
    INSERT INTO favoris SET nom=nom_p,trame=trame_p
    ON DUPLICATE KEY UPDATE trame=trame_p;
        
    #On affiche les elements ajoutes
    SELECT * FROM boxio.view_favoris WHERE nom=nom_p;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `add_macro` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50020 DEFINER=`boxio`@`%`*/ /*!50003 PROCEDURE `add_macro`(
IN id_command_p INT, 
IN id_macro_p INT, 
IN nom_p VARCHAR(64), 
IN id_favoris_p INT, 
IN trame_p TEXT, 
IN timing_p INT)
add_macro: BEGIN
    #Variables
    DECLARE res INT DEFAULT NULL;
    DECLARE action VARCHAR(32) DEFAULT 'ERREUR';
    DECLARE id_command_new INT DEFAULT id_command_p;
    DECLARE id_macro_new INT DEFAULT id_macro_p;
    DECLARE nom_new VARCHAR(64) DEFAULT nom_p;
    DECLARE id_favoris_new INT DEFAULT id_favoris_p;
    DECLARE trame_new TEXT DEFAULT trame_p;
    DECLARE timing_new INT DEFAULT timing_p;
    
    #TEST D'INTEGRITE DE LA DEMANDE
    
    #Test si l'id existe
    IF id_macro_p IS NOT NULL AND id_command_p IS NOT NULL THEN
        SELECT COUNT(*) INTO res FROM boxio.macros WHERE id_macro=id_macro_p;
        IF res = 0 THEN
            SELECT 'Erreur id_macro Inconnu' AS Erreur, id_macro_p AS id_macro;
            LEAVE add_macro;
        END IF;
    END IF;
    
    #test de la command si NOT NULL pour la modifier
    IF id_command_p IS NOT NULL THEN
        SELECT COUNT(*) INTO res FROM macros WHERE id=id_command_p;
        IF res = 0 THEN
            SELECT 'Erreur Commande Inconnu' AS Erreur, id_command_p AS 'Commande';
            LEAVE add_macro;
        END IF;
        IF id_macro_p IS NULL THEN
            SELECT id_macro INTO id_macro_new FROM macros WHERE id=id_command_p;
        END IF;
    END IF;
    
    #test de la validite du favori si NOT NULL
    IF id_favoris_p IS NOT NULL THEN
        SELECT COUNT(*) INTO res FROM favoris WHERE id=id_favoris_p;
        IF res = 0 THEN
            SELECT 'Erreur Id_favoris Inconnu' AS Erreur, id_favoris_p AS id_favoris;
            LEAVE add_macro;
        END IF;
    END IF;

    #test de la trame si favoris et trame NOT NULL (Priorite sur Trame)
    IF id_favoris_p IS NOT NULL AND trame_p IS NOT NULL THEN
        SELECT NULL INTO id_favoris_new;
    END IF;

    #MODIFICATION COMMAND
    IF id_macro_new IS NOT NULL AND id_command_new IS NOT NULL THEN
        #Mise a jour de l'etat
        SELECT 'MODIFICATION' INTO action;

        #Si timing NULL mise a 0
        IF timing_new IS NULL THEN
            SELECT 0 INTO timing_new;
        END IF;
        
        #Si nom NULL pas de mise 
        IF nom_new IS NULL THEN
            SELECT nom INTO nom_new FROM macros WHERE id=id_command_new;
        END IF;
        
        #Mise a jour de la commande
        UPDATE boxio.macros SET id_favoris=id_favoris_new, trame=trame_new, timing=timing_new WHERE id=id_command_new;
        
        #Mise a jour du nom sur la macro complete (toute les commandes associees)
        IF nom_p IS NOT NULL THEN
            UPDATE boxio.macros SET nom=nom_new WHERE id_macro=id_macro_new;
        END IF;
        
    END IF;

    #AJOUT COMMAND
    IF id_macro_new IS NOT NULL AND id_command_new IS NULL THEN
        #Mise a jour de l'etat
        SELECT 'AJOUT' INTO action;

        #Si timing NULL mise a 0
        IF timing_new IS NULL THEN
            SELECT 0 INTO timing_new;
        END IF;
        
        #Si nom NULL on le recupere
        IF nom_new IS NULL THEN
            SELECT DISTINCT nom INTO nom_new FROM macros WHERE id_macro=id_macro_new;
        END IF;
        
        #Creation de la macro
        INSERT INTO macros SET id_macro=id_macro_new, nom=nom_new, id_favoris=id_favoris_new, trame=trame_new, timing=timing_new;
        
        #Mise a jour du nom sur la macro complete
        UPDATE macros SET nom=nom_new WHERE id_macro=id_macro_new;
        
    END IF;

    #CREATION NOUVELLE MACRO
    IF id_macro_new IS NULL THEN
        #Mise a jour de l'etat
        SELECT 'CREATION' INTO action;
    
        #Selection du dernier id
        SELECT IFNULL(MAX(id_macro)+1, 1) INTO id_macro_new FROM boxio.macros;

        #Si nom NULL creation d'un nom
        IF nom_new IS NULL THEN
            SELECT CONCAT('MACRO_',id_macro_new) INTO nom_new;
        END IF;
        
        #Si timing NULL mise a 0
        IF timing_new IS NULL THEN
            SELECT 0 INTO timing_new;
        END IF;

        #Creation de la macro
        INSERT INTO boxio.macros SET id_macro=id_macro_new, nom=nom_new, id_favoris=id_favoris_new, trame=trame_new, timing=timing_new;

    END IF;
    
    #On retourne la macro complete
    SELECT action, id_command, id_macro, nom, id_favoris, trame, timing FROM view_macros WHERE id_macro=id_macro_new;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `add_scenario` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50020 DEFINER=`boxio`@`%`*/ /*!50003 PROCEDURE `add_scenario`(IN id_legrand_p INT, IN unit_p TINYINT, 
IN id_legrand_listen_p INT, IN unit_listen_p TINYINT, IN value_listen_p INT, IN family_listen_p INT)
add_scenario: BEGIN
    #Variables
    DECLARE ref_exist INT DEFAULT NULL;
    DECLARE ref_listen_exist INT DEFAULT NULL;

    #Test si la reference exist
    SELECT boxio.references.ref_legrand INTO ref_exist FROM boxio.references 
        LEFT JOIN boxio.equipements 
        ON boxio.equipements.ref_legrand=boxio.references.ref_legrand 
        WHERE boxio.equipements.id_legrand=id_legrand_p AND boxio.references.unit=unit_p AND boxio.references.possibility LIKE '%MEMORY%';
    IF ref_exist IS NULL THEN
        SELECT 'Erreur Référence ou unit non programmable/inconnu' AS Erreur, id_legrand_p AS id_legrand, unit_p AS unit;
        LEAVE add_scenario;
    END IF;
    
    #Test si la reference d'ecoute exist
    SELECT boxio.references.ref_legrand INTO ref_listen_exist FROM boxio.references 
        LEFT JOIN boxio.equipements 
        ON boxio.equipements.ref_legrand=boxio.references.ref_legrand 
        WHERE boxio.equipements.id_legrand=id_legrand_listen_p AND boxio.references.unit=unit_listen_p AND boxio.references.possibility LIKE '%COMMAND%';
    IF ref_listen_exist IS NULL THEN
        SELECT 'Erreur Référence ou unit non programmable/inconnu' AS Erreur, id_legrand_listen_p AS id_legrand_listen, unit_listen_p AS unit_listen;
        LEAVE add_scenario;
    END IF;

    #On ajoute le scenario
    INSERT INTO boxio.scenarios SET 
        id_legrand=id_legrand_p,unit=unit_p,
        id_legrand_listen=id_legrand_listen_p,unit_listen=unit_listen_p,value_listen=value_listen_p,family_listen=family_listen_p
    ON DUPLICATE KEY UPDATE value_listen=value_listen_p,family_listen=family_listen_p;
    
    #On retourne le scenario enregistré
    SELECT * FROM boxio.view_scenarios WHERE id_legrand=id_legrand_p AND unit=unit_p 
    AND id_legrand_listen=id_legrand_listen_p AND unit_listen=unit_listen_p;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `delete_old_trame` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50020 DEFINER=`root`@`localhost`*/ /*!50003 PROCEDURE `delete_old_trame`()
BEGIN
DELETE FROM boxio.trame, boxio.trame_decrypted 
USING boxio.trame INNER JOIN boxio.trame_decrypted 
WHERE boxio.trame.id=boxio.trame_decrypted.id_trame AND boxio.trame.date < DATE_SUB(NOW(), INTERVAL 1 YEAR);
PURGE MASTER LOGS BEFORE NOW();
PURGE BINARY LOGS BEFORE NOW();
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `del_cron` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50020 DEFINER=`boxio`@`%`*/ /*!50003 PROCEDURE `del_cron`(IN id_cron_p INT(11))
BEGIN
    #On affiche la suppression
    SELECT * FROM boxio.view_cron WHERE boxio.view_cron.id=id_cron_p;

    #On supprime le cron
    DELETE FROM boxio.cron WHERE boxio.cron.id=id_cron_p;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `del_equipement` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50020 DEFINER=`boxio`@`%`*/ /*!50003 PROCEDURE `del_equipement`(IN id_legrand_p INT)
BEGIN
    #On supprime tous les equipements_status
    DELETE FROM boxio.equipements_status WHERE id_legrand=id_legrand_p;

    #On supprime tous les equipements
    DELETE FROM boxio.equipements WHERE id_legrand=id_legrand_p;

    #On retourne les id_legrand concernés par la suppression (pour effacer les memory si necessaire)
    SELECT DISTINCT id_legrand AS 'id_legrand_listen' FROM boxio.scenarios WHERE id_legrand_listen=id_legrand_p;

    #On supprime tous les scenarios
    DELETE FROM boxio.scenarios WHERE id_legrand=id_legrand_p OR id_legrand_listen=id_legrand_p;
    
    #On supprime les zones ou apparait l'id
    DELETE FROM boxio.zones WHERE id_legrand=id_legrand_p;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `del_favoris` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50020 DEFINER=`boxio`@`%`*/ /*!50003 PROCEDURE `del_favoris`(IN id_p INT)
BEGIN
    #On recupere l'id et la trame du favoris
    SELECT boxio.favoris.trame INTO @trame_favoris FROM boxio.favoris WHERE boxio.favoris.id=id_p;

    #On met a jour les macros
    UPDATE boxio.macros SET boxio.macros.id_favoris=NULL, boxio.macros.trame=@trame_favoris WHERE boxio.macros.id_favoris=id_p;
    
    #On met a jour les cron
    UPDATE boxio.cron SET boxio.cron.id_favoris=NULL, boxio.cron.trame=@trame_favoris WHERE boxio.cron.id_favoris=id_p;

    #On affiche la suppression
    SELECT * FROM boxio.view_favoris WHERE boxio.view_favoris.id=id_p;

    #On supprime le favoris
    DELETE FROM boxio.favoris WHERE boxio.favoris.id=id_p;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `del_macro` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50020 DEFINER=`boxio`@`%`*/ /*!50003 PROCEDURE `del_macro`(IN id_macro_p INT, IN id_command_p INT)
del_macro: BEGIN
    #Variables
    DECLARE id_macro_new INT DEFAULT id_macro_p;
    DECLARE res INT DEFAULT NULL;
    
    #test de la maco
    IF id_macro_p IS NOT NULL THEN
        SELECT COUNT(*) INTO res FROM macros WHERE id_macro=id_macro_p;
        IF res = 0 THEN
            SELECT 'Erreur id_macro Inconnu' AS Erreur, id_command_p AS 'Macro';
            LEAVE del_macro;
        END IF;
    END IF;

    #test de la command
    IF id_command_p IS NOT NULL THEN
        SELECT COUNT(*) INTO res FROM macros WHERE id=id_command_p;
        IF res = 0 THEN
            SELECT 'Erreur Commande Inconnu' AS Erreur, id_command_p AS 'Commande';
            LEAVE del_macro;
        END IF;
        IF id_macro_p IS NULL THEN
            SELECT id_macro INTO id_macro_new FROM macros WHERE id=id_command_p;
        END IF;
    END IF;
    
    #supression de la commmande uniquement
    IF id_command_p IS NOT NULL THEN
        SELECT * FROM view_macros WHERE id_macro=id_macro_new AND id_command=id_command_p;
        DELETE FROM boxio.macros WHERE id_macro=id_macro_new AND id=id_command_p;
    #supression de la macro complete
    ELSEIF id_macro_p IS NOT NULL AND id_command_p IS NULL THEN
        SELECT * FROM view_macros WHERE id_macro=id_macro_new;
        DELETE FROM boxio.macros WHERE id_macro=id_macro_new;
        #On met a jour les cron
        UPDATE boxio.cron SET boxio.cron.id_macro=NULL WHERE boxio.cron.id_macro=id_macro_new;
    END IF;
        
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `del_scenario` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50020 DEFINER=`boxio`@`%`*/ /*!50003 PROCEDURE `del_scenario`(IN id_legrand_p INT, IN unit_p TINYINT, IN id_legrand_listen_p INT, IN unit_listen_p TINYINT)
BEGIN
    #On retourne les elements a effacer
    SELECT * FROM boxio.view_scenarios 
    WHERE id_legrand=id_legrand_p AND unit=unit_p AND id_legrand_listen=id_legrand_listen_p AND unit_listen=unit_listen_p;
    
    #On efface les enregistrements
    DELETE FROM boxio.scenarios WHERE id_legrand=id_legrand_p AND unit=unit_p AND id_legrand_listen=id_legrand_listen_p AND unit_listen=unit_listen_p;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `find_reference` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50020 DEFINER=`boxio`@`%`*/ /*!50003 PROCEDURE `find_reference`(IN id_legrand_p INT(11))
find_reference: BEGIN
    #Variables
    DECLARE id_iobl INT DEFAULT NULL;
    DECLARE res INT DEFAULT NULL;
    DECLARE reference INT DEFAULT NULL;
    DECLARE reference_geree VARCHAR(5) DEFAULT NULL;
    
    SELECT id_legrand_p*16+0 INTO id_iobl;

    #Envoie de la requete pour interroger le status
    CALL send_trame(CONCAT('*#1000*',id_iobl,'*51##'), NOW());
    SELECT SLEEP(2);
    SELECT HEX(CAST(SUBSTRING_INDEX(param, '*', 1) AS SIGNED)) INTO reference FROM boxio.view_all_trame WHERE id_legrand=id_legrand_p AND unit='0' AND dimension='DEVICE_DESCRIPTION_STATUS' LIMIT 1;
 
    IF reference IS NULL THEN
        CALL send_trame(CONCAT('*#1000*',id_iobl,'*51##'), NOW());
        SELECT SLEEP(2);
        SELECT HEX(CAST(SUBSTRING_INDEX(param, '*', 1) AS SIGNED)) INTO reference FROM boxio.view_all_trame WHERE id_legrand=id_legrand_p AND unit='0' AND dimension='DEVICE_DESCRIPTION_STATUS' LIMIT 1;
    END IF;
    
    IF reference IS NULL THEN
        SELECT 'Erreur Reference Introuvable' AS Erreur, id_legrand_p AS id_legrand;
        LEAVE find_reference;
    END IF;
    
    SELECT IF(COUNT(ref_legrand)=1, 'TRUE', 'FALSE') INTO reference_geree FROM view_references WHERE ref_legrand=reference;
    SELECT reference AS reference, id_legrand_p AS id_legrand, reference_geree AS reference_geree;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `send_favoris` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50020 DEFINER=`boxio`@`%`*/ /*!50003 PROCEDURE `send_favoris`(IN id_nom_p VARCHAR(64))
send_favoris: BEGIN
    DECLARE nom VARCHAR(64) DEFAULT NULL;
    DECLARE trame TEXT DEFAULT NULL;

    #Recuperation de la trame et du nom
    #TODO AMELIORER LA VERIFICATION ENTRE INT ET VARCHAR
    SELECT boxio.favoris.trame, boxio.favoris.nom INTO trame, nom FROM boxio.favoris WHERE boxio.favoris.nom=id_nom_p;
    IF nom IS NULL THEN
        SELECT boxio.favoris.trame, boxio.favoris.nom INTO trame, nom FROM boxio.favoris WHERE boxio.favoris.id=id_nom_p;
    END IF;

    #Test si le favoris existe
    IF nom IS NULL THEN
        SELECT 'Erreur Favoris Inconnu' AS Erreur, id_nom_p AS favoris;
        LEAVE send_favoris;
    END IF;

    #Affichage des resultats
    SELECT nom AS 'nom', trame AS 'trame';
    
    #Ajout de la commande dans la base pour envoie
    INSERT INTO boxio.trame_standby (trame) VALUES (trame);
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `send_macro` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50020 DEFINER=`boxio`@`%`*/ /*!50003 PROCEDURE `send_macro`(IN id_macro_p INT)
BEGIN
    #Affichage de la macro
    SELECT * FROM view_macros WHERE id_macro=id_macro_p;

    #Ajout de la commande dans la base pour envoie
    INSERT INTO legrand.trame_standby (trame, date) 
    SELECT 
    IF(macros.trame IS NULL, favoris.trame, macros.trame),
    DATE_ADD(NOW(), INTERVAL macros.timing SECOND)
FROM 
    macros
    LEFT JOIN favoris ON favoris.id = macros.id_favoris
WHERE
    macros.id_macro = id_macro_p
ORDER BY macros.timing ASC;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `send_trame` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50020 DEFINER=`boxio`@`%`*/ /*!50003 PROCEDURE `send_trame`(IN trame_p VARCHAR(50), IN date_p TIMESTAMP)
BEGIN
    #TODO : ajouter une verification de la taille de la table et la flush si trop de trame ou trame vieille
    SELECT trame_p AS 'trame';
    INSERT INTO boxio.trame_standby (trame, date) VALUES (trame_p, date_p);
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2012-12-08 10:43:36
