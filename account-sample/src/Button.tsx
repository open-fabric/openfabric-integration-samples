import React from 'react';


type ButtonProps = {
    onClick: () => void;
    isRed: boolean;
    isDisabled: boolean;
    children: React.ReactNode;
}

const getBackgroundColor = (isRed: boolean, isDisabled: boolean) => isDisabled ? 'gray' : (isRed ? 'red' : 'green');

export const Button = ({onClick, isRed, isDisabled, children}: ButtonProps) =>
    <div onClick={onClick} style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: getBackgroundColor(isRed, isDisabled),
        width: '180px',
        height: '180px',
        textAlign: 'center',
        borderRadius: '16px',
        margin: '8px',
        fontWeight: 'bold',
        cursor: 'pointer',
        filter: 'drop-shadow(1px 1px 4px #888)',
        color: 'white'
    }}>{children}</div>;
