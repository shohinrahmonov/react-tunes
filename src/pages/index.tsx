import Player from "@components/player";
import {useTheme} from "@hooks/useTheme";
import Switch from "@ui/switch";

const Index = () => {
  const {theme, toggleTheme} = useTheme();
  return (
    <>
      <Switch
        className="mt-4 ml-auto mr-2"
        value={theme === "dark" ? true : false}
        onChange={toggleTheme}
      />
      <div className="container">
        <Player />
      </div>
    </>
  );
};

export default Index;
