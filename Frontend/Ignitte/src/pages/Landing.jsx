import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col font-body-md overflow-x-hidden relative">
      {/* Main Content */}
      <main className="flex-grow pt-24 pb-section-gap px-container-padding max-w-[1440px] mx-auto w-full flex flex-col gap-section-gap">
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center text-center py-section-gap relative">
          <h1 className="font-headline-xl text-headline-xl text-on-surface mb-stack-lg leading-tight tracking-tight max-w-4xl">
            Empower the Next Generation of Engineers
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mb-section-gap">
            Join Ignitte, a student-run teaching club dedicated to mentoring and preparing government school students for the JEE exam. Make a real difference by sharing your knowledge and inspiring future innovators.
          </p>
          <div className="flex flex-col sm:flex-row gap-gutter">
            <Link
              to="/register"
              className="bg-primary-container text-surface font-label-md text-label-md px-12 py-4 rounded-full hover:opacity-90 transition-opacity duration-300 text-center"
            >
              Apply Now
            </Link>
            <Link
              to="/about"
              className="bg-transparent border border-outline text-on-surface font-label-md text-label-md px-12 py-4 rounded-full hover:bg-surface-variant transition-colors duration-300 text-center"
            >
              Learn More
            </Link>
          </div>
        </section>

        {/* Features Section (Bento Grid) */}
        <section className="flex flex-col gap-stack-lg">
          <div className="text-center mb-stack-lg">
            <h2 className="font-headline-lg text-headline-lg text-on-surface">Why Join Ignitte?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
            {/* Card 1 */}
            <div className="bg-surface-container border border-outline-variant rounded-xl p-stack-lg hover:border-primary-container transition-colors duration-300 group relative overflow-hidden">
              <div className="mb-stack-md text-primary-container bg-primary-container/10 inline-flex p-stack-sm rounded-lg border border-primary-container/20">
                <span className="material-symbols-outlined">school</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-stack-sm">Mentorship for JEE</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">Guide government school students through the rigorous JEE syllabus, providing them with the academic support they need to succeed.</p>
            </div>
            {/* Card 2 */}
            <div className="bg-surface-container border border-outline-variant rounded-xl p-stack-lg hover:border-primary-container transition-colors duration-300 group relative overflow-hidden lg:col-span-2 lg:row-span-1">
              <div className="mb-stack-md text-primary-container bg-primary-container/10 inline-flex p-stack-sm rounded-lg border border-primary-container/20">
                <span className="material-symbols-outlined">menu_book</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-stack-sm">Teaching Excellence</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">Develop your communication and pedagogical skills by creating engaging lesson plans and delivering complex concepts in accessible ways.</p>
            </div>
            {/* Card 3 */}
            <div className="bg-surface-container border border-outline-variant rounded-xl p-stack-lg hover:border-primary-container transition-colors duration-300 group relative overflow-hidden">
              <div className="mb-stack-md text-primary-container bg-primary-container/10 inline-flex p-stack-sm rounded-lg border border-primary-container/20">
                <span className="material-symbols-outlined">volunteer_activism</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-stack-sm">Social Impact</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">Directly contribute to leveling the educational playing field. Your efforts can change the trajectory of a student's life and career.</p>
            </div>
            {/* Card 4 */}
            <div className="bg-surface-container border border-outline-variant rounded-xl p-stack-lg hover:border-primary-container transition-colors duration-300 group relative overflow-hidden lg:col-span-4 lg:row-span-1 flex flex-col md:flex-row items-center gap-stack-lg">
              <div className="flex-shrink-0 mb-stack-md md:mb-0 text-primary-container bg-primary-container/10 inline-flex p-stack-sm rounded-lg border border-primary-container/20">
                <span className="material-symbols-outlined" style={{ fontSize: '48px' }}>diversity_3</span>
              </div>
              <div>
                <h3 className="font-headline-md text-headline-md text-on-surface mb-stack-sm">Community Growth</h3>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-3xl">Become part of a passionate group of educators and mentors. Build lasting connections with fellow students who share a commitment to educational equity.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="flex flex-col items-center gap-stack-lg">
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-stack-lg">Induction Process</h2>
          <div className="w-full max-w-4xl relative">
            {/* Continuous Line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[2px] bg-outline-variant md:-translate-x-1/2 hidden md:block"></div>
            <div className="flex flex-col gap-stack-lg relative">
              {/* Step 1 */}
              <div className="flex flex-col md:flex-row items-start md:items-center w-full group">
                <div className="md:w-1/2 md:pr-stack-lg flex justify-start md:justify-end text-left md:text-right order-2 md:order-1 mt-stack-md md:mt-0 pl-12 md:pl-0">
                  <div className="bg-surface-container border border-outline-variant p-stack-lg rounded-xl group-hover:border-primary-container transition-colors">
                    <h4 className="font-headline-md text-headline-md text-on-surface">1. Register Account</h4>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-stack-sm">Create your secure profile on the Ignitte portal.</p>
                  </div>
                </div>
                <div className="absolute md:relative left-0 md:left-auto flex items-center justify-center w-8 h-8 rounded-full bg-surface border-2 border-primary-container z-10 group-hover:bg-primary-container transition-colors order-1 md:order-2">
                  <div className="w-2 h-2 rounded-full bg-primary-container group-hover:bg-surface animate-pulse"></div>
                </div>
                <div className="md:w-1/2 md:pl-stack-lg order-3 hidden md:block"></div>
              </div>
              {/* Step 2 */}
              <div className="flex flex-col md:flex-row items-start md:items-center w-full group">
                <div className="md:w-1/2 md:pr-stack-lg order-2 md:order-1 hidden md:block"></div>
                <div className="absolute md:relative left-0 md:left-auto flex items-center justify-center w-8 h-8 rounded-full bg-surface border-2 border-primary-container z-10 group-hover:bg-primary-container transition-colors order-1 md:order-2">
                  <div className="w-2 h-2 rounded-full bg-primary-container group-hover:bg-surface"></div>
                </div>
                <div className="md:w-1/2 md:pl-stack-lg flex justify-start text-left order-3 mt-stack-md md:mt-0 pl-12 md:pl-0">
                  <div className="bg-surface-container border border-outline-variant p-stack-lg rounded-xl group-hover:border-primary-container transition-colors">
                    <h4 className="font-headline-md text-headline-md text-on-surface">2. Fill Application</h4>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-stack-sm">Detail your academic background, teaching experience (if any), and motivation to mentor.</p>
                  </div>
                </div>
              </div>
              {/* Step 3 */}
              <div className="flex flex-col md:flex-row items-start md:items-center w-full group">
                <div className="md:w-1/2 md:pr-stack-lg flex justify-start md:justify-end text-left md:text-right order-2 md:order-1 mt-stack-md md:mt-0 pl-12 md:pl-0">
                  <div className="bg-surface-container border border-outline-variant p-stack-lg rounded-xl group-hover:border-primary-container transition-colors">
                    <h4 className="font-headline-md text-headline-md text-on-surface">3. Complete Tasks</h4>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-stack-sm">Demonstrate your subject knowledge and teaching approach through a short assignment.</p>
                  </div>
                </div>
                <div className="absolute md:relative left-0 md:left-auto flex items-center justify-center w-8 h-8 rounded-full bg-surface border-2 border-primary-container z-10 group-hover:bg-primary-container transition-colors order-1 md:order-2">
                  <div className="w-2 h-2 rounded-full bg-primary-container group-hover:bg-surface"></div>
                </div>
                <div className="md:w-1/2 md:pl-stack-lg order-3 hidden md:block"></div>
              </div>
              {/* Step 4 */}
              <div className="flex flex-col md:flex-row items-start md:items-center w-full group">
                <div className="md:w-1/2 md:pr-stack-lg order-2 md:order-1 hidden md:block"></div>
                <div className="absolute md:relative left-0 md:left-auto flex items-center justify-center w-8 h-8 rounded-full bg-surface border-2 border-primary-container z-10 group-hover:bg-primary-container transition-colors order-1 md:order-2">
                  <div className="w-2 h-2 rounded-full bg-primary-container group-hover:bg-surface"></div>
                </div>
                <div className="md:w-1/2 md:pl-stack-lg flex justify-start text-left order-3 mt-stack-md md:mt-0 pl-12 md:pl-0">
                  <div className="bg-surface-container border border-outline-variant p-stack-lg rounded-xl group-hover:border-primary-container transition-colors">
                    <h4 className="font-headline-md text-headline-md text-on-surface">4. Personal Interviews (PI)</h4>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-stack-sm">Engage in multiple rounds of interviews to assess your subject matter expertise, communication skills, and commitment to the club's mission.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full flex justify-center py-section-gap">
          <div className="bg-surface-container border border-outline-variant rounded-[24px] max-w-4xl w-full p-12 md:p-section-gap flex flex-col items-center text-center relative overflow-hidden">
            <div className="relative z-10 flex flex-col items-center">
              <span className="inline-block bg-primary-container/20 text-primary-container font-label-sm text-label-sm px-4 py-1 rounded-full mb-stack-md border border-primary-container/30 uppercase tracking-wider">
                Deadline Approaching
              </span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface mb-stack-md">Don't Miss the Window</h2>
              <p className="font-body-md text-body-md text-on-surface-variant mb-stack-lg max-w-md">
                Applications close soon. Secure your spot in the next cohort of dedicated mentors.
              </p>
              <Link
                to="/register"
                className="bg-primary-container text-surface font-label-md text-label-md px-12 py-4 rounded-full hover:opacity-90 transition-opacity duration-300 text-center"
              >
                Begin Application
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Landing;

