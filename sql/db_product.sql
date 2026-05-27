-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 27, 2026 at 07:06 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_product`
--

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`) VALUES
(1, 'Coffee'),
(2, 'Non Coffee'),
(3, 'Manual'),
(4, 'Snacks'),
(5, 'Main');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `price` double NOT NULL,
  `stock` int(11) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `category_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `description`, `price`, `stock`, `image_url`, `category_id`) VALUES
(1, 'Hot Cafe Latte', 'Kopi susu panas dengan rasa creamy.', 25000, 50, 'images/hot-cafe-latte.jpg', 1),
(2, 'Iced Cafe Latte', 'Kopi susu dingin yang segar dan ringan.', 26000, 50, 'images/iced-cafe-latte.jpg', 1),
(3, 'Hot Americano Coffee', 'Kopi hitam panas dengan rasa kuat.', 20000, 50, 'images/hot-americano-coffee.jpg', 1),
(4, 'Iced Matcha Latte', 'Matcha dingin dengan susu yang creamy.', 27000, 50, 'images/iced-matcha-latte.jpg', 2),
(5, 'Hot Chocolate Milk', 'Coklat susu panas dengan rasa manis.', 24000, 50, 'images/hot-chocolate-milk.jpg', 2),
(6, 'Iced Lemon Tea', 'Teh lemon dingin yang segar.', 18000, 50, 'images/iced-lemon-tea.jpg', 2),
(7, 'Hot V60 Coffee', 'Kopi manual panas dengan rasa clean.', 30000, 30, 'images/hot-v60-coffee.jpg', 3),
(8, 'Iced V60 Coffee', 'Kopi manual dingin yang segar.', 32000, 30, 'images/iced-v60-coffee.jpg', 3),
(9, 'Hot Tubruk Coffee', 'Kopi tubruk panas khas Indonesia.', 18000, 30, 'images/hot-tubruk-coffee.jpg', 3),
(10, 'French Fries Original', 'Kentang goreng renyah dengan rasa gurih.', 18000, 40, 'images/french-fries-original.jpg', 4),
(11, 'Chicken Nugget Crispy', 'Nugget ayam crispy untuk camilan ringan.', 22000, 40, 'images/chicken-nugget-crispy.jpg', 4),
(12, 'Toast Bread Chocolate', 'Roti bakar coklat dengan rasa manis.', 20000, 40, 'images/toast-bread-chocolate.jpg', 4),
(13, 'Fried Rice Chicken', 'Nasi goreng ayam dengan bumbu sederhana.', 30000, 25, 'images/fried-rice-chicken.jpg', 5),
(14, 'Chicken Katsu Rice', 'Nasi ayam katsu dengan saus gurih.', 35000, 25, 'images/chicken-katsu-rice.jpg', 5),
(15, 'Spaghetti Bolognese Beef', 'Pasta bolognese dengan daging sapi.', 38000, 25, 'images/spaghetti-bolognese-beef.jpg', 5);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_products_category` (`category_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `fk_products_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
