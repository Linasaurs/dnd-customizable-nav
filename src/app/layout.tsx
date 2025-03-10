import dynamic from "next/dynamic";
import { Box } from "@mui/material";
import "./globals.css";
const Nav = dynamic(() => import("./nav"), {
  ssr: !!false,
});
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Box sx={{ display: "flex" }}>
          <Nav />
          <Box
            sx={{
              minHeight: "100vh",
              width: "100%",
              backgroundColor: "white",
              "@media (min-width: 900px)": {
                backgroundColor: "#f5f5f5",
              },
            }}
          >
            <Box>{children}</Box>
          </Box>
        </Box>
      </body>
    </html>
  );
}
