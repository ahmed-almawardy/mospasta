import "./globals.css";

export const metadata = {
  title: "Your Restaurant | Welcome to our table",
  description: "Explore our menu and join us for something delicious.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
