import type { ReactNode } from 'react';
import { CircleAlert } from 'lucide-react';
import { cx } from '@/lib/format';

export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="field-error">
      <CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
      <span>{message}</span>
    </p>
  );
}

export function Required() {
  return (
    <>
      <span aria-hidden="true" className="ml-0.5 text-(--accent)">
        *
      </span>
      <span className="sr-only"> (pakollinen)</span>
    </>
  );
}

interface GroupProps {
  /** Unique name; also used to derive ids. */
  name: string;
  legend: string;
  required?: boolean;
  hint?: ReactNode;
  error?: string;
  children: ReactNode;
  className?: string;
}

/** A labelled group of choices: native fieldset + legend, with hint and error wired up for assistive tech. */
export function FieldGroup({ name, legend, required, hint, error, children, className }: GroupProps) {
  const hintId = hint ? `${name}-hint` : undefined;
  const errorId = error ? `${name}-error` : undefined;
  return (
    <fieldset
      id={`field-${name}`}
      tabIndex={-1}
      aria-describedby={[hintId, errorId].filter(Boolean).join(' ') || undefined}
      aria-invalid={error ? true : undefined}
      className={cx('min-w-0 scroll-mt-28 outline-none', className)}
    >
      <legend id={`${name}-legend`} className="field-label !mb-0 text-[0.95rem]">
        {legend}
        {required && <Required />}
      </legend>
      {hint && (
        <p id={hintId} className="field-hint !mt-1">
          {hint}
        </p>
      )}
      <div className="mt-3.5">{children}</div>
      <FieldError id={`${name}-error`} message={error} />
    </fieldset>
  );
}

interface ChoiceProps {
  type: 'radio' | 'checkbox';
  name: string;
  value: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  note?: string;
  /** Fill the grid cell instead of sizing to content. */
  block?: boolean;
}

/** Radio or checkbox presented as a large, touch-friendly chip. The native input stays in the DOM for semantics and keyboard use. */
export function Choice({ type, name, value, checked, onChange, label, note, block }: ChoiceProps) {
  return (
    <label className={cx('relative cursor-pointer', block ? 'flex' : 'inline-flex')}>
      <input type={type} name={name} value={value} checked={checked} onChange={(e) => onChange(e.target.checked)} className="peer sr-only" />
      <span className={cx('chip', block && 'w-full', note && 'flex-col !items-start !justify-center !gap-0.5 !rounded-2xl !px-4 !py-2.5 text-left')}>
        <span>{label}</span>
        {note && <span className="text-[0.76rem] font-normal opacity-70">{note}</span>}
      </span>
    </label>
  );
}

interface TextFieldProps {
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  required?: boolean;
  error?: string;
  hint?: ReactNode;
  type?: 'text' | 'email' | 'tel';
  autoComplete?: string;
  inputMode?: 'text' | 'email' | 'tel';
  multiline?: boolean;
  maxLength?: number;
  placeholder?: string;
  className?: string;
}

/** Labelled text input (or textarea) with hint and error wired to aria-describedby. Its id is `field-<name>`. */
export function TextField({
  name,
  label,
  value,
  onChange,
  onBlur,
  required,
  error,
  hint,
  type = 'text',
  autoComplete,
  inputMode,
  multiline,
  maxLength,
  placeholder,
  className,
}: TextFieldProps) {
  const id = `field-${name}`;
  const hintId = hint ? `${name}-hint` : undefined;
  const errorId = error ? `${name}-error` : undefined;
  const common = {
    id,
    name,
    value,
    required,
    placeholder,
    maxLength,
    onBlur,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': [hintId, errorId].filter(Boolean).join(' ') || undefined,
    className: cx('field-input scroll-mt-28', multiline && 'min-h-36 resize-y'),
  } as const;
  return (
    <div className={cx('min-w-0', className)}>
      <label htmlFor={id} className="field-label">
        {label}
        {required ? <Required /> : <span className="ml-1.5 font-normal text-(--muted)">(vapaaehtoinen)</span>}
      </label>
      {multiline ? (
        <textarea {...common} rows={5} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input {...common} type={type} autoComplete={autoComplete} inputMode={inputMode} onChange={(e) => onChange(e.target.value)} />
      )}
      {hint && (
        <p id={hintId} className="field-hint">
          {hint}
        </p>
      )}
      <FieldError id={`${name}-error`} message={error} />
    </div>
  );
}
