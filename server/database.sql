-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Hôte : db
-- Généré le : lun. 28 sep. 2026 à 22:07
-- Version du serveur : 10.11.19-MariaDB-ubu2204
-- Version de PHP : 8.3.35

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
-- Structure de la table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `full_name` varchar(200) NOT NULL,
  `address` varchar(255) NOT NULL,
  `city` varchar(100) NOT NULL,
  `phone` varchar(30) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `shipping` decimal(10,2) NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `status` enum('pending','shipped','delivered','cancelled') NOT NULL DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `full_name`, `address`, `city`, `phone`, `subtotal`, `shipping`, `total`, `status`, `created_at`) VALUES
(1, 1, 'aya zgolly', '4 rue azmour', 'Kelibia', '20266947', 72.00, 0.00, 72.00, 'delivered', '2026-09-28 11:20:10');

-- --------------------------------------------------------

--
-- Structure de la table `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `unit_price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `quantity`, `unit_price`) VALUES
(1, 1, 3, 1, 24.00),
(2, 1, 1, 1, 20.00),
(3, 1, 5, 1, 28.00);

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
(1, 'peptide lip tint', 'A hydrating lip tint with a sheer wash of color.', 20.00, 'images/liptint.webp', 'lips', 49, '2026-09-25 20:53:51', 0, 'tint', 5.0, 0, 'Sheer color, glossy finish', 'bestseller'),
(3, 'pocket pearl', 'A pearly highlighter for a glazed glow.', 24.00, 'images/monacomain.webp', 'cheeks', 29, '2026-09-25 20:53:51', 0, 'pearl', 5.0, 0, 'A soft shimmering flush', 'new'),
(4, 'pocket bronzer', 'A creamy bronzer for a sun-kissed look.', 25.00, 'images/bronze.webp', 'cheeks', 30, '2026-09-25 20:53:51', 1, 'bronzer', 4.8, 214, 'long-wearing warmth ', NULL),
(5, 'highlight milk', 'A liquid highlighter that melts into skin.', 28.00, 'images/highlight.webp', 'cheeks', 24, '2026-09-25 20:53:51', 1, 'highlight', 4.7, 181, 'Liquid glow for everywhere', NULL),
(6, 'glazing milk', 'A lightweight essence that preps the skin barrier.', 32.00, 'images/glazingmilk.webp', 'skin', 45, '2026-09-25 20:53:51', 0, 'milk', 5.0, 0, 'Barrier-prepping essence', NULL),
(8, 'spotwear', 'Invisible patches for breakouts.', 17.00, 'images/spotwear.webp', 'skin', 60, '2026-09-25 20:53:51', 0, 'spotwear', 5.0, 0, 'Invisible breakout patches', NULL),
(9, 'flutter charm', 'A cute charm to decorate your phone case.', 15.00, 'images/fluttercharm.webp', 'accessories', 20, '2026-09-25 20:53:51', 0, 'charm', 5.0, 0, 'A little phone accessory', NULL),
(11, 'pocket blush', 'A creamy blush stick for a natural flush.', 25.00, 'images/blush.webp', 'cheeks', 40, '2026-09-25 21:20:16', 1, 'blush', 4.9, 7398, 'Buildable cream blush', 'bestseller'),
(14, 'rhode mirror', 'The compact mirror', 24.00, 'images/mirror.webp', 'accessories', 40, '2026-09-26 16:50:05', 0, 'MIRROR', 4.8, 278, 'the compact mirror', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `product_recommendations`
--

CREATE TABLE `product_recommendations` (
  `product_id` int(11) NOT NULL,
  `recommended_id` int(11) NOT NULL,
  `score` decimal(6,4) NOT NULL,
  `rank_pos` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `product_recommendations`
--

INSERT INTO `product_recommendations` (`product_id`, `recommended_id`, `score`, `rank_pos`) VALUES
(1, 3, 0.4139, 2),
(1, 8, 0.4140, 1),
(1, 14, 0.4139, 3),
(3, 4, 0.4339, 3),
(3, 5, 0.4478, 1),
(3, 11, 0.4372, 2),
(4, 3, 0.4339, 1),
(4, 5, 0.4281, 3),
(4, 11, 0.4330, 2),
(5, 3, 0.4478, 1),
(5, 4, 0.4281, 3),
(5, 6, 0.4392, 2),
(6, 4, 0.4133, 3),
(6, 5, 0.4392, 1),
(6, 8, 0.4335, 2),
(8, 5, 0.4210, 2),
(8, 6, 0.4335, 1),
(8, 9, 0.4141, 3),
(9, 1, 0.4137, 3),
(9, 8, 0.4141, 2),
(9, 14, 0.4287, 1),
(11, 3, 0.4372, 1),
(11, 4, 0.4330, 2),
(11, 5, 0.4261, 3),
(14, 3, 0.4142, 2),
(14, 9, 0.4287, 1),
(14, 11, 0.4142, 3);

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('customer','admin') NOT NULL DEFAULT 'customer',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `first_name`, `last_name`, `email`, `password_hash`, `role`, `created_at`) VALUES
(1, 'Aya', 'Admin', 'ayazgolly@gmail.com', '$2b$10$KGieQK4uzI.RIUkmyDH.DeFkAwxZLJDbC9qrSfk6ZZvfQqdvNmn6y', 'admin', '2026-09-25 18:55:18'),
(3, 'aya', 'zgolli', 'ayazgolli5@gmail.com', '$2b$10$jzGFThgmkBZUBrX21yRN7uL8cFcrlBCUMYGTopgku.lQGvh9UFMJe', 'customer', '2026-09-26 17:45:29');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Index pour la table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Index pour la table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `product_recommendations`
--
ALTER TABLE `product_recommendations`
  ADD PRIMARY KEY (`product_id`,`recommended_id`),
  ADD KEY `recommended_id` (`recommended_id`);

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
-- AUTO_INCREMENT pour la table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Contraintes pour la table `product_recommendations`
--
ALTER TABLE `product_recommendations`
  ADD CONSTRAINT `product_recommendations_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `product_recommendations_ibfk_2` FOREIGN KEY (`recommended_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
