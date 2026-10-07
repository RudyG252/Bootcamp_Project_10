import Instagram from "../../images/instagram.png";
import LinkTree from "../../images/linktree.webp";
import Facebook from "../../images/facebook.png";
import Image from "next/image";
import LeaderBoard from "@/components/Leaderboard";
import { mockPlayers } from "../players/page";
import Badminton1 from "../../images/Badminton/badminton1.jpg";
import Badminton2 from "../../images/Badminton/badminton2.jpg";

const steps = [
  {
    step: 1,
    description: "You will be matched with players with similar elo rankings",
    alt: "image of players getting matched",
    src: "",
  },
  {
    step: 2,
    description: "For every game you participate in, log your win/loss.",
    alt: "image of players logging win/loss",
    src: "",
  },
  {
    step: 3,
    description: "Your elo will be updated automatically",
    alt: "image of elo updating",
    src: "",
  },
];

export default function About() {
  return (
    <div className="max-w-300 align-middle items-center m-auto">
      <div className="py-10">
        <div className="my-10">
          <h1 className="text-4xl my-4">About The Cal Poly Badminton Club</h1>
          <div className="flex flex-col ">
            <Image
              src={Badminton2}
              alt="image of people playing badminton"
              className=" object-cover max-h-100 min-w-200"
            />

            <div className="flex align-middle items-center flex-col h-full m-auto space-y-10 m-2">
              <p className="h-full my-2 text-center max-w-200 my-15">
                This app is a home for the Cal Poly Badminton Club&apos;s games, players, and friendly competition. It
                makes it easier to find a court, record results, and watch your singles and doubles game improve over
                time.
              </p>
              <div className="flex flex-row align-middle items-center space-x-5">
                <div>
                  <a href="https://www.instagram.com/slobadminton/?hl=en">
                    <Image src={Instagram} alt="instagram" className="w-10 h-10" />
                  </a>
                </div>
                <div>
                  <a href="https://linktr.ee/calpolybadminton?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAZXh0bgNhZW0CMTEAcGRvZgJzcnRjBmFwcF9pZA85MzY2MTk3NDMzOTI0NTkAAaft1O5BpH-hbai-7f9j4X6d2miyQZmX1Vcr5EBkgf8u8QKg2HKCWWIlNNmQDg_aem_erdToiunPZAb-dt6UO39rg">
                    <Image src={LinkTree} alt="linktree" className="h-10 w-10 rounded-lg" />
                  </a>
                </div>
                <div>
                  <a href="https://www.facebook.com/groups/calpolybadmintonteam/">
                    <Image src={Facebook} alt="linktree" className="h-10 w-10 rounded-lg" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="my-10 min-w-full">
          <h1 className="text-2xl">Leaderboards for Single and Doubles</h1>

          <div className="w-full">
            <div className="flex flex-row w-full ">
              {LeaderBoard(mockPlayers, true)}
              {LeaderBoard(mockPlayers, false)}
            </div>

            <h3 className="text-2xl my-10">How it works</h3>
            <div className="flex space-y-10 flex-col min-w-full">
              {steps.map((stepObj, index) => (
                <div className={`flex flex-col ${stepObj.step % 2 == 0 ? "ml-auto" : "justify-start"}`} key={index}>
                  <Image
                    src={""}
                    alt={stepObj.alt}
                    className="border-2 border-black min-w-150 max-w-150 min-h-50"
                  ></Image>
                  <div className="flex space-x-3 mt-5">
                    <p className="text-white font-bold bg-blue-400 min-w-10 text-center align-middle items-center min-h-full ">
                      {stepObj.step}.
                    </p>
                    <p className="bg-blue-300 px-2 text-gray-900">{stepObj.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <footer>
          <div className="text-center text-sm text-gray-500">
            Disclaimer: ELO system will not be used for laddering or any serious purpose and is purely for fun. It can
            also include the practice schedule which can be found on the Linktree
          </div>
        </footer>
      </div>
    </div>
  );
}
