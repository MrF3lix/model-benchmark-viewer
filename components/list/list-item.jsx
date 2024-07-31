export const ListItem = ({ className = 'p-6', children }) => (
    <div className={`bg-white first:rounded-t-md last:rounded-b-md border-b border-gray-200 last:border-none flex flex-row justify-between items-center ${className}`}>
        {children}
    </div>
)