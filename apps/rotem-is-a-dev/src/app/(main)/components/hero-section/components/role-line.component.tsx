import { toCodeLike } from '@/app/utils/to-code-like.util';
import styles from '../hero-section.module.scss';
import { heroSectionStrings } from '../hero-section.strings';

export const RoleLine = () => {
  const formattedRole = toCodeLike(heroSectionStrings.role, { prefix: '> ' });
  return (
	<p className={styles.role}>{formattedRole}</p>
)};
