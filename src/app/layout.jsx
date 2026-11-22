import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "ShowScape | Streaming your next obsession",
  description: "Discover trending shows, curated collections, and premium originals in one immersive streaming experience.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={` h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
