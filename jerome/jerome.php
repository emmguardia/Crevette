
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Jerome portefolio</title>
    <!--lien vers css-->
    <link rel="stylesheet" href="jerome.css">
    <?php
        header("refresh: ");
        ?>
</head>
<body>
    <div class="background"></div>

    <div class="center-panel">
        <h2>PERRIN Jerome</h2><h3>18 ans</h3>

        <div class="card">
            <?php
            date_default_timezone_set('Europe/Paris');
            ?>
            <div class="highlight">
                <p><strong>Heure :</strong> <?php echo date('H:i:s'); ?></p>
            </div>
        </div>

        <div class="stats">
            <img src="../images/Jerome.PNG" alt="Jerome" style="width: 40%;">
            <p><strong>Qualité :</strong></p>
            <p>developpement / esprit d'equipe</p>
            <br>

            <p><strong>status :</strong></p>
            <p>Développeur dans lentrepise Quick</p>
            <br>

            <p><strong>Réseaux :</strong></p>
            <a href="https://www.linkedin.com">LinkedIn</a> | 
            <a href="mailto:jperrin@guardiaschool.fr">Email</a>
            <br><br>

            <p><strong>niveaux de langue :</strong></p>
            <p>Français: Langue natale </p>
            <p> Anglais: B1 </p>
            <br>

            <p><strong>hobby :</strong></p>
            <p>Skateboard</p>
            <p>Randoné</p>
            <p>Jeux video</p>
        </div>
    </div>


    

    <div class="matrix"></div>
    
</body>
</html>