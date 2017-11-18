CREATE TABLE IF NOT EXISTS `MonitoredEndpoint` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) NOT NULL,
  `Url` varchar(255) NOT NULL,
  `Created_on` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `Checked_on` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `monitoredInterval` int(11) NOT NULL,
  `User` varchar(255) NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;

CREATE TABLE IF NOT EXISTS `MonitoringResult` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Checked_on` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `http_status` int(11) NOT NULL,
  `payload` TEXT,
  `Url` varchar(255) NOT NULL,
  `monitoredEndpointId` int(11) NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;

CREATE TABLE IF NOT EXISTS `User` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) NOT NULL,
  `Email` varchar(255) NOT NULL,
  `AccessToken` varchar(255) NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;

INSERT IGNORE INTO `User` (`Id`, `Name`, `Email`, `AccessToken`) VALUES
(1, 'Batman', 'batman@jablotron.com', 'YmF0bWFuOnJvYmlu'),
(2, 'Jablotron', 'jablotron@jablotron.com', 'amFibG90cm9uOnRyb24=');