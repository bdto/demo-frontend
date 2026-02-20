import styles from './FormInput.module.css';

export default function FormInput({ label, error, className, ...props }) {
  const isSelect = props.as === 'select';
  const Component = isSelect ? 'select' : 'input';
  const { as, children, ...rest } = props;

  return (
    <div className={`${styles.group} ${className || ''}`}>
      {label && <label className={styles.label} htmlFor={rest.id || rest.name}>{label}</label>}
      <Component
        className={`${styles.input} ${isSelect ? styles.select : ''} ${error ? styles.inputError : ''}`}
        id={rest.id || rest.name}
        {...rest}
      >
        {children}
      </Component>
    </div>
  );
}
