import styles from "./detail.module.css";

type ProfileDetailProps = {
  label: string;
  value: string;
};

export function ProfileDetail({ label, value }: ProfileDetailProps) {
  return (
    <p className={styles.detail}>
      <span>{label}:</span> {value}
    </p>
  );
}
