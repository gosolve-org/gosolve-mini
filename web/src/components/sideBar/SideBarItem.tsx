import React from "react";

interface SideBarItemProps {
    children?: React.ReactNode;
}

function SideBarItem({ children }: SideBarItemProps)
{
    return (
        <div className="mb-4">
            {children}
        </div>
    );
}

export default SideBarItem;
