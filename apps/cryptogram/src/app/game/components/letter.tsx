import styles from './letter.module.scss';

export const Letter = ({letter}:{letter:string}) => {
  return (
    <span className={styles.letter}>{letter}</span>
  )
}