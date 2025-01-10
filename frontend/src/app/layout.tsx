import Navbar from "./_Components/Navbar/page";
import ProtectRouting from "./_Components/ProtectRouting/page";
import ReactQuery from "./_Components/ReactQuery/page";
import { CartContextProvider } from "./_Contexts/CartContext";
import { UserContextProvider } from "./_Contexts/UserContext";
import "./globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { Toaster } from "react-hot-toast";
type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <UserContextProvider>
      <CartContextProvider>
        <html lang="en">
          <head>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1.0"
            />
            <title>TopKapi</title>
            <link rel="icon" href="/images/logo.jpg" />
          </head>

          <body>
            <ReactQuery>
              <ProtectRouting>
                <Navbar />
                {children}
                <Toaster />
              </ProtectRouting>
            </ReactQuery>
          </body>
        </html>
      </CartContextProvider>
    </UserContextProvider>
  );
}
