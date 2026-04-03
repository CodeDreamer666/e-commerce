import "./globals.css";
import Navbar from "@/app/components/shared/Navbar";
import RouteLoader from "@/app/components/shared/RouteLoader";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <RouteLoader>
          <Navbar />
          {children}
        </RouteLoader>
      </body>
    </html>
  );
}
