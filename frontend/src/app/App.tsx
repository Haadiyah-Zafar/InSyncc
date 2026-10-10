import { useEffect, useRef } from "react";
import { Link, NavLink, Route, Routes, useLocation } from "react-router-dom";
import { Home } from "../features/home/Home";
import { ServiceStatus } from "../features/status/ServiceStatus";

export function App() {
  const { pathname } = useLocation();
  const previous = useRef(pathname);
  const content = useRef<HTMLElement>(null);
  useEffect(() => {
    document.title = `${pathname === "/" ? "Welcome" : pathname === "/status" ? "Service status" : "Page not found"} | InSync`;
    if (previous.current !== pathname) content.current?.focus();
    previous.current = pathname;
  }, [pathname]);
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <header className="site-header">
        <Link to="/" className="brand" aria-label="InSync home">
          <span aria-hidden="true" className="brand-mark">
            in
          </span>
          InSync
        </Link>
        <nav aria-label="Main">
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/status">Service status</NavLink>
        </nav>
      </header>
      <main ref={content} tabIndex={-1} id="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/status" element={<ServiceStatus />} />
          <Route
            path="*"
            element={
              <section className="page">
                <p className="eyebrow">404</p>
                <h1>Page not found</h1>
                <p>That page isn’t available.</p>
                <Link to="/">Return home</Link>
              </section>
            }
          />
        </Routes>
      </main>
      <footer className="site-footer">
        <span>InSync</span>
        <span>Learn. Reflect. Connect.</span>
      </footer>
    </>
  );
}
