import { ReactSVG } from "react-svg"
import { FormEvent, useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router"
import { useSelector } from "react-redux"
import { login, signup } from "../store/actions/user.actions"
import { UserAvatar } from "../cmps/UserAvatar"
import { useSearchParams } from "react-router-dom"
import logo from "/img/trelloAuthLogo.svg"
import { userService } from "../services/user.service"
import { RootState } from "../store/store"
interface AuthPageProps {
    isLogin?: boolean
}
export function AuthPage({ isLogin = false }: AuthPageProps) {
    const user = useSelector((state: RootState) => state.userModule.user)
    const [verified, setVerified] = useState<boolean>(false)
    const [alert, setAlert] = useState<boolean>(false)
    const [email, setEmail] = useState<string>("")
    const [fullName, setFullName] = useState<string>("")
    const [pass, setPass] = useState<string>("")
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()
    const emailInput = useRef<HTMLInputElement>(null)
    const nameInput = useRef<HTMLInputElement>(null)
    const passInput = useRef<HTMLInputElement>(null)

    useEffect(() => {
        setAlert(false)
        setVerified(false)
    }, [isLogin])

    useEffect(() => {
        login()
        document.querySelector("html")?.classList.remove("dark")
        setAlert(false)
        setVerified(false)
    }, [])

    useEffect(() => {
        if (isLogin) {
            if (!verified && emailInput.current) {
                emailInput.current.focus()
            } else if (verified && passInput.current) {
                passInput.current.focus()
            }
        } else {
            if (!verified && emailInput.current) {
                emailInput.current.focus()
            } else if (verified && nameInput.current) {
                nameInput.current.focus()
            }
        }
    }, [verified, emailInput, passInput, nameInput])

    useEffect(() => {
        const loginHint = searchParams.get("login_hint")
        if (loginHint) {
            setEmail(loginHint)
        }
    }, [searchParams])

    useEffect(() => {
        if (!isLogin && user) {
            navigate("/login")
        }
    }, [user])

    async function onSubmit(e: FormEvent) {
        e.preventDefault()
        if (!email) {
            setAlert(true)
            setSearchParams((params) => {
                params.delete("login_hint")
                return params
            })
        }
        if (!verified && email) {
            const ans = await userService.getByEmail(email)

            if (ans.exist && !isLogin) {
                navigate(`/login?login_hint=${email}`)
            } else if (ans) {
                if (!ans.exist && isLogin) {
                    navigate(`/signup?login_hint=${email}`)
                } else {
                    setAlert(false)
                    setVerified(true)
                }
            }
        } else if (isLogin) {
            if (!pass) {
                setAlert(true)
            } else {
                setAlert(false)
                try {
                    setAlert(false)
                    await login({ email, password: pass })
                } catch (err) {
                    console.log(err)
                    setAlert(true)
                }
            }
        } else {
            if (email && pass && fullName) {
                setAlert(false)
                try {
                    await signup({ email, password: pass, fullName })
                } catch (err) {
                    console.log(err)
                    setVerified(false)
                }
            } else if (
                email &&
                fullName &&
                !pass &&
                passInput.current &&
                passInput.current !== document.activeElement
            ) {
                passInput.current.focus()
            } else {
                setAlert(true)
            }
        }
    }
    async function onLogout(e: FormEvent) {
        e.preventDefault()
        await userService.logout()
        window.location.reload()
    }
    return (
        <main className="auth-page">
            <section className="container">
                <ReactSVG src={logo} wrapper={"span"} className="logo" />
                {!user ? (
                    <form onSubmit={onSubmit} className="auth-form">
                        {isLogin ? (
                            <>
                                <h1>Login to continue</h1>
                                {!verified && (
                                    <input
                                        className={`email ${
                                            alert ? "alert" : ""
                                        }`}
                                        ref={emailInput}
                                        type="email"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        placeholder="Enter your email address"
                                    />
                                )}
                                {!verified && alert && (
                                    <span className="auth-alert">
                                        <span className="pyello-icon icon-warning" />{" "}
                                        Enter your email address
                                    </span>
                                )}
                                {verified && (
                                    <>
                                        <span
                                            className="email-address"
                                            onClick={() => {
                                                setVerified(false)
                                                setAlert(false)
                                            }}
                                        >
                                            {email}
                                            <span className="pyello-icon icon-edit" />
                                        </span>
                                        <input
                                            className={`password ${
                                                alert ? "alert" : ""
                                            }`}
                                            ref={passInput}
                                            placeholder="Enter your password"
                                            type="password"
                                            value={pass}
                                            onChange={(e) =>
                                                setPass(e.target.value)
                                            }
                                        />
                                        {alert && (
                                            <span className="auth-alert">
                                                <span className="pyello-icon icon-warning" />{" "}
                                                Wrong login or password
                                            </span>
                                        )}
                                    </>
                                )}
                            </>
                        ) : (
                            <>
                                <h1>Register to continue</h1>
                                {!verified && (
                                    <input
                                        className="email"
                                        ref={emailInput}
                                        type="email"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        placeholder="Enter your email address"
                                    />
                                )}
                                {verified && (
                                    <>
                                        <label>Email address</label>

                                        <span
                                            className="email-address reg"
                                            onClick={() => {
                                                setVerified(false)
                                                setAlert(false)
                                            }}
                                        >
                                            {email}
                                            <span className="pyello-icon icon-edit" />
                                        </span>
                                        <label htmlFor="full-name">
                                            Full name
                                        </label>
                                        <input
                                            className={`full-name ${
                                                alert && !fullName
                                                    ? "alert"
                                                    : ""
                                            } reg-alert`}
                                            ref={nameInput}
                                            id="full-name"
                                            type="text"
                                            placeholder="Enter full name"
                                            value={fullName}
                                            onChange={(e) =>
                                                setFullName(e.target.value)
                                            }
                                        />
                                        {alert && !fullName && (
                                            <span className="auth-alert">
                                                <span className="pyello-icon icon-warning" />{" "}
                                                Enter full name
                                            </span>
                                        )}
                                        <label htmlFor="password">
                                            Password
                                        </label>
                                        <input
                                            className={`password ${
                                                alert && !pass ? "alert" : ""
                                            } reg-alert`}
                                            placeholder="Enter password"
                                            ref={passInput}
                                            id="password"
                                            type="password"
                                            value={pass}
                                            onChange={(e) =>
                                                setPass(e.target.value)
                                            }
                                        />
                                        {alert && !pass && (
                                            <span className="auth-alert">
                                                <span className="pyello-icon icon-warning" />{" "}
                                                Enter password
                                            </span>
                                        )}
                                    </>
                                )}
                            </>
                        )}
                        <button className="auth-btn">
                            {verified
                                ? isLogin
                                    ? "Login"
                                    : "Register"
                                : "Continue"}
                        </button>
                    </form>
                ) : (
                    <section className="auth-switch">
                        <h1>Select account</h1>
                        <div
                            className="profile"
                            onClick={() =>
                                navigate(`/u/${user.username}/boards`)
                            }
                        >
                            <UserAvatar
                                memberId={user.id}
                                user={user}
                                size={36}
                                className="avatar"
                            />
                            <div className="user">
                                <span className="user-full-name">
                                    {user.fullName}
                                </span>
                                <span className="user-email">{user.email}</span>
                            </div>
                        </div>
                        <div className="logout">
                            <a onClick={onLogout} className="link">
                                Logout
                            </a>
                        </div>
                    </section>
                )}
            </section>
        </main>
    )
}
