import React from "react";

interface SideBarProps {
    children?: React.ReactNode;
}

function SideBar({ children }: SideBarProps)
{
    return (
        <div className="h-full">
            {children}
        </div>
    );
}

export default SideBar;
