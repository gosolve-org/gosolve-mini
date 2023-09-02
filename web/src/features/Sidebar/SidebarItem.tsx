interface SidebarItemProps {
    children?: React.ReactNode;
}

const SidebarItem = ({ children }: SidebarItemProps) => {
    return <div className="mb-4">{children}</div>;
};

export default SidebarItem;
