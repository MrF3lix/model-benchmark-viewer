export const Input = ({ label, value, onChange, placeholder = '', className = null, error = null, disabled = false, ...rest }) => (
    <label className={`text-left ${className}`}>
        {label &&
            <span className="text-gray-600 text-xs">{label}</span>
        }
        <input
            value={value}
            placeholder={placeholder}
            onChange={onChange}
            disabled={disabled}
            className={`
        p-2 border rounded-sm w-full
        bg-gray-50
        text-gray-900 text-sm
        disabled:text-gray-400 disabled:bg-gray-200 disabled:border-gray-200
      `}
            {...rest}
        />
        {error && error !== '' && (
            <span className="text-sm text-red-500">{error}</span>
        )}
    </label>
)