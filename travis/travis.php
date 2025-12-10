<?php
$message_sent = false;
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nom = isset($_POST['nom']) ? trim($_POST['nom']) : '';
    $email = isset($_POST['email']) ? trim($_POST['email']) : '';
    $message = isset($_POST['message']) ? trim($_POST['message']) : '';
    
    if (empty($nom) || empty($email) || empty($message)) {
        $error = 'Veuillez remplir tous les champs.';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $error = 'Adresse email invalide.';
    } else {
        try {
            $pdo = new PDO('mysql:host=localhost;dbname=cyberfolio', 'root', '');
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            
            $sql = "INSERT INTO contacts (nom, email, message) VALUES (?, ?, ?)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$nom, $email, $message]);
            
            $message_sent = true;
        } catch (PDOException $e) {
            $error = 'Erreur lors de l\'envoi du message.';
        }
    }
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Portfolio – Travis Arnaud</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="travis.css">
</head>
<body>

<header class="topbar">
    <div class="logo">QU<span>ICK</span></div>
    <nav class="nav-links">
        <a href="../projet_de_la_zone.html">Accueil</a>
        <a href="#about">À propos</a>
        <a href="#skills">Compétences</a>
        <a href="#projects">Projets</a>
        <a href="#contact">Contact</a>
    </nav>
</header>

<main class="main">

    <section class="hero">
        <div class="profile-card">
            <div class="profile-left">
                <img src="../images/travis.PNG" alt="Travis Arnaud" class="avatar">
            </div>
            <div class="profile-right">
                <p class="tag">Chef de projet & Growth</p>
                <h1>Travis Arnaud</h1>
                <p class="age">Âge : 25 ans</p>
                <p class="intro">
                    Passionné par le digital, le développement web et la cybersécurité.
                    J'aime transformer une idée en projet concret : du concept à la mise
                    en ligne, en passant par le design, la technique et la stratégie.
                </p>

                <div class="quick-infos">
                    <div>
                        <span class="label">Spécialité</span>
                        <span class="value">Gestion de projet, Growth & Web</span>
                    </div>
                    <div>
                        <span class="label">Basé à</span>
                        <span class="value">Lyon, France</span>
                    </div>
                    <div>
                        <span class="label">Équipe</span>
                        <span class="value">Quick – Cyber & Web Dev Squad</span>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section id="about" class="section">
        <h2>À propos de moi</h2>
        <p>
            Je suis étudiant en cybersécurité et passionné par tout ce qui touche au web :
            création de sites vitrines, projets orientés business, automatisation, bots
            et optimisation de l'expérience utilisateur. J'aime apprendre en construisant
            des projets réels, tester, ajuster, et surtout voir un projet prendre vie.
        </p>
    </section>

    <section id="skills" class="section">
        <h2>Compétences</h2>
        <div class="skills-grid">
            <div class="skill-card">
                <h3>Gestion de projet</h3>
                <ul>
                    <li>Organisation & planification</li>
                    <li>Suivi des tâches & priorisation</li>
                    <li>Communication avec l'équipe</li>
                    <li>Vision produit & objectifs</li>
                </ul>
            </div>
            <div class="skill-card">
                <h3>Web & Digital</h3>
                <ul>
                    <li>HTML / CSS de sites vitrines</li>
                    <li>WordPress / CMS basiques</li>
                    <li>Landing pages marketing</li>
                    <li>Optimisation conversion (CTA, structure)</li>
                </ul>
            </div>
            <div class="skill-card">
                <h3>Cybersécurité</h3>
                <ul>
                    <li>Bases réseau & infra</li>
                    <li>Découverte vulnérabilités (CTF, labs)</li>
                    <li>Réflexe sécurité sur les projets web</li>
                </ul>
            </div>
        </div>
    </section>

    <section id="projects" class="section">
        <h2>Projets récents</h2>
        <div class="projects-grid">
            <article class="project-card">
                <h3>Site vitrine – Salon de massage</h3>
                <p>
                    Création d'un site vitrine zen et premium : page d'accueil, présentation
                    des services, tarifs et formulaire de contact. Palette de couleurs
                    détente et design responsive.
                </p>
                <span class="tagline">Rôle : structure, contenu & conception</span>
            </article>
            <article class="project-card">
                <h3>Page d'équipe Quick</h3>
                <p>
                    Mise en place d'une page "Notre équipe" avec cartes animées pour chaque
                    membre : Marilou, Jérôme, QuiAnne et Travis. Design moderne type
                    marketing digital.
                </p>
                <span class="tagline">Rôle : intégration HTML/CSS & idées design</span>
            </article>
            <article class="project-card">
                <h3>Projets cybersécurité (labs)</h3>
                <p>
                    Participation à des labs de cybersécurité : configuration de VMs, tests
                    de vulnérabilités, challenges type CTF et apprentissage continu.
                </p>
                <span class="tagline">Rôle : apprentissage & expérimentation</span>
            </article>
        </div>
    </section>

    <section id="contact" class="section contact-section">
        <h2>Me contacter</h2>
        
        <?php if ($message_sent): ?>
            <div class="success-message">
                <p>Message envoyé avec succès ! Je vous répondrai rapidement.</p>
            </div>
        <?php elseif ($error): ?>
            <div class="error-message">
                <p><?php echo htmlspecialchars($error); ?></p>
            </div>
        <?php endif; ?>

        <form method="POST" action="#contact" class="contact-form-section">
            <div class="form-group">
                <label for="nom">Nom complet</label>
                <input type="text" id="nom" name="nom" required value="<?php echo isset($_POST['nom']) ? htmlspecialchars($_POST['nom']) : ''; ?>">
            </div>
            
            <div class="form-group">
                <label for="email">E-mail</label>
                <input type="email" id="email" name="email" required value="<?php echo isset($_POST['email']) ? htmlspecialchars($_POST['email']) : ''; ?>">
            </div>
            
            <div class="form-group">
                <label for="message">Message</label>
                <textarea id="message" name="message" rows="5" required><?php echo isset($_POST['message']) ? htmlspecialchars($_POST['message']) : ''; ?></textarea>
            </div>
            
            <button type="submit" class="submit-btn">Envoyer</button>
        </form>

        <div class="contact-info-section">
            <p><span class="label">E-mail :</span> <span class="value">travis.arnaud@example.com</span></p>
            <p><span class="label">Rôle :</span> <span class="value">Chef de projet / Étudiant cybersécurité</span></p>
        </div>
    </section>

</main>

</body>
</html>

