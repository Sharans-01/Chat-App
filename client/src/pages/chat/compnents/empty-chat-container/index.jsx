import Lottie from "react-lottie";
import { animationDefaultOptions } from "@/lib/utils";

const EmptyChatContainer = () => {
  return (
    <div className="flex-1 md:bg-slate-100 md:flex flex-col justify-center items-center hidden duration-1000 transition-all">
      <Lottie
        isClickToPauseDisabled={true}
        height={200}
        width={200}
        options={animationDefaultOptions}
      />

      <div className="text-slate-700 flex flex-col gap-5 items-center mt-10 lg:text-4xl text-3xl transition-all duration-300 text-center">
        <h3 className="poppins-medium">
          Hi<span className="text-blue-600">! </span>Welcome to
          <span className="text-blue-600"> Chatter Hub</span> App
          <span className="text-blue-600">.</span>
        </h3>
      </div>
    </div>
  );
};

export default EmptyChatContainer;
