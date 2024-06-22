-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : ven. 14 juin 2024 à 02:29
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
-- Base de données : `projet-hamza`
--

-- --------------------------------------------------------

--
-- Structure de la table `permissions`
--

CREATE TABLE `permissions` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `path` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp(),
  `groupName` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `permissions`
--

INSERT INTO `permissions` (`id`, `name`, `path`, `createdAt`, `updatedAt`, `groupName`) VALUES
(1, 'consulter liste rôles', '/role/', '2023-09-03 22:00:00', '2023-09-03 22:00:00', 'Gestion des rôles'),
(2, 'ajouter rôles', '/role/add', '2023-09-03 22:00:00', '2023-09-03 22:00:00', 'Gestion des rôles'),
(3, 'modifier rôles', '/role/:id/edit', '2023-09-03 22:00:00', '2023-09-03 22:00:00', 'Gestion des rôles'),
(4, 'supprimer rôles', '/role/:id/delete', '2023-09-03 22:00:00', '2023-09-03 22:00:00', 'Gestion des rôles'),
(5, 'consulter liste utilisateurs', '/user/', '2023-09-03 22:00:00', '2023-09-03 22:00:00', 'Gestion des utilisateurs'),
(6, 'ajouter utilisateurs', '/user/add', '2023-09-03 22:00:00', '2023-09-03 22:00:00', 'Gestion des utilisateurs'),
(7, 'importer fichiers excels', '/user/importFile', '2023-09-03 22:00:00', '2023-09-03 22:00:00', 'Gestion des utilisateurs'),
(8, 'modifier utilisateurs', '/user/:id/edit', '2023-09-03 22:00:00', '2023-09-03 22:00:00', 'Gestion des utilisateurs'),
(9, 'désactivé comptes utilisateurs', '/user/:id/delete', '2023-09-03 22:00:00', '2023-09-03 22:00:00', 'Gestion des utilisateurs'),
(10, 'réactivé comptes utilisateurs', '/user/:id/restore', '2023-09-03 22:00:00', '2023-09-03 22:00:00', 'Gestion des utilisateurs'),
(11, 'consulter profil', '/user/:id/profile', '2023-09-03 22:00:00', '2023-09-03 22:00:00', 'Gestion des utilisateurs'),
(12, 'consulter détails utilisateur', '/user/:id/getOne', '2023-09-03 22:00:00', '2023-09-03 22:00:00', 'Gestion des utilisateurs'),
(13, 'consulter historique utilisateurs', '/trail/users', '2023-09-03 22:00:00', '2023-09-03 22:00:00', 'Gestion des utilisateurs'),
(14, 'consulter liste projets', '/project/', '2023-09-03 22:00:00', '2023-09-03 22:00:00', 'Gestion des projets'),
(15, 'consulter details projet', '/project/:id/getOne', '2023-09-03 22:00:00', '2023-09-03 22:00:00', 'Gestion des projets'),
(16, 'ajouter projets', '/project/add', '2023-09-03 22:00:00', '2023-09-03 22:00:00', 'Gestion des projets'),
(17, 'modifier projets', '/project/:id/edit', '2023-09-03 22:00:00', '2023-09-03 22:00:00', 'Gestion des projets'),
(18, 'supprimer projets', '/project/:id/delete', '2023-09-03 22:00:00', '2023-09-03 22:00:00', 'Gestion des projets'),
(19, 'consulter historique projet', '/trail/project/:id', '2023-09-03 22:00:00', '2023-09-03 22:00:00', 'Gestion des projets'),
(20, 'affecter collaborateurs au projet\r\n', '/project/:id/affectUsersProject', '2023-09-03 22:00:00', '2023-09-03 22:00:00', 'Gestion des projets'),
(21, 'ajouter phases', '/phase/add', '2023-09-03 22:00:00', '2023-09-03 22:00:00', 'Gestion des phases'),
(22, 'modifier phases', '/phase/:id/edit', '2023-09-03 22:00:00', '2023-09-03 22:00:00', 'Gestion des phases'),
(23, 'supprimer phases', '/phase/:id/delete', '2023-09-03 22:00:00', '2023-09-03 22:00:00', 'Gestion des phases'),
(24, 'ajouter tickets', '/task/add', '2023-09-03 22:00:00', '2023-09-03 22:00:00', 'Gestion des tickets'),
(25, 'ajouter tickets enfants', '/task/addChild/:parentId', '2023-09-03 22:00:00', '2023-09-03 22:00:00', 'Gestion des tickets'),
(26, 'modifier tickets', '/task/:id/edit', '2023-09-03 22:00:00', '2023-09-03 22:00:00', 'Gestion des tickets'),
(27, 'supprimer tickets', '/task/:id/delete', '2023-09-03 22:00:00', '2023-09-03 22:00:00', 'Gestion des tickets'),
(28, 'consulter historique ticket', '/trail/task/:id', '2023-09-03 22:00:00', '2023-09-03 22:00:00', 'Gestion des tickets'),
(29, 'consulter liste évènements', '/meeting/incoming', '2023-09-03 22:00:00', '2023-09-03 22:00:00', 'Gestion des évènements'),
(30, 'consulter calendrier', '/meeting/', '2023-09-03 22:00:00', '2023-09-03 22:00:00', 'Gestion des évènements'),
(31, 'ajouter évènement', '/meeting/add', '2023-09-03 22:00:00', '2023-09-03 22:00:00', 'Gestion des évènements'),
(32, 'modifier évènement', '/meeting/:id/edit', '2023-09-03 22:00:00', '2023-09-03 22:00:00', 'Gestion des évènements'),
(33, 'modifier évènement', '/meeting/:id/delete', '2023-09-03 22:00:00', '2023-09-03 22:00:00', 'Gestion des évènements'),
(34, 'changer status tickets', '/changeStatus', '2023-09-03 22:00:00', '2023-09-03 22:00:00', 'Gestion des tickets'),
(35, 'consulter tableau de board', '/dashboard', '2023-09-03 22:00:00', '2023-09-03 22:00:00', 'Tableau de board'),
(36, 'consulter discussions', '/chat/', '2023-09-03 22:00:00', '2023-09-03 22:00:00', 'Messagerie');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
