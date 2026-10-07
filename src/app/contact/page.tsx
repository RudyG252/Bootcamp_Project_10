import Instagram from "../../images/instagram.png";
import LinkTree from "../../images/linktree.webp";
import Facebook from "../../images/facebook.png";
import CPNow from "../../images/cpnow.png";
import Image from "next/image";
import GoogleCalendar from "../../images/googlecalendar.webp";
import LeaderBoard from "@/components/Leaderboard";
import { mockPlayers } from "../players/page";
import Badminton1 from "../../images/Badminton/badminton1.jpg";
import Badminton2 from "../../images/Badminton/badminton2.jpg";

const socials = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/slobadminton/?hl=en",
    src: Instagram,
  },
  {
    name: "Linktree",
    href: "https://linktr.ee/calpolybadminton?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAZXh0bgNhZW0CMTEAcGRvZgJzcnRjBmFwcF9pZA85MzY2MTk3NDMzOTI0NTkAAaft1O5BpH-hbai-7f9j4X6d2miyQZmX1Vcr5EBkgf8u8QKg2HKCWWIlNNmQDg_aem_erdToiunPZAb-dt6UO39rg",
    src: LinkTree,
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/groups/calpolybadmintonteam/",
    src: Facebook,
  },
  {
    name: "Cal Poly Now",
    href: "https://now.calpoly.edu/organization/badminton",
    src: CPNow,
  },
  {
    name: "Schedule",
    href: "https://calendar.google.com/calendar/u/0/r?cid=MjRsYWVmYjg3Nm9qa29oY25ib2swdDdwbm9AZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&pli=1",
    src: GoogleCalendar,
  },
];

export default function Contact() {
  return (
    <div className="max-w-300 align-middle items-center m-auto">
      <div className="py-10 min-h-screen">
        <div className=" min-h-screen">
          <h1 className="text-4xl my-4">Contact the Badminton Club</h1>
          <div className="flex flex-col ">
            <Image
              src={Badminton1}
              alt="image of people playing badminton"
              className=" object-cover max-h-100 min-w-200"
            />

            <div className="mt-10 text-center">
              <p className="text-lg font-semibold">Email the Badminton Club</p>
              <a href="mailto:calpolybadminton@gmail.com" className="text-blue-600 underline hover:text-blue-800">
                calpolybadminton@gmail.com
              </a>
            </div>

            <div className="flex align-middle items-center flex-col h-full m-auto space-y-10 m-2">
              <div className="flex flex-row align-middle items-center space-x-5 mt-10">
                {socials.map((socialsObj, index) => (
                  <div className="flex flex-col align-middle items-center" key={index}>
                    <a href={socialsObj.href} className="flex flex-col align-middle items-center">
                      <Image src={socialsObj.src} alt={socialsObj.name} className="w-10 h-10 rounded-lg" />
                      <p className="text-center ">{socialsObj.name}</p>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <footer className="">
          <div className="text-center text-sm text-gray-500">
            Disclaimer: ELO system will not be used for laddering or any serious purpose and is purely for fun. It can
            also include the practice schedule which can be found on the Linktree
          </div>
        </footer>
      </div>
    </div>
  );
}
