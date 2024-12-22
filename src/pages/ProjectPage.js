import React from 'react';
import "./ProjectPage.css";

function ProjectPage({ project }) {

    return (
        <div className='flex flex-col items-center my-0 mx-auto'>
            <div className={`flex justify-evenly items-center w-full mb-4 rounded-3xl ${project.color}`}>
                <div className='flex justify-center content-center flex-col py-2.5 px-5 mt-7 ml-3/5 myfont'>
                    <div className='text-classicWhite text-4xl'>Project</div>
                    <div className='text-5xl text-classicWhite'>{project.title}</div>
                </div>
                <div>
                    <img src={project.image} alt={project.title} loading='lazy' className='w-4/5 h-auto m-4'/>
                </div>
            </div>

            <div 
            className='relative text-black flex w-full h-max my-0 mx-auto p-4 bg-classicWhite justify-self-center justify-around 
            items-center rounded-lg -mt-10 md:w-3/4'>
                {project.skills.map((skill, index) => (
                    <div key={index}>
                        <h3 className='mx-3 my-0 font-bold text-xl'>{skill.name}</h3>
                        <p className='mx-3 my-0 text-xl'>{skill.details}</p>
                    </div>
                ))}
                <div>
                    <h3>Repo</h3>
                    <a href={project.repo} target='_blank' rel='noreferrer' className='text-classicBlue hover:underline'>Link</a>
                </div>
            </div>

            {project.intros.map((intro, index) => (
                <div className={`flex flex-col p-3 justify-center items-center gap-10 text-classicWhite mt-10 mb-4 rounded-xl w-11/12 lg:flex-row lg:items-start ${intro.color}`} id={`intro${index + 1}`} key={index}>
                    {intro.image && <img src={intro.image} alt={intro.title} className='h-80 w-auto self-center rounded-md' loading='lazy' />}
                    <h2 className='mt-0 text-4xl myfont'>{intro.title}</h2>
                    <div className='flex flex-col items-center w-80 leading-9 text-center'>
                        <p>{intro.content}</p>
                        <br />
                        {intro.content2 && <p>{intro.content2}</p>}
                        <br />
                    </div>
                </div>
            ))}

            {project.flexbar && (
                <div>
                    <h2>{project.flexbar.title}</h2>
                    <div className='flex flex-col items-center p-4 justify-center gap-5 rounded-lg gap-6 lg:flex-row justify-around'>
                        {project.flexbar.boxes.map((box, index) => (
                            <div className={`flex flex-col p-4 rounded-lg w-7/12 h-auto text-left text-classicWhite lg:w-80 project--box-${box.color}`} key={index}>
                                <h3 className='text-center m-0 mb-4 text-xl font-bold'>{box.title}</h3>
                                <p className='m-0 leading-9'>{box.content}</p>
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