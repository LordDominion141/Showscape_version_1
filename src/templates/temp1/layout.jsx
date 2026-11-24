import "./theme.css";

export default function Layout({ children }) {
    return (
        <div className="docs-theme">
            {children}
        </div>
    );
}
