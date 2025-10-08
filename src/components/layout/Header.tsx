import styles from "./Layout.module.css";

export function Header() {
  return (
    <header>
      <div className={styles.hamburgerMenu}>
        <span className={styles.bar}></span>
        <span className={styles.bar}></span>
        <span className={styles.bar}></span>
      </div>
      <h1>Reflections App</h1>
      
    </header>
  );
}
