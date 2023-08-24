import React from "react";

interface SidebarItemProps {
    children?: React.ReactNode;
}

function SidebarItem({ children }: SidebarItemProps)
{
    return (
        <div className="mb-4">
            {children}
        </div>
    );
}

export default SidebarItem;
