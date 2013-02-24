#! /bin/bash
#
# boxio		mise a jour beta 1.1
#

DATE=`date +%H_%M_%S-%Y%m%d`
UPDATE_DIR_NAME=beta1_1

UPDATE_PATH=/var/www/update
BACKUP_PATH=/var/www/backup

DB_USER=boxio
DB_PASSWORD=legrand
DB_NAME=boxio
DB_PATH_UPDATEVERSION=$UPDATE_PATH/$UPDATE_DIR_NAME/update_version.sql
DB_PATH_BACKUP=$BACKUP_PATH/dump_${DATE}.sql

#Backup des base de donnees
mysqldump --user=$DB_USER --password=$DB_PASSWORD $DB_NAME > $DB_PATH_BACKUP

#Arret des services de boxio
sudo service boxio stop

#Copie/Remplacement des nouveaux fichiers 


#Mise a jours des bases de donnees


#Demarrage des services de boxio
sudo service boxio start

#Mise a jour de la table version
mysql --user=$DB_USER --password=$DB_PASSWORD $DB_NAME < $DB_PATH_UPDATEVERSION

exit 0
