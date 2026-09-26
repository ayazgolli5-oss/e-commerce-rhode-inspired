-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : sam. 26 sep. 2026 à 18:53
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `rhode`
--

-- --------------------------------------------------------

--
-- Structure de la table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `category` varchar(50) DEFAULT NULL,
  `stock` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `featured` tinyint(1) NOT NULL DEFAULT 0,
  `label` varchar(50) DEFAULT NULL,
  `rating` decimal(2,1) DEFAULT 5.0,
  `review_count` int(11) DEFAULT 0,
  `tagline` varchar(100) DEFAULT NULL,
  `badge` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `products`
--

INSERT INTO `products` (`id`, `name`, `description`, `price`, `image`, `category`, `stock`, `created_at`, `featured`, `label`, `rating`, `review_count`, `tagline`, `badge`) VALUES
(1, 'peptide lip tint', 'A hydrating lip tint with a sheer wash of color.', 20.00, 'images/liptint.webp', 'lips', 50, '2026-09-25 20:53:51', 0, 'tint', 5.0, 0, 'Sheer color, glossy finish', 'bestseller'),
(3, 'pocket pearl', 'A pearly highlighter for a glazed glow.', 24.00, 'images/monacomain.webp', 'cheeks', 30, '2026-09-25 20:53:51', 0, 'pearl', 5.0, 0, 'A soft shimmering flush', 'new'),
(4, 'pocket bronzer', 'A creamy bronzer for a sun-kissed look.', 25.00, 'images/bronze.webp', 'cheeks', 30, '2026-09-25 20:53:51', 1, 'bronzer', 4.8, 214, 'long-wearing warmth ', NULL),
(5, 'highlight milk', 'A liquid highlighter that melts into skin.', 28.00, 'images/highlight.webp', 'cheeks', 25, '2026-09-25 20:53:51', 1, 'highlight', 4.7, 181, 'Liquid glow for everywhere', NULL),
(6, 'glazing milk', 'A lightweight essence that preps the skin barrier.', 32.00, 'images/glazingmilk.webp', 'skin', 45, '2026-09-25 20:53:51', 0, 'milk', 5.0, 0, 'Barrier-prepping essence', NULL),
(8, 'spotwear', 'Invisible patches for breakouts.', 17.00, 'images/spotwear.webp', 'skin', 60, '2026-09-25 20:53:51', 0, 'spotwear', 5.0, 0, 'Invisible breakout patches', NULL),
(9, 'flutter charm', 'A cute charm to decorate your phone case.', 15.00, 'images/fluttercharm.webp', 'accessories', 20, '2026-09-25 20:53:51', 0, 'charm', 5.0, 0, 'A little phone accessory', NULL),
(11, 'pocket blush', 'A creamy blush stick for a natural flush.', 25.00, 'images/blush.webp', 'cheeks', 40, '2026-09-25 21:20:16', 1, 'blush', 4.9, 7398, 'Buildable cream blush', 'bestseller'),
(14, 'rhode mirror', 'The compact mirror', 24.00, 'images/mirror.webp', 'shop.all', 40, '2026-09-26 16:50:05', 0, 'MIRROR', 4.8, 278, 'the compact mirror', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('customer','admin') NOT NULL DEFAULT 'customer',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `email`, `password_hash`, `role`, `created_at`) VALUES
(1, 'ayazgolly@gmail.com', '$2b$10$KGieQK4uzI.RIUkmyDH.DeFkAwxZLJDbC9qrSfk6ZZvfQqdvNmn6y', 'customer', '2026-09-25 18:55:18');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
