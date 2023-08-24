import React from "react";

interface SidebarProps {
    children?: React.ReactNode;
}

function Sidebar({ children }: SidebarProps)
{
    return (
        <div className="h-full">
            {children}
        </div>
    );
}

export default Sidebar;
