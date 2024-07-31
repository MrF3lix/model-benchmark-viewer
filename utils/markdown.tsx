export const CustomMarkdownComponents = () => {
    return {
        a({ children, ...rest }: any) {
            return (
                <a {...rest} className="underline">{children}</a>
            )
        }
    }
}