import styles from "./LoadingSpinner.module.css";

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

export default function LoadingSpinner({ size = 'medium', color = 'var(--color-primary)' }: LoadingSpinnerProps) {
  return (
    <div 
      className={`${styles.spinner} ${styles[size]}`}
      style={{ borderTopColor: color }}
      role="status"
      aria-label="Loading"
    />
  );
}
