interface MobileHorizontalScrollProps {
    children: JSX.Element[]
    className?: string;
    childrenClassName?: string;
}

function MobileHorizontalScroll({ children, className, childrenClassName }: MobileHorizontalScrollProps) {
    return (
        <div className={["flex flex-nowrap overflow-x-auto pb-1.5 basis-auto scrollbar-hide", className].join(' ')}>
            {children.map(el =>
                <div key={el.key} className={["grow-0 shrink-0", childrenClassName].join(' ')}>
                    {el}
                </div>
            )}
        </div>
    );
}

export default MobileHorizontalScroll;
