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
-- Dumping data for table `references`
--

LOCK TABLES `references` WRITE;
/*!40000 ALTER TABLE `references` DISABLE KEYS */;
INSERT INTO `references` VALUES (1,67253,672531,'Inter Centralisé Volet Roulant','SHUTTER','CPL','Monte/Descente/Stop','Commande',1,1,'COMMAND',50,4,'COMMAND=Mouvement volet'),(2,3604,36041,'Interface Somfy','SHUTTER','RF','Groupe Volet 1','Selecteur 1',1,1,'ACTION,MEMORY',50,139,'ACTION=Mouvement volet;MEMORY=Scenarios ou Volets'),(3,3604,36042,'Interface Somfy','SHUTTER','RF','Groupe Volet 2','Selecteur 2',2,2,'ACTION,MEMORY',50,139,'ACTION=Mouvement volet;MEMORY=Scenarios ou Volets'),(4,3604,36043,'Interface Somfy','SHUTTER','RF','Groupe Volet 3','Selecteur 3',3,3,'ACTION,MEMORY',50,139,'ACTION=Mouvement volet;MEMORY=Scenarios ou Volets'),(5,3604,36044,'Interface Somfy','SHUTTER','RF','Groupe Volet 4','Selecteur 4',4,4,'ACTION,MEMORY',50,139,'ACTION=Mouvement volet;MEMORY=Scenarios ou Volets'),(6,3604,36045,'Interface Somfy','SHUTTER','RF','Groupe Volet 5','Selecteur 5',5,5,'ACTION,MEMORY',50,139,'ACTION=Mouvement volet;MEMORY=Scenarios ou Volets'),(7,3604,36046,'Interface Somfy','SHUTTER','RF','Groupe Volet 6','Selecteur 6',6,6,'ACTION,MEMORY',50,139,'ACTION=Mouvement volet;MEMORY=Scenarios ou Volets'),(8,3604,36047,'Interface Somfy','SHUTTER','RF','Groupe Volet 7','Selecteur 7',7,7,'ACTION,MEMORY',50,139,'ACTION=Mouvement volet;MEMORY=Scenarios ou Volets'),(9,3604,36048,'Interface Somfy','SHUTTER','RF','Groupe Volet 8','Selecteur 8',8,8,'ACTION,MEMORY',50,139,'ACTION=Mouvement volet;MEMORY=Scenarios ou Volets'),(10,3604,36049,'Interface Somfy','SHUTTER','RF','Groupe Volet 9','Selecteur 9',9,9,'ACTION,MEMORY',50,139,'ACTION=Mouvement volet;MEMORY=Scenarios ou Volets'),(11,3604,360410,'Interface Somfy','SHUTTER','RF','Groupe Volet 10','Selecteur 10',10,10,'ACTION,MEMORY',50,139,'ACTION=Mouvement volet;MEMORY=Scenarios ou Volets'),(12,3604,360411,'Interface Somfy','SHUTTER','RF','Groupe Volet 11','Selecteur 11',11,11,'ACTION,MEMORY',50,139,'ACTION=Mouvement volet;MEMORY=Scenarios ou Volets'),(13,3604,360412,'Interface Somfy','SHUTTER','RF','Groupe Volet 12','Selecteur 12',12,12,'ACTION,MEMORY',50,139,'ACTION=Mouvement volet;MEMORY=Scenarios ou Volets'),(14,3604,360413,'Interface Somfy','SHUTTER','RF','Groupe Volet 13','Selecteur 13',13,13,'ACTION,MEMORY',50,139,'ACTION=Mouvement volet;MEMORY=Scenarios ou Volets'),(15,3604,360414,'Interface Somfy','SHUTTER','RF','Groupe Volet 14','Selecteur 14',14,14,'ACTION,MEMORY',50,139,'ACTION=Mouvement volet;MEMORY=Scenarios ou Volets'),(16,3604,360415,'Interface Somfy','SHUTTER','RF','Groupe Volet 15','Selecteur 15',15,15,'ACTION,MEMORY',50,139,'ACTION=Mouvement volet;MEMORY=Scenarios ou Volets'),(17,67254,672541,'Inter Centralisé Quadruple Volet Roulant','SHUTTER','CPL','Monte/Descente/Stop Volet 1','Commande 1',1,1,'COMMAND',50,4,NULL),(18,67254,672542,'Inter Centralisé Quadruple Volet Roulant','SHUTTER','CPL','Monte/Descente/Stop Volet 2','Commande 2',2,2,'COMMAND',50,4,NULL),(19,67254,672543,'Inter Centralisé Quadruple Volet Roulant','SHUTTER','CPL','Monte/Descente/Stop Volet 3','Commande 3',3,3,'COMMAND',50,4,NULL),(20,67254,672544,'Inter Centralisé Quadruple Volet Roulant','SHUTTER','CPL','Monte/Descente/Stop Volet 4','Commande 4',4,4,'COMMAND',50,4,NULL),(21,67203,672031,'Inter Simple à voyant','LIGHTING','CPL','ON/OFF','Commande',1,2,'COMMAND',49,1,NULL),(22,67203,672032,'Inter Simple à voyant','LIGHTING','CPL','STATUS','Interne',2,2,'ACTION,STATUS,MEMORY',49,129,NULL),(23,67214,672141,'Inter Variateur 600W','LIGHTING','CPL','ON/OFF','Commande Gauche',1,4,'COMMAND',49,14,NULL),(24,67214,672142,'Inter Variateur 600W','LIGHTING','CPL','+','Commande +',2,4,'COMMAND',49,15,NULL),(25,67214,672143,'Inter Variateur 600W','LIGHTING','CPL','-','Commande -',3,4,'COMMAND',49,15,NULL),(26,67214,672144,'Inter Variateur 600W','LIGHTING','CPL','STATUS','Interne',4,4,'ACTION,STATUS,MEMORY',49,143,NULL),(27,67212,672121,'Inter Variateur 300W','LIGHTING','CPL','ON/OFF','Commande Gauche',1,4,'COMMAND',49,14,NULL),(28,67212,672122,'Inter Variateur 300W','LIGHTING','CPL','+','Commande +',2,4,'COMMAND',49,15,NULL),(29,67212,672123,'Inter Variateur 300W','LIGHTING','CPL','-','Commande -',3,4,'COMMAND',49,15,NULL),(30,67212,672124,'Inter Variateur 300W','LIGHTING','CPL','STATUS','Interne',4,4,'ACTION,STATUS,MEMORY',49,143,NULL),(31,67280,672801,'Inter Scenario 4 action','SCENE','CPL','I','Commande I',1,1,'COMMAND',53,3,'COMMAND=Start et Stop Action Scenario'),(32,67280,672802,'Inter Scenario 4 action','SCENE','CPL','II','Commande II',2,2,'COMMAND',53,3,'COMMAND=Start et Stop Action Scenario'),(33,67280,672803,'Inter Scenario 4 action','SCENE','CPL','III','Commande III',3,3,'COMMAND',53,3,'COMMAND=Start et Stop Action Scenario'),(34,67280,672804,'Inter Scenario 4 action','SCENE','CPL','IIII','Commande IIII',4,4,'COMMAND',53,3,'COMMAND=Start et Stop Action Scenario'),(35,67256,672561,'Inter Centralisé Volet Roulant (orientation lamelles)','SHUTTER','CPL','Monte/Descente/Stop','Commande',1,2,'COMMAND',50,4,'COMMAND=Mouvement volet'),(36,67256,672562,'Inter Centralisé Volet Roulant (orientation lamelles)','SHUTTER','CPL','STATUS','Interne',2,2,'ACTION,STATUS,MEMORY',50,139,'ACTION=Mouvement volet;STATUS=Etat du volet;MEMORY=Scenarios ou Volets'),(37,67442,674421,'Thermostat Programmable','COMFORT','CPL','STATUS','Interne',1,1,'STATUS,COMMAND',51,1,'STATUS=Etat du contacteur;COMMAND=Etat du contacteur'),(38,67442,674422,'Thermostat Programmable','COMFORT','CPL','STATUS','Interne',2,2,'ACTION,STATUS,MEMORY',51,149,'MEMORY=Scenarios pour le changement de mode;STATUS=Etats des modes, tempertaures et sondes;ACTION=Changement de mode et temperatures'),(39,67442,674423,'Thermostat Programmable','COMFORT','CPL','STATUS','Interne',3,3,'STATUS,MEMORY',51,145,'STATUS=inconu'),(40,67442,674424,'Thermostat Programmable','COMFORT','CPL','STATUS','Interne',4,4,'STATUS,MEMORY',51,144,'STATUS=Horloge mais non decrypte'),(41,67442,674425,'Thermostat Programmable','COMFORT','CPL','STATUS','Interne',5,5,'STATUS',51,24,'STATUS=Horloge mais non decrypte'),(42,67204,672041,'Inter Double à voyant','LIGHTING','CPL','ON/OFF Gauche','Commande Gauche',1,3,'COMMAND',55,1,'COMMAND=ON et OFF lumiere Gauche'),(43,67204,672042,'Inter Double à voyant','LIGHTING','CPL','ON/OFF Droite','Commande Droite',2,4,'COMMAND',55,1,'COMMAND=ON et OFF lumiere Droite'),(44,67204,672043,'Inter Double à voyant','LIGHTING','CPL','STATUS','Interne',3,3,'ACTION,STATUS,MEMORY',55,129,NULL),(45,67204,672044,'Inter Double à voyant','LIGHTING','CPL','STATUS','Interne',4,4,'ACTION,STATUS,MEMORY',55,129,NULL),(46,67238,672381,'Inter Double Radio','LIGHTING','RF','ON/OFF Gauche','Commande Gauche',1,1,'COMMAND',55,1,'COMMAND=ON et OFF lumiere Gauche'),(47,67238,672382,'Inter Double Radio','LIGHTING','RF','ON/OFF Droite','Commande Droite',2,2,'COMMAND',55,1,'COMMAND=ON et OFF lumiere Droite'),(48,67262,672621,'Inter Centralisé Volet Roulant Radio','SHUTTER','RF','Monte/Descente/Stop','Commande',1,1,'COMMAND',50,4,'COMMAND=Mouvement volet'),(49,85544,855441,'Inter Centralisé Volet Roulant Sagane Radio','SHUTTER','RF','Monte/Descente/Stop','Commande',1,1,'COMMAND',50,4,'COMMAND=Mouvement volet'),(50,84543,845431,'Inter Individuel Volet Roulant Sagane Radio','SHUTTER','RF','Monte/Descente/Stop','Commande',1,1,'COMMAND',50,4,'COMMAND=Mouvement volet'),(51,67261,672611,'Inter Individuel Volet Roulant Radio','SHUTTER','RF','Monte/Descente/Stop','Commande',1,1,'COMMAND',50,4,'COMMAND=Mouvement volet'),(52,67251,672511,'Inter Individuel Volet Roulant','SHUTTER','CPL','Monte/Descente/Stop','Commande',1,2,'COMMAND',50,4,'COMMAND=Mouvement volet'),(53,67251,672511,'Inter Individuel Volet Roulant','SHUTTER','CPL','STATUS','Interne',2,2,'ACTION,STATUS,MEMORY',50,139,NULL),(54,84526,845261,'Inter Individuel Volet Roulant Sagane','SHUTTER','CPL','Monte/Descente/Stop','Commande',1,2,'COMMAND',50,4,'COMMAND=Mouvement volet'),(55,84526,845262,'Inter Individuel Volet Roulant Sagane','SHUTTER','CPL','STATUS','Interne',2,2,'ACTION,STATUS,MEMORY',50,139,NULL),(56,88215,882151,'Inter Telecommande Scenario 4 actions','SCENE','RF','I','Commande I',1,1,'COMMAND',53,3,'COMMAND=Start et Stop Action Scenario'),(57,88215,882152,'Inter Telecommande Scenario 4 actions','SCENE','RF','II','Commande II',2,2,'COMMAND',53,3,'COMMAND=Start et Stop Action Scenario'),(58,88215,882153,'Inter Telecommande Scenario 4 actions','SCENE','RF','III','Commande III',3,3,'COMMAND',53,3,'COMMAND=Start et Stop Action Scenario'),(59,88215,882154,'Inter Telecommande Scenario 4 actions','SCENE','RF','IIII','Commande IIII',4,4,'COMMAND',53,3,'COMMAND=Start et Stop Action Scenario'),(60,88215,882155,'Inter Telecommande Scenario 4 actions','SCENE','RF','IIIII','Commande IIIII',5,5,'COMMAND',53,3,'COMMAND=Start et Stop Action Scenario'),(61,88215,882156,'Inter Telecommande Scenario 4 actions','SCENE','RF','IIIIII','Commande IIIIII',6,6,'COMMAND',53,3,'COMMAND=Start et Stop Action Scenario'),(62,88202,882021,'Prisinter 2500W','LIGHTING','CPL','ON/OFF','Commande',1,2,'COMMAND',49,1,NULL),(63,88202,882022,'Prisinter 2500W','LIGHTING','CPL','STATUS','Interne',2,2,'ACTION,STATUS,MEMORY',49,129,NULL);
/*!40000 ALTER TABLE `references` ENABLE KEYS */;
UNLOCK TABLES;

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

-- Dump completed on 2012-12-08 10:41:37
