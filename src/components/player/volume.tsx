import {Icons} from "@components/icons";
import {usePlayerStore} from "@store/player.store";
import {motion} from "framer-motion";
import {useDebounce} from "use-debounce";

const Volume = () => {
  const {volume} = usePlayerStore((state) => state);
  const [debouncedVolume] = useDebounce(volume, 1500);
  return (
    <>
      {debouncedVolume !== volume && (
        <motion.div
          animate={{opacity: 1}}
          initial={{opacity: 0}}
          exit={{opacity: 0}}
          className="fixed bottom-1/4 left-1/2 -translate-x-1/2 h-60 w-60 rounded-3xl p-6 backdrop-blur bg-black/10 flex flex-col items-center"
        >
          {volume === 0 ? (
            <Icons.volume className="w-32 h-32" />
          ) : (
            <Icons.volumeUp className="w-32 h-32" />
          )}
          <div className="flex bg-secondary h-2 w-full mt-auto">
            <motion.div
              animate={{width: `${volume}%`}}
              className="h-full bg-primary relative"
            ></motion.div>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default Volume;
