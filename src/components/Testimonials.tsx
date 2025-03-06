import React from "react";
import { Spotlight } from "@/components/ui/spotlight-new";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";

const Testimonials = () => {
  const testimonials = [
    {
      quote:
        "As a Product Manager, I deeply value how this solution enhances our team's collaboration and streamlines complex workflows.",
      name: "Ayush Bhagat",
      designation: "Product(Project) Manager at Research Lab",
      src: "/ayush.jpg",
    },
    {
      quote:
        "This system's user-centric design aligns perfectly with my work as a UI/UX Engineer, ensuring every interaction is seamless.",
      name: "Brijal Dave",
      designation: "UI/UX Engineer at Research Lab",
      src: "/brijal.jpg",
    },
    {
      quote:
        "Its robust backend architecture truly stands out, simplifying my tasks and making development more efficient.",
      name: "Monik Patel",
      designation: "Backend Engineer at Research Lab",
      src: "/monik.jpg",
    },
    {
      quote:
        "The attention to detail in design provides a solid foundation for creating visually stunning and intuitive user interfaces.",
      name: "Ankit Dabhi",
      designation: "UI Designer at Research Lab",
      src: "/ankit.jpg",
    },
    {
      quote:
        "As a UI/UX Manager, I appreciate how this tool enhances our design process and empowers my team to achieve more.",
      name: "Darshan Prajapati",
      designation: "UI/UX Manager at Research Lab",
      src: "/darshan.jpg",
    },
    {
      quote:
        "The backend features are well-thought-out and optimized for scalability, making it a dream for backend development.",
      name: "Mayur",
      designation: "Backend Developer at Research Lab",
      src: "/mayur.jpg",
    },
    {
      quote:
        "The frontend framework is intuitive and flexible, making development faster and smoother for us.",
      name: "Niraj Patel",
      designation: "Frontend Developer at Research Lab",
      src: "/niraj.jpg",
    },
    {
      quote:
        "This solution is a game-changer for frontend developers, allowing us to deliver polished products efficiently.",
      name: "Prince",
      designation: "Frontend Developer at Research Lab",
      src: "/prince.jpg",
    },
    {
      quote:
        "From a UI/UX perspective, this system ensures users enjoy a seamless and delightful experience at every touchpoint.",
      name: "Ilma Vahora",
      designation: "UI/UX at Research Lab",
      src: "/ilma.jpg",
    },
  ];

  const testimonials2 = [
    {
      quote:
        "As the HOD of the BCA Department (SPCAM), I am impressed with how this solution fosters academic excellence and simplifies department management.",
      name: "Mrs. Jyoti Amitkumar Dhamecha",
      designation: "HOD of BCA Department(SPCAM)",
      src: "/jd.jpg",
    },
    {
      quote:
        "As the Vice HOD of the BCA Department (SPCAM), this solution has proven invaluable in supporting our academic and administrative processes.",
      name: "Mrs. Bhavisha Parvadiya",
      designation: "Vice HOD of BCA Department(SPCAM)",
      src: "/b.jpg",
    },
  ];

  return (
    <>
      <div className="min-h-screen w-full rounded-md flex md:items-center md:justify-center bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden flex-col">
        <Spotlight />
        <div className=" p-4 max-w-7xl  mx-auto relative z-10 mt-8  w-full pt-20 md:pt-0">
          <h1 className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
            Chakra Innovators <br /> Developers Team
          </h1>
          <p className="mt-4 font-normal text-base text-neutral-300 max-w-lg text-center mx-auto">
            SPCAM&#39;s Research lab team
          </p>
        </div>
        <h1 className="text-4xl mt-12 md:text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
          UNDER THE GUIDANCE OF
        </h1>
        <AnimatedTestimonials testimonials={testimonials2} autoplay={true} />
        <h1 className="text-4xl md:text-4xl uppercase font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
          Developers Team
        </h1>
        <AnimatedTestimonials testimonials={testimonials} autoplay={true} />
      </div>
    </>
  );
};

export default Testimonials;
