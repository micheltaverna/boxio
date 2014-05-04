USE `boxio`;

--
-- MODIFICATION DES FAVORIS POUR SUPPRIMER LA COLONNE TRAME
--

-- ALTER TABLE `boxio`.`favoris` CHANGE COLUMN `trame` `trame` TEXT NULL;
-- UPDATE favoris SET actions=IF(actions IS NULL,CONCAT('SEND_COMMAND(\'trame\',\'',trame,'\')'),CONCAT('SEND_COMMAND(\'trame\',\'',trame,'\') AND (',actions,')')),trame=NULL WHERE trame IS NOT NULL;



--
-- AJOUT DE LA VERSION EN BASE
--

INSERT INTO `boxio`.`version` (`name`, `release`) VALUES ('Beta 1.3', '2013-07-21 13:35:24');

