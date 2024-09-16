import React from "react"
import { ReactSVG } from "react-svg"

interface SvgButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    src: string
    label?: React.ReactNode
    preLabel?: React.ReactNode
}

export function SvgButton({ src, label, preLabel, ...other }: SvgButtonProps) {
    return (
        <button {...other}>
            {preLabel && <span className="pre-label">{preLabel}</span>}
            <ReactSVG src={src} wrapper="span" />
            {label && <span className="label">{label}</span>}
        </button>
    )
}
