import Connect from "@components/cloud-connect";
import Player from "@components/player";
import {useTheme} from "@hooks/useTheme";
import Switch from "@ui/switch";

const Index = () => {
  const {theme, toggleTheme} = useTheme();

  return (
    <>
      <div className="container">
        <div className="flex items-center justify-between mt-4">
          <Connect />
          <Switch
            value={theme === "dark" ? true : false}
            onChange={toggleTheme}
          />
        </div>
        <Player />
      </div>
    </>
  );
};

export default Index;
