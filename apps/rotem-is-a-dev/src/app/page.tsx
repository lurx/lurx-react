import styles from './page.module.scss';

export default function Home() {
  return (
    <main className={styles.wrapper}>
      <div className={styles.card}>
        <h1 className={styles.title}>🧑‍💻 Rotem Horovitz</h1>
        <p className={styles.tagline}>Frontend Dev · React Wizard · Pixel Sorcerer</p>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>🛠️ Tech Stack</h2>
          <ul className={styles.list}>
            <li>React / Next.js</li>
            <li>TypeScript / SCSS Modules</li>
            <li>Anime.js + Nx Monorepo</li>
            <li>Accessibility & Testing-Fu</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>💼 Experience</h2>
          <p className={styles.paragraph}><strong>Frontend Dev @ The Web</strong> (2020–Now)</p>
          <p className={styles.paragraph}>Building clean, testable, animated UIs with a love for maintainable code and component-driven architecture.</p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>📫 Links</h2>
          <p className={styles.paragraph}><a className={styles.link} href="https://github.com/lurx" target="_blank">github.com/lurx</a></p>
        </section>
      </div>
    </main>
  );
}
