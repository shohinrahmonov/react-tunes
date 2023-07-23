import { useEffect, useState } from "react";

type ThemeToggleProps = "light" | "dark";

export const useTheme = () => {
    const [theme, setTheme] = useState<ThemeToggleProps>(localStorage.getItem("theme") as ThemeToggleProps ?? "light");
	// add class to html tag
	useEffect(() => {
		document.documentElement.classList.remove(theme === "light" ? "dark" : "light");
		document.documentElement.classList.add(theme);
		// store it in localstorage
		localStorage.setItem("theme", theme);
	}, [theme]);

	const toggleTheme = () => {
		setTheme((prev) => (prev === "light" ? "dark" : "light"));
	}

    return {theme, toggleTheme}
}
