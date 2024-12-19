import { ChangeEvent, KeyboardEvent, useState } from "react";
import "./input-password.css";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";

interface InputPasswordProps {
    placeholder?: string,
    value?: string | null | undefined,
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void,
    error?: string
}

const InputPassword = ({placeholder, value, onChange, error} : InputPasswordProps) => {
    const [hidePass, setHidePass] = useState(false);
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
        }
    }
    return (
        <div className={`input-password-container ${error ? "mb-1" : "mb-2"}`}>
            <input placeholder={placeholder} onKeyDown={handleKeyDown} type={hidePass ? "text" : "password"} value={value} onChange={onChange} />
            <button onClick={() => setHidePass(!hidePass)} className=''>
                {hidePass ? <RiEyeOffLine /> : <RiEyeLine />}
            </button>
        </div>
    )
}

export default InputPassword