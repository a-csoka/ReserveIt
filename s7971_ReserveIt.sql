-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: mysql.srkhost.eu
-- Létrehozás ideje: 2023. Ápr 10. 01:50
-- Kiszolgáló verziója: 5.7.40-log
-- PHP verzió: 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `s7971_ReserveIt`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `ReserveIt_Accounts`
--

CREATE TABLE `ReserveIt_Accounts` (
  `AccountID` int(11) NOT NULL,
  `Email` text CHARACTER SET utf8 COLLATE utf8_hungarian_ci NOT NULL,
  `Password` text CHARACTER SET utf8 COLLATE utf8_hungarian_ci NOT NULL,
  `FirstName` text CHARACTER SET utf8 COLLATE utf8_hungarian_ci NOT NULL,
  `LastName` text CHARACTER SET utf8 COLLATE utf8_hungarian_ci NOT NULL,
  `PhoneNumber` text NOT NULL,
  `RegistrationDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `LastLoginDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `isEmailValidated` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `ReserveIt_BusinessEmployees`
--

CREATE TABLE `ReserveIt_BusinessEmployees` (
  `AccountID` int(11) NOT NULL,
  `BusinessID` int(11) NOT NULL,
  `isOwner` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `ReserveIt_Businesses`
--

CREATE TABLE `ReserveIt_Businesses` (
  `BusinessID` int(11) NOT NULL,
  `Name` text CHARACTER SET utf8mb4 COLLATE utf8mb4_hungarian_ci NOT NULL,
  `Address` text NOT NULL,
  `RegistrationNumber` text NOT NULL,
  `TaxNumber` text NOT NULL,
  `BusinessEmail` text NOT NULL,
  `BusinessPhone` text NOT NULL,
  `OwnerName` text CHARACTER SET utf8mb4 COLLATE utf8mb4_hungarian_ci NOT NULL,
  `OwnerEmail` text NOT NULL,
  `OwnerPhone` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `ReserveIt_BusinessInvites`
--

CREATE TABLE `ReserveIt_BusinessInvites` (
  `InviterID` int(11) NOT NULL,
  `InvitedID` int(11) NOT NULL,
  `BusinessID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `ReserveIt_ForgottenPasswordData`
--

CREATE TABLE `ReserveIt_ForgottenPasswordData` (
  `AccountID` int(11) NOT NULL,
  `VerificationID` text CHARACTER SET utf8 COLLATE utf8_hungarian_ci NOT NULL,
  `Time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `ReserveIt_Notifications`
--

CREATE TABLE `ReserveIt_Notifications` (
  `ID` int(11) NOT NULL,
  `AccountID` int(11) NOT NULL,
  `BusinessID` int(11) NOT NULL,
  `Text` text CHARACTER SET utf8mb4 COLLATE utf8mb4_hungarian_ci NOT NULL,
  `isNew` tinyint(4) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `ReserveIt_Reservations`
--

CREATE TABLE `ReserveIt_Reservations` (
  `ReservationID` int(11) NOT NULL,
  `Name` text CHARACTER SET utf8mb4 COLLATE utf8mb4_hungarian_ci NOT NULL,
  `ReserverID` int(11) NOT NULL,
  `WorkerID` int(11) NOT NULL,
  `BusinessID` int(11) NOT NULL,
  `Start` datetime NOT NULL,
  `End` datetime NOT NULL,
  `Price` int(11) NOT NULL,
  `Phone` text NOT NULL,
  `Status` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `ReserveIt_VerificationData`
--

CREATE TABLE `ReserveIt_VerificationData` (
  `AccountID` int(11) NOT NULL,
  `VerificationID` text CHARACTER SET utf8 COLLATE utf8_hungarian_ci NOT NULL,
  `Time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `ReserveIt_Accounts`
--
ALTER TABLE `ReserveIt_Accounts`
  ADD PRIMARY KEY (`AccountID`);

--
-- A tábla indexei `ReserveIt_Businesses`
--
ALTER TABLE `ReserveIt_Businesses`
  ADD PRIMARY KEY (`BusinessID`);

--
-- A tábla indexei `ReserveIt_ForgottenPasswordData`
--
ALTER TABLE `ReserveIt_ForgottenPasswordData`
  ADD PRIMARY KEY (`AccountID`);

--
-- A tábla indexei `ReserveIt_Notifications`
--
ALTER TABLE `ReserveIt_Notifications`
  ADD PRIMARY KEY (`ID`);

--
-- A tábla indexei `ReserveIt_Reservations`
--
ALTER TABLE `ReserveIt_Reservations`
  ADD PRIMARY KEY (`ReservationID`);

--
-- A tábla indexei `ReserveIt_VerificationData`
--
ALTER TABLE `ReserveIt_VerificationData`
  ADD PRIMARY KEY (`AccountID`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `ReserveIt_Accounts`
--
ALTER TABLE `ReserveIt_Accounts`
  MODIFY `AccountID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `ReserveIt_Businesses`
--
ALTER TABLE `ReserveIt_Businesses`
  MODIFY `BusinessID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `ReserveIt_Notifications`
--
ALTER TABLE `ReserveIt_Notifications`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `ReserveIt_Reservations`
--
ALTER TABLE `ReserveIt_Reservations`
  MODIFY `ReservationID` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
