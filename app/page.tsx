import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import GithubStats from "@/components/GithubStats";
import Pipeline from "@/components/Pipeline";
import Lab from "@/components/Lab";
import Mindmap from "@/components/Mindmap";
import Intro from "@/components/Intro";
import WaveEdge from "@/components/WaveEdge";
import Chat from "@/components/Chat";
import Motion from "@/components/Motion";
import Nav from "@/components/Nav";
import { About, Beyond, Certs, Contact, Faq, Head, Now, Track } from "@/components/Sections";

/*
  Page rhythm: base → secondary → ACCENT → base → secondary → base → ACCENT → base
  Each band after the first starts with a filled wave edge in its own colour.
*/
const BASE = "var(--c-base)", SEC = "var(--c-sec)", ACC = "var(--c-accent)";

export default function Page() {
  return (
    <>
      <Intro />
      <Nav />
      <Hero />
      <main>
        <section id="projects" className="section band">
          <div className="wrap">
            <Head n="01" kicker="FEATURED BUILDS" title={<>Problem in. <em>Result out.</em></>} />
            <Projects />
            <GithubStats />
          </div>
        </section>

        <section id="about" className="section band band-alt">
          <WaveEdge from={BASE} />
          <div className="wrap">
            <Head n="02" kicker="ABOUT" title={<>Learner. Explorer. <em>Adaptable.</em></>} />
            <About />
          </div>
          <div className="wrap">
            <p className="mono pipe-intro">HOW I WORK ↓</p>
            <Pipeline />
          </div>
        </section>

        <section id="skills" className="section band band-accent">
          <WaveEdge from={SEC} />
          <div className="wrap">
            <Head n="03" kicker="SKILLS & STACK" title={<>Six webs, <em>one mind.</em></>} />
            <Mindmap />
          </div>
        </section>

        <section id="lab" className="section band">
          <WaveEdge from={ACC} />
          <div className="wrap">
            <Head n="04" kicker="THE LAB · RUNNING LIVE" title={<>Models in <em>motion.</em></>} />
            <Lab />
          </div>
        </section>

        <section id="track" className="section band band-alt">
          <WaveEdge from={BASE} />
          <div className="wrap">
            <Head n="05" kicker="HACKATHONS · AGENTS · LEADERSHIP" title={<>Track <em>record.</em></>} />
            <Track />
          </div>
        </section>

        <section id="now" className="section band">
          <WaveEdge from={SEC} />
          <div className="wrap">
            <Head n="06" kicker="CURRENTLY LEARNING" title={<>In the <em>workshop</em> now.</>} />
            <Now />
          </div>
        </section>

        <section id="beyond" className="section band">
          <div className="wrap">
            <Head n="07" kicker="BEYOND CODE" title={<>Petrol, phonk and a <em>mic.</em></>} />
            <Beyond />
          </div>
        </section>

        <section id="certs" className="section band">
          <div className="wrap">
            <Head n="08" kicker="CERTIFICATIONS & EDUCATION" title={<>Paperwork, <em>stamped.</em></>} />
            <Certs />
          </div>
        </section>

        <section id="faq" className="section band">
          <div className="wrap">
            <Head n="09" kicker="QUICK ANSWERS" title={<>Asked and <em>answered.</em></>} />
            <Faq />
          </div>
        </section>

        <section id="contact" className="section band band-accent">
          <WaveEdge from={BASE} />
          <div className="wrap">
            <Head n="10" kicker="CONTACT" title={<>Pit <em>stop.</em></>} />
            <Contact />
          </div>
        </section>
      </main>
      <footer className="footer band">
        <WaveEdge from={ACC} />
        <div className="wrap">
          <span>© 2026 Armaan Mangaonkar · Mumbai, India</span>
          <span className="mono">Next.js · GSAP · Transformers.js</span>
        </div>
      </footer>
      <Chat />
      <Motion />
    </>
  );
}
