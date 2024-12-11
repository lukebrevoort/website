import React from 'react'

export default function Contact() {
  return (
    <div>
        <div className='title'>
            <div className='title--number'>03.</div>
            <div className='title--content'>contact</div>
        </div>
        <div className='contact'>
            <div className='contact--bar'>
                <a href='https://www.instagram.com/luke.brev/' target="_blank" rel="noreferrer">
                    <img src='/images/instagram.png' alt='insta' className='contact--icon'/>
                </a>
                <a href="mailto:luke@brevoort.com" target="_blank" rel="noreferrer">
                    <img src='/images/gmail-image.png' alt='gmail' className='contact--icon'/>
                </a>
            </div>
            <div className='contact--circle'>
                <a href='https://github.com/lukebrevoort' target="_blank" rel="noreferrer">
                    <img src='/images/github.png' alt='github' className='contact--icon'/>
                </a>
            </div>
            <div className='contact--bar'>
                <a href='https://bsky.app/profile/luke-brev.bsky.social' target="_blank" rel="noreferrer">
                    <img src='/images/bluesky.png' alt='bluesky' className='contact--icon'/>
                </a>
                <a href='https://www.linkedin.com/in/luke-brevoort-6a545626a/' target="_blank" rel="noreferrer">
                    <img src='/images/linkedin.png' alt='linkedin' className='contact--icon'/>
                </a>
            </div>
        </div>
    </div>
  )
}
