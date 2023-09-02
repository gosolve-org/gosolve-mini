interface SidebarProps {
    children?: React.ReactNode;
}

const Sidebar = ({ children }: SidebarProps) => {
    return <div className="h-full">{children}</div>;
};

export default Sidebar;
