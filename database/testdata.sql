/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

# Dump of table availability
# ------------------------------------------------------------

LOCK TABLES `availability` WRITE;
/*!40000 ALTER TABLE `availability` DISABLE KEYS */;

INSERT INTO `availability` (`availability_id`, `person_id`, `from_date`, `to_date`)
VALUES
	(1,2,'2014-02-23','2014-05-25'),
	(2,2,'2014-07-10','2014-08-10');

/*!40000 ALTER TABLE `availability` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table competence
# ------------------------------------------------------------

LOCK TABLES `competence` WRITE;
/*!40000 ALTER TABLE `competence` DISABLE KEYS */;

INSERT INTO `competence` (`competence_id`, `name_sv`, `name_en`, `name_en_gb`)
VALUES
	(1,'Korvgrillning','Sausage grill','Sausage grill'),
	(2,'Karuselldrift','Carousel operation','Carousel operation');

/*!40000 ALTER TABLE `competence` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table competence_profile
# ------------------------------------------------------------

LOCK TABLES `competence_profile` WRITE;
/*!40000 ALTER TABLE `competence_profile` DISABLE KEYS */;

INSERT INTO `competence_profile` (`competence_profile_id`, `person_id`, `competence_id`, `years_of_experience`)
VALUES
	(1,2,1,3.50),
	(2,2,2,2.00);

/*!40000 ALTER TABLE `competence_profile` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table person
# ------------------------------------------------------------

LOCK TABLES `person` WRITE;
/*!40000 ALTER TABLE `person` DISABLE KEYS */;

INSERT INTO `person` (`person_id`, `name`, `surname`, `ssn`, `email`, `password`, `role_id`, `username`, `application_date`, `application_status`, `application_reviewed_at`)
VALUES
	(1,'Greta','Borg','19800101-1234','greta.borg@kth.se','$2a$10$FmJB8TJ3HE39oul8ZZt.U.mEnyMi4NaCBWjBgKvQrhPkMYYFgNh0e',1,'borg',NULL,NULL,NULL),
	(2,'Per','Strand','19671212-1211','per@strand.kth.se','$2a$10$uBbXS.6ITW5hiY2amti3BOtzXVIIEFUcsHE9CJmmZkVcHPGpNnFfK',2,'strand','2019-02-14','unhandled',NULL);

/*!40000 ALTER TABLE `person` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table role
# ------------------------------------------------------------

LOCK TABLES `role` WRITE;
/*!40000 ALTER TABLE `role` DISABLE KEYS */;

INSERT INTO `role` (`role_id`, `name`)
VALUES
	(1,'recruiter'),
	(2,'applicant');

/*!40000 ALTER TABLE `role` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
