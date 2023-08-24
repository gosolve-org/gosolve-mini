export interface SvgBaseProps extends React.ComponentPropsWithoutRef<'svg'> {
    children?: React.ReactNode;
}

function SvgBase(props: SvgBaseProps) {
    return (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
            {props.children}
        </svg>
    );
}

export default SvgBase;
