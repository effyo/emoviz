-- phpMyAdmin SQL Dump
-- version 4.5.2
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Jun 27, 2016 at 10:55 
-- Server version: 10.1.9-MariaDB
-- PHP Version: 5.6.15

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `emotionBDD3`
--

-- --------------------------------------------------------

--
-- Table structure for table `Annotation`
--

CREATE TABLE `Annotation` (
  `ID` int(11) NOT NULL,
  `text` varchar(256) CHARACTER SET utf8 NOT NULL,
  `src` varchar(256) CHARACTER SET utf8 NOT NULL,
  `height` double NOT NULL,
  `width` double NOT NULL,
  `x` double NOT NULL,
  `y` double NOT NULL,
  `login` varchar(64) NOT NULL,
  `emotion` varchar(256) DEFAULT NULL,
  `time` varchar(128) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `changePage`
--

CREATE TABLE `changePage` (
  `IDPage` int(11) NOT NULL,
  `direction` varchar(32) NOT NULL,
  `date` varchar(128) NOT NULL,
  `login` varchar(128) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `Identification`
--

CREATE TABLE `Identification` (
  `ID` int(11) NOT NULL,
  `Nom` varchar(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `Questionnaire`
--

CREATE TABLE `Questionnaire` (
  `ID` mediumint(11) NOT NULL,
  `IDNom` int(11) NOT NULL,
  `NBReponse` int(11) NOT NULL,
  `Q1` int(11) NOT NULL,
  `Q2` text NOT NULL,
  `Q3` int(11) NOT NULL,
  `Q4` int(11) NOT NULL,
  `Q5` int(11) NOT NULL,
  `Q6_1` int(11) NOT NULL,
  `Q6_2` int(11) NOT NULL,
  `Q6_3` int(11) NOT NULL,
  `Q6_4` int(11) NOT NULL,
  `Q6_5` int(11) NOT NULL,
  `Q6_6` int(11) NOT NULL,
  `Q6_7` int(11) NOT NULL,
  `Q6_8` int(11) NOT NULL,
  `Q6_9` int(11) NOT NULL,
  `Q7` int(11) NOT NULL,
  `Q8` int(11) NOT NULL,
  `Q9` int(11) NOT NULL,
  `Day` date NOT NULL,
  `beginTime` varchar(32) NOT NULL,
  `endTime` varchar(32) NOT NULL,
  `type` varchar(32) NOT NULL,
  `URL` varchar(128) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Annotation`
--
ALTER TABLE `Annotation`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `changePage`
--
ALTER TABLE `changePage`
  ADD UNIQUE KEY `IDPage` (`IDPage`);

--
-- Indexes for table `Identification`
--
ALTER TABLE `Identification`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `Questionnaire`
--
ALTER TABLE `Questionnaire`
  ADD PRIMARY KEY (`IDNom`,`NBReponse`),
  ADD UNIQUE KEY `Identifiant` (`ID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Annotation`
--
ALTER TABLE `Annotation`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=497;
--
-- AUTO_INCREMENT for table `changePage`
--
ALTER TABLE `changePage`
  MODIFY `IDPage` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=458;
--
-- AUTO_INCREMENT for table `Identification`
--
ALTER TABLE `Identification`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;
--
-- AUTO_INCREMENT for table `Questionnaire`
--
ALTER TABLE `Questionnaire`
  MODIFY `ID` mediumint(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=174;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
