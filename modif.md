# Modifications des boutons du jeu

## CSS (quianne.css)

```css
.game-content {
    text-align: center;
    padding: 2rem 0;
}

.game-content form {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    margin-top: 1.5rem;
}

.game-content label {
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.9);
    margin-bottom: 0.5rem;
}

.game-content input[type="text"] {
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 12px;
    padding: 0.8rem 1.2rem;
    color: var(--text);
    font-family: 'Inter', -apple-system, sans-serif;
    font-size: 1rem;
    text-align: center;
    width: 80px;
    transition: var(--trans);
}

.game-content input[type="text"]:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.12);
    border-color: rgba(255, 255, 255, 0.3);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.game-content button {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 100%);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 12px;
    padding: 0.8rem 1.5rem;
    color: var(--text);
    font-family: 'Inter', -apple-system, sans-serif;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: var(--trans);
}

.game-content button:hover {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.12) 100%);
    border-color: rgba(255, 255, 255, 0.3);
}

.game-content button:active {
    transform: scale(0.98);
}

.game-content p {
    font-size: 1.1rem;
    color: rgba(255, 255, 255, 0.9);
    margin: 0.5rem 0;
    line-height: 1.6;
}

.game-content br {
    margin-bottom: 0.5rem;
}
```

## HTML (quianne.php)

```html
<form method="post" action="#game">
    <label>Entrez une lettre :</label>
    <input type="text" name="guess" maxlength="1" required>
    <button type="submit">Essayer</button>
</form>

<form method="post">
    <button type="submit" name="reset">Nouvelle partie</button>
</form>
```
