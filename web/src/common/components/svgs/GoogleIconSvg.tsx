import SvgBase, { SvgBaseProps } from "./SvgBase";

function GoogleIconSvg(props: SvgBaseProps) {
    return (
        <SvgBase strokeWidth="2" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path
                stroke="none"
                d="M0 0h24v24H0z"
            />
            <path d="M17.788 5.108A9 9 0 1021 12h-8" />
        </SvgBase>
    );
}

export default GoogleIconSvg;
