import type { IdlField } from '@coral-xyz/anchor/dist/cjs/idl';
import { AlertCircle } from 'react-feather';
import './program-testing.css';

interface ArgumentFormProps {
    args: IdlField[] | null;
    formData: Record<string, string | number>;
    onChange: (formData: Record<string, string | number>) => void;
    validationErrors: Record<string, string>;
}

const ArgumentForm = (props: ArgumentFormProps) => {
    const { args, formData, onChange, validationErrors } = props;

    const handleChange = (name: string, value: string | number) => {
        onChange({ ...formData, [name]: value });
    };

    if (!args) return null;
    return (
        <div className="testing-form-section">
            <h4>{args.length > 0 ? `Arguments (${args.length})` : 'No Arguments'}</h4>

            {args.map(arg => (
                <div key={arg.name} className="mb-3">
                    <label htmlFor={arg.name} className="form-label d-flex align-items-center gap-2">
                        {arg.name}
                        {arg.type && <span className="text-muted small">({arg.type.toString()})</span>}
                    </label>
                    {validationErrors[arg.name] && (
                        <div className="invalid-feedback d-flex">
                            <AlertCircle size={14} />
                            <span>{validationErrors[arg.name]}</span>
                        </div>
                    )}
                    <input
                        id={arg.name}
                        type="text"
                        className={`form-control ${validationErrors[arg.name] ? 'is-invalid' : ''}`}
                        placeholder={`Enter value for ${arg.name}`}
                        value={formData[arg.name] || ''}
                        onChange={e => handleChange(arg.name, e.target.value)}
                    />
                </div>
            ))}
        </div>
    );
};

export default ArgumentForm;
