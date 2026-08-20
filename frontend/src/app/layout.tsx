import './globals.css';

export const metadata = {
  title: 'Hantashield',
  description: 'Hantashield Application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
