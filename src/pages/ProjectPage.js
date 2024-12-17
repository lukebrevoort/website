import React from 'react';
import "./ProjectPage.css";

function ProjectPage({ project }) {

    return (
        <div className='project--container'>
            <div className={`project--title--page ${project.color}`}>
                <div className='project--title'>
                    <h2 className='grey'>Project</h2>
                    <h1>{project.title}</h1>
                </div>
                <div>
                    <img src={project.image} alt={project.title} loading='lazy' />
                </div>
            </div>

            <div className='project--skills'>
                {project.skills.map((skill, index) => (
                    <div key={index}>
                        <h3>{skill.name}</h3>
                        <p>{skill.details}</p>
                    </div>
                ))}
                <div>
                    <h3>Repo</h3>
                    <a href={project.repo} target='_blank' rel='noreferrer' className='project--link'>Link</a>
                </div>
            </div>

            {project.intros.map((intro, index) => (
                <div className='project--intro' id={`intro${index + 1}`} key={index}>
                    {intro.image && <img src={intro.image} alt={intro.title} className='project--image' loading='lazy' />}
                    <h2 className='project--intro--title myfont'>{intro.title}</h2>
                    <div className='project--intro--content'>
                        <p>{intro.content}</p>
                        <br />
                        {intro.content2 && <p>{intro.content2}</p>}
                        <br />
                    </div>
                </div>
            ))}

            {project.flexbar && (
                <div className='project--flexbar'>
                    <h2>{project.flexbar.title}</h2>
                    <div className='project--flexbox'>
                        {project.flexbar.boxes.map((box, index) => (
                            <div className={`project--box project--box-${box.color}`} key={index}>
                                <h3>{box.title}</h3>
                                <p>{box.content}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <footer className="navbar-left">
                <a href="#head" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <span className="navBar-left-blue">l</span>
                    <span className="navBar-left-red">u</span>
                    <span className="navBar-left-purple">k</span>
                    <span className="navBar-left-green">e</span>
                    <span className="navBar-left-green">.</span>
                    <span className="navBar-left-red">b</span>
                    <span className="navBar-left-purple">r</span>
                    <span className="navBar-left-green">e</span>
                    <span className="navBar-left-blue">v</span>
                </a>
            </footer>
        </div>
    );
}

export default ProjectPage;