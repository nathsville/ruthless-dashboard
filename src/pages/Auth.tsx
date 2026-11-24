import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button, Field, Icon } from "../ui";
import { useWorkspace } from "../state";
export function AuthPage() {
  const { pathname } = useLocation();
  const boxed = pathname.includes("/auth2/");
  const kind = pathname.split("/").at(-1)!;
  const base = boxed ? "/auth/auth2/" : "/auth/auth1/";
  const { toast } = useWorkspace();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [status, setStatus] = useState("");
  const [show, setShow] = useState(false);
  if (kind === "error" || kind === "maintenance")
    return (
      <div className="auth-error">
        {kind === "error" ? (
          <img src="/images/backgrounds/404.svg" alt="Page not found" />
        ) : (
          <Icon name="Construction" size={120} />
        )}
        <h1>{kind === "error" ? "Opps!!!" : "Maintenance Mode!!!"}</h1>
        <p>
          {kind === "error"
            ? "This page you are looking for could not be found."
            : "Website is Under Construction. Check back later!"}
        </p>
        <Link className="btn btn-primary" to="/">
          Go Back to Home
        </Link>
      </div>
    );
  const register = kind === "register",
    forgot = kind === "forgot-password",
    otp = kind === "two-steps";
  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (forgot) {
      setStatus("Demo recovery request recorded. No email was sent.");
      return;
    }
    if (otp) {
      if (code !== "123456") {
        setStatus("Use demo code 123456. No real verification code was sent.");
        return;
      }
      toast("Demo verification complete");
      nav("/");
      return;
    }
    sessionStorage.setItem(
      "ruthless.demo-session",
      JSON.stringify({ name: register ? name : "Cameron", email }),
    );
    toast("Demo session opened. This is not production authentication.");
    nav("/");
  }
  return (
    <div className={"auth-page " + (boxed ? "auth-boxed" : "auth-split")}>
      {!boxed && (
        <aside className="auth-art">
          <div className="auth-ribbon" />
          <div>
            <img src="/favicon.svg" width={40} height={40} alt="RUTHLESS" />
            <h1>
              Welcome Back to Your
              <br />
              Creative Space
            </h1>
          </div>
        </aside>
      )}
      <div className="auth-form-wrap">
        <section className="auth-form">
          <Link className="auth-logo" to="/">
            <img
              src="/favicon.svg"
              width={40}
              height={40}
              alt="RUTHLESS dashboard"
            />
          </Link>
          <h1>
            {forgot
              ? "Forgot your password?"
              : otp
                ? boxed
                  ? "Verify your email"
                  : "Two Steps Verification"
                : register
                  ? "Signup to RUTHLESS dashboard"
                  : "Welcome to RUTHLESS dashboard"}
          </h1>
          <p className="muted">
            {forgot
              ? "Please enter the email address associated with your account."
              : otp
                ? "We sent a verification code to your mobile. Enter the code below to verify your identity."
                : register
                  ? "Sign up to your account now"
                  : "Login to your account now"}
          </p>
          {!forgot && !otp && (
            <>
              <div className="social-login">
                {["Google", "Github"].map((provider, i) => (
                  <Button
                    key={provider}
                    onClick={() =>
                      toast(
                        provider +
                          " sign-in requires an OAuth backend. Use the local demo form below.",
                      )
                    }
                  >
                    <img
                      src={
                        i
                          ? "/images/svgs/github-icon.svg"
                          : "/images/svgs/google-icon.svg"
                      }
                      alt=""
                      width={16}
                      height={16}
                    />
                    Sign in with {provider}
                  </Button>
                ))}
              </div>
              <div className="or-divider">
                <span>or sign in with</span>
              </div>
            </>
          )}
          <form onSubmit={submit}>
            {register && (
              <Field label="Name*">
                <input
                  required
                  autoComplete="name"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Field>
            )}
            {otp ? (
              <>
                <div className="otp-inputs">
                  {Array.from({ length: 6 }, (_, i) => (
                    <input
                      key={i}
                      aria-label={"Verification digit " + (i + 1)}
                      inputMode="numeric"
                      pattern="[0-9]"
                      maxLength={1}
                      required
                      value={code[i] || ""}
                      onChange={(e) => {
                        const s = code.padEnd(6, " ").split("");
                        s[i] = e.target.value.replace(/\D/g, "");
                        setCode(s.join(""));
                        if (e.target.value)
                          (
                            e.target.nextElementSibling as HTMLInputElement
                          )?.focus();
                      }}
                      onPaste={(e) => {
                        const text = e.clipboardData
                          .getData("text")
                          .replace(/\D/g, "")
                          .slice(0, 6);
                        if (text.length === 6) {
                          setCode(text);
                          e.preventDefault();
                        }
                      }}
                    />
                  ))}
                </div>
                <p className="small muted">Demo code: 123456</p>
              </>
            ) : (
              <Field label="Email*">
                <input
                  required
                  type="email"
                  autoComplete="email"
                  placeholder={
                    forgot ? "example@ruthless.dashboard" : "Enter Your Email"
                  }
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Field>
            )}
            {!forgot && !otp && (
              <Field label="Password*">
                <span className="password-input">
                  <input
                    required
                    type={show ? "text" : "password"}
                    minLength={8}
                    autoComplete={
                      register ? "new-password" : "current-password"
                    }
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    aria-label={show ? "Hide password" : "Show password"}
                    onClick={() => setShow(!show)}
                  >
                    <Icon name={show ? "EyeOff" : "Eye"} size={16} />
                  </button>
                </span>
              </Field>
            )}
            {!register && !forgot && !otp && (
              <div className="auth-options">
                <label>
                  <input type="checkbox" />
                  Remember this device
                </label>
                <Link to={base + "forgot-password"}>Forgot Password?</Link>
              </div>
            )}
            {status && (
              <p className="form-status" role="status">
                {status}
              </p>
            )}
            <Button className="full" variant="primary">
              {forgot
                ? "Forgot password"
                : otp
                  ? "Verify Now"
                  : register
                    ? "Sign up"
                    : "Sign in"}
            </Button>
          </form>
          <p className="auth-bottom">
            {forgot ? (
              <Link to={base + "login"}>Back to Login</Link>
            ) : otp ? (
              <>
                Didn't get the code?{" "}
                <button
                  onClick={() =>
                    setStatus("Demo code: 123456. No real message was sent.")
                  }
                >
                  Resend code
                </button>
              </>
            ) : register ? (
              <>
                Already have an account?{" "}
                <Link to={base + "login"}>Sign in</Link>
              </>
            ) : (
              <>
                Don't have an account?{" "}
                <Link to={base + "register"}>Create an account</Link>
              </>
            )}
          </p>
        </section>
      </div>
    </div>
  );
}
