export const ListItem = ({ className = '', children }) => (
    <div className={`bg-white first:rounded-t-md last:rounded-b-md border-b border-gray-200 last:border-none flex flex-row justify-between items-center p-6 ${className}`}>
        {children}
    </div>
)