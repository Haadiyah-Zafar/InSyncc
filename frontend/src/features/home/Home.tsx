import { Link } from "react-router-dom";
import { EmptyState } from "../../components/Status";

export function Home() {
  return (
    <div className="page">
      <section className="hero">
        <div>
          <p className="eyebrow">Learning, together</p>
          <h1>
            A little clarity.
            <br />A shared way forward.
          </h1>
          <p className="lead">
            A space for understanding new ideas, reflecting on progress, and
            learning with others.
          </p>
          <Link className="text-link" to="/status">
            Check service status
          </Link>
        </div>
        <aside className="welcome-card">
          <span className="card-number" aria-hidden="true">
            01 / A beginning
          </span>
          <h2>
            Room to learn.
            <br />
            Space to connect.
          </h2>
          <p>
            InSync is taking shape. Sign-in and learning activities are not
            available yet.
          </p>
          <span className="badge">Early development</span>
        </aside>
      </section>
      <EmptyState title="Your learning space is on its way">
        There are no learning activities available in this version. Come back
        when account access is ready.
      </EmptyState>
    </div>
  );
}
