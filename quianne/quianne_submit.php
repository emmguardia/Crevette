<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="quianne_submit.css">
    <title>Contact</title>
</head>
<body>
    <header>
        <div class="header-content">
            <h1>Cyberfolio</h1>
            <nav>
                <ul>
                    <li><a href="quianne.php">Retour</a></li>
                    <li><a href="../projet_de_la_zone.html">Acceuil</a></li>
                </ul>
            </nav>
        </div>
    </header>
<section>
    <h2>Merci ! Votre message a été envoyé.</h2>

</section>
<?php
                $pdo = new PDO('mysql:host=localhost;dbname=cyberfolio', 'root', '');
                $nom = $_POST['nom'];
                $email = $_POST['email'];
                $message = $_POST['message'];

                $sql = "INSERT INTO contacts (nom, email, message) VALUES (?, ?, ?)";
                $stmt = $pdo->prepare($sql);
                $stmt->execute([$nom, $email, $message]);

                ?>
<footer>
        <p>&copy; 2025 Projet Groupe 2 après-midi . Tous droits réservés.</p>
    </footer>
</body>
</html>
