import { ReactSVG } from "react-svg"
import checkedIcon from "/img/board-index/headerImgs/checkedIcon.svg"

interface CheckBoxProps extends React.InputHTMLAttributes<HTMLInputElement> {
    className?: string
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export function CheckBox({ className, onChange, ...other }: CheckBoxProps) {
    return (
        <label className={`custom-checkbox ${className ? className : ""}`}>
            <input
                className="input-checkbox"
                type="checkBox"
                onChange={onChange}
                {...other}
            />
            <ReactSVG src={checkedIcon} wrapper="span" className="checkbox" />
        </label>
    )
}
