import React from "react";

const FolderIcon: React.FC<{className?: string}> = (props) => {
    return <svg  viewBox="0 0 1024 1024" version="1.1"
                 xmlns="http://www.w3.org/2000/svg"
                 width={1024}
                 height={1024}
                 {...props}>
        <path
            d="M960 381.33v373.33c0 61.85-50.14 112-112 112H176c-61.86 0-112-50.15-112-112V232c0-41.23 33.43-74.67 74.67-74.67h193.01c19.77 0.08 38.7 8 52.64 22.03l68.32 68.32a74.626 74.626 0 0 0 52.64 22.03H848c61.71 0.01 111.79 49.93 112 111.62z"
            fill="#333333"></path>
    </svg>
}

export {
    FolderIcon
}