import { ListHeader } from "./list-header";

export const List = ({ title, description, children }) => (
    <div className="flex flex-col">
        {title &&
            <ListHeader
                title={title}
                description={description}
            />
        }
        {children}
    </div>
)