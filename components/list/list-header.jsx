export const ListHeader = ({ title, description }) => {
    return (
        <div className="bg-white px-4 py-4 border-b border-gray-200 rounded-t-md">
            <div className="-ml-4 -mt-4 flex justify-between items-center flex-wrap sm:flex-nowrap">
                <div className="ml-4 mt-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>
                    {description &&
                        <p className="mt-1 text-sm text-gray-500">
                            {description}
                        </p>
                    }
                </div>
            </div>
        </div>
    )
}