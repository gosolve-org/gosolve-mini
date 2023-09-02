export interface SvgBaseProps extends React.ComponentPropsWithoutRef<'svg'> {
    children?: React.ReactNode;
}

const SvgBase = (props: SvgBaseProps) => {
    const { children } = props;
    return (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
            {children}
        </svg>
    );
};

export default SvgBase;
