<?php
session_start();

// ----- LOGIQUE DU JEU "TROUVE LE NOMBRE SECRET" -----

// Si le nombre secret n'existe pas encore, on le crée
if (!isset($_SESSION['secret'])) {
    $_SESSION['secret'] = rand(1, 100);
    $_SESSION['essais'] = 0;
}

$message = "";

// Si on reçoit un formulaire
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // Si on clique sur "Rejouer"
    if (isset($_POST['reset'])) {
        unset($_SESSION['secret'], $_SESSION['essais']);
        $_SESSION['secret'] = rand(1, 100);
        $_SESSION['essais'] = 0;
        $message = "Nouvelle partie ! Devine le nouveau nombre 😉";
    }

    // Si le joueur envoie un nombre
    elseif (isset($_POST['nombre'])) {
        $nb = (int) $_POST['nombre'];
        $_SESSION['essais']++;

        if ($nb < $_SESSION['secret']) {
            $message = "C'est PLUS ↑";
        } elseif ($nb > $_SESSION['secret']) {
            $message = "C'est MOINS ↓";
        } else {
            $message = "🎉 Bravo ! Tu as trouvé le nombre <strong>{$_SESSION['secret']}</strong> en <strong>{$_SESSION['essais']}</strong> essais !";
        }
    }
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Jeu – Trouve le nombre secret</title>
    <style>
        body {
            background: #282622;
            color: #fff;
            font-family: Arial, sans-serif;
            text-align: center;
            padding-top: 40px;
        }

        .game-box {
            background:#8d9679;
            padding:20px;
            border-radius:12px;
            max-width:400px;
            margin:auto;
            text-align:center;
            box-shadow:0 10px 30px rgba(0,0,0,0.4);
        }

        input {
            padding:10px;
            width:80%;
            border-radius:8px;
            border:none;
            margin-bottom:10px;
            text-align:center;
        }

        button {
            padding:10px 18px;
            border-radius:8px;
            background:#434842;
            color:white;
            border:none;
            cursor:pointer;
        }

        button:hover {
            background:#363c36;
        }

        a {
            color: #fff;
            text-decoration: underline;
            margin-top: 20px;
            display: inline-block;
        }
    </style>
</head>
<body>

<h1>🎮 Trouve le nombre secret</h1>
<p>Devine un nombre entre <strong>1 et 100</strong>.</p>

<div class="game-box">

    <!-- Affichage message -->
    <?php if($message !== ""): ?>
        <p style="font-size:1.1rem; margin-bottom:1rem;"><?= $message ?></p>
    <?php endif; ?>

    <!-- Si gagné -->
    <?php if($message !== "" && strpos($message, 'Bravo') !== false): ?>
        <form method="post">
            <button type="submit" name="reset">Rejouer 🔄</button>
        </form>

    <!-- Si pas gagné -->
    <?php else: ?>
        <form method="post">
            <input type="number" name="nombre" min="1" max="100" placeholder="Entre un nombre" required>
            <br>
            <button type="submit">Valider ✔</button>
        </form>
    <?php endif; ?>

</div>

<br>
<a href="../projet_de_la_zone.html">⬅ Retour au portfolio</a>

</body>
</html>
