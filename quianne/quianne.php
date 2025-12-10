  <?php
                    session_start();

                    $vocab = ['pomme','alphabet','philippines','sabotage','largeur'];

                    function pendu($vocab) {

                        if (isset($_POST['reset'])) {
                            session_destroy();
                            session_start(); // start fresh
                            $n = rand(0, count($vocab)-1);
                            $_SESSION['mot'] = $vocab[$n];
                            $_SESSION['vie'] = 6;
                            $_SESSION['jeu'] = array_fill(0, strlen($_SESSION['mot']), '_');
                        }

                        // Initialize only once
                        if (!isset($_SESSION['mot'])) {
                            $n = rand(0, count($vocab)-1);
                            $_SESSION['mot'] = $vocab[$n];
                            $_SESSION['vie'] = 6;
                            $_SESSION['jeu'] = array_fill(0, strlen($_SESSION['mot']), '_');
                        }

                        $mot = $_SESSION['mot'];
                        $vie = $_SESSION['vie'];
                        $jeu = $_SESSION['jeu'];

                        // Handle guess BEFORE printing
                        if (isset($_POST['guess'])) {
                            $guess = $_POST['guess'];

                            if (strpos($mot, $guess) != false) {
                                for ($j = 0; $j < strlen($mot); $j++) {
                                    if ($mot[$j] == $guess) {
                                        $jeu[$j] = $guess;
                                    }
                                }
                            } else {
                                $vie--;
                            }

                            // Save updated state
                            $_SESSION['vie'] = $vie;
                            $_SESSION['jeu'] = $jeu;
                        }

                        // Now print the updated state
                        echo "Nombre de vies : $vie <br>";
                        echo implode(" ", $jeu) . "<br>";

                        // Win/Lose check
                        if (!in_array('_', $jeu)) {
                            echo "Bravo, vous avez trouvé le mot : $mot !<br>";
                            session_destroy();
                        } elseif ($vie <= 0) {
                            echo "PERDU ! Le mot était $mot !<br>";
                            session_destroy();
                        }
                    }
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="quianne.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <script src="script.js" defer></script>
    <title>Quianne - Cyberfolio</title>
</head>
<body>
    <header>
        <div class="header-content">
            <h1><a href="../projet_de_la_zone.html">Cyberfolio</a></h1>

            <button id="open-sidebar-button" onclick="openSidebar()">
                <img src="../images/hamburger.png" alt="">
            </button>
            <nav id="navbar">
                <ul>
                    <li><button id="close-sidebar-button" onclick="closeSidebar()"><img src="../images/close.png" alt=""></button></li>
                    <li><a href="#about">À propos</a></li>
                    <li><a href="#projects">Projets</a></li>
                    <li><a href="#game">Jeu</a></li>
                    <li><a href="#contact">Contact</a></li>
                    <li><a href="admin.php"><img src="../images/lock.png" height = "25" width = "30"></a></li>
                </ul>
            </nav>
        </div>
    </header>

    <main>
        <section id="about" class="section about-section">
            <h2>À propos de moi</h2>
            <div class="about-content">
                <div class="pdp-container">
                    <img src="../images/Quianne.PNG" alt="Quianne" class="pdp-img">
                </div>
                <div class="about-text">
                    <p class="intro-text">Bonjour ! Je m'appelle Quianne. J'ai 19 ans, j'aime cuisiner, faire du crochet et parler !</p>
                    <p>Je suis actuellement étudiante chez <strong>Guardia Cybersecurity School</strong>, où je développe mes compétences en cybersécurité et en infrastructure réseau.</p>
                </div>
            </div>
        </section>

        <section id="projects" class="section projects-section">
            <h2>Mes Projets</h2>
            <div class="projects-container">
                <a href="https://nsibranly.fr/membres/quianneQ/" target="_blank" class="project-card">
                    <div class="card-icon">
                        <img src="../images/web.png" alt="Site Web">
                    </div>
                    <h3>Site Web</h3>
                    <p>Découvrez mon portfolio personnel</p>
                </a>
                <div class="project-card">
                    <div class="card-icon network-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="2" y="2" width="8" height="8" rx="1"></rect>
                            <rect x="14" y="2" width="8" height="8" rx="1"></rect>
                            <rect x="2" y="14" width="8" height="8" rx="1"></rect>
                            <rect x="14" y="14" width="8" height="8" rx="1"></rect>
                            <line x1="10" y1="6" x2="14" y2="6"></line>
                            <line x1="10" y1="18" x2="14" y2="18"></line>
                            <line x1="6" y1="10" x2="6" y2="14"></line>
                            <line x1="18" y1="10" x2="18" y2="14"></line>
                        </svg>
                    </div>
                    <h3>Projet Réseau</h3>
                    <p>J'ai conçu et déployé l'infrastructure réseau complète d'une entreprise, incluant la configuration des serveurs, des postes clients, du pare-feu et du routage. J'ai mis en place un système sécurisé avec gestion des droits, accès distant via VPN, et supervision du réseau. Le projet a été réalisé de A à Z, de l'analyse des besoins à la documentation finale.</p>
                </div>
            </div>
        </section>

        <section id="game" class="section game-section">
            <h2>Jeu</h2>
            <div class="game-content">
                    <?php
                    pendu($vocab);
                ?>

                <form method="post" action="#game">
                    <label>Entrez une lettre :</label>
                    <input type="text" name="guess" maxlength="1" required>
                    <button type="submit">Essayer</button>
                </form>
                
                <form method="post">
                    <button type="submit" name="reset">Nouvelle partie</button>
                </form>

  
            </div>
        </section>

        <section id="contact" class="section contact-section">
            <h2>Contact</h2>
            <div class="contact-content">
                <p>Ne me contactez pas je préfère être seule.</p>
                <form method="POST" action="quianne_submit.php">
                     <input type="text" name="nom" placeholder="Votre nom" required>
                     <input type="email" name="email" placeholder="Votre email" required>
                     <textarea name="message" placeholder="Votre message"></textarea>
                     <button type="submit">Envoyer</button>
                </form>

                <div class="contact-info">
                    <div class="contact-item">
                        <span class="contact-label">École</span>
                        <span class="contact-value">Guardia Cybersecurity School</span>
                    </div>
                </div>
            </div>
        </section>
    </main>
    
    <footer>
        <p>&copy; 2025 Projet Groupe 2 après-midi . Tous droits réservés.</p>
    </footer>

</body>
</html>