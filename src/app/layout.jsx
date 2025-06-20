import "./globals.css";

export const metadata = {
	title: "Thing Tracker",
	description: "A simple thing tracker"
};

export default function RootLayout({children}) {
	return (
		<html lang="en">
			<body>{children}</body>
		</html>
	);
}
