// // src/app/page.tsx
// // src/app/page.tsx
// import Navbar from "../components/Navbar";
// import Hero from "../components/Hero";

// export default function Home() {
//   return (
//     <>
//       <Navbar />
//       <main>
//         <Hero />
//         {/* Add About, Projects, Blog, Contact sections below */}
//       </main>
//     </>
//   );
// }
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import About from "../components/About";
import Projects from "../components/Projects";
import Timeline from "../components/Timeline";
import AskMyResume from "../components/AskMyResume";
import Contact from "../components/Contact";


export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Timeline />
        <Projects />
        <AskMyResume />
        <Contact />
      </main>
    </>
  );
}
