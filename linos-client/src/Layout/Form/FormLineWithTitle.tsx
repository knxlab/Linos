import React from 'react';
import styles from './styles.module.css';

export default function FormLineWithTitle({
  title,
  className,
  children
}: {
  title: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.container + " " + className}>
      <div className={styles.titleContainer}>{title}</div>
      <div className={styles.formElementContainer}>
        {children}
      </div>
    </div>
  )
}