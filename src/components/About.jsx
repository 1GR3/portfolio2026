import TwentyYears from './TwentyYears';

function About() {
  return (
    <section className="about section" id="about">
      <div className="container">
        <h2>About</h2>
        <div className="row">
          <div className="col col-md-4">
            <TwentyYears />
          </div>
          <div className="col col-md-8">

            <p className="about-text">
              <span className="initial">W</span>
              <span className="about-content">
                hen design, interaction, and code are treated as one system,
                the result is a coherent digital experience rather than a collection of features.
              </span>
            </p>
            <p>It reflects more than twenty years of work across design and development — from early Flash experiments through modern front-end systems to a multidisciplinary practice at <a href="https://www.deltoidstudio.com">DELTOID STUDIO</a>.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
