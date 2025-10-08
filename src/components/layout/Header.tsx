import styles from "./Layout.module.css";

export function Header() {
  return (
    <header className={styles.headerSection}>
      <button className={`btn ${styles.hamburgerMenu}`}>
        <span className={styles.bar}></span>
        <span className={styles.bar}></span>
        <span className={styles.bar}></span>
      </button>
      <h1>Reflections App</h1>
      <div className={styles.headerButtons}>
        <button className={`btn`}>+</button>
      </div>
    </header>
  );
}
