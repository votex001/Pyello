import { useState } from "react"

interface FormState {
    [key: string]: string | number | boolean
}

export const useForm = (initialState: FormState) => {
    const [fields, setFields] = useState(initialState)

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        let { value, name: field, type, checked } = event.target
        // value = (type === 'number') ? +value : value
        let newValue: string | number | boolean = value
        switch (type) {
            case "number":
            case "range":
                newValue = +value
                break
            case "checkbox":
                newValue = checked
                break
            default:
                break
        }
        setFields((prevFields) => ({ ...prevFields, [field]: newValue }))
    }

    return [fields, setFields, handleChange]
}
