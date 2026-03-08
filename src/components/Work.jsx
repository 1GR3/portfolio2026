import projects from '../data/projects';

function Work() {
  return (
    <section className="work section" id="work">
      <div className="container">
        <h2>Work</h2>
        <div className="work__grid">
          {projects.map((project) => (
            <article className="work__card" key={project.id}>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <p className="work__meta">{project.year}</p>
              {project.url && (
                <p className="work__link-wrap">
                  <a href={project.url} target="_blank" rel="noreferrer">
                    View project
                  </a>
                </p>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Work;
