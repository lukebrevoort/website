import React from 'react'

export default function Contact() {
  return (
    <div>
        <div className='flex justify-center text-classicWhite relative mb-10'>
            <div className='flex p-3 gap-14 w-60 justify-center items-center rounded-lg hover:bg-hoverGrey transition duration-300 ease'>
                <a href='https://www.instagram.com/luke.brev/' target="_blank" rel="noreferrer">
                    <img src='/images/instagram.png' alt='insta' className='contact--icon' loading='lazy'/>
                </a>
                <a href="mailto:luke@brevoort.com" target="_blank" rel="noreferrer">
                    <img src='/images/gmail-image.png' alt='gmail' className='contact--icon' loading='lazy'/>
                </a>
            </div>
            <div className='contact--circle'>
                <a href='https://github.com/lukebrevoort' target="_blank" rel="noreferrer">
                    <img src='/images/github.png' alt='github' className='contact--icon' loading='lazy'/>
                </a>
            </div>
            <div className='flex p-3 gap-14 w-60 justify-center items-center rounded-lg hover:bg-hoverGrey transition duration-300 ease'>
                <a href='https://bsky.app/profile/luke-brev.bsky.social' target="_blank" rel="noreferrer">
                    <img src='/images/bluesky.png' alt='bluesky' className='contact--icon' loading='lazy'/>
                </a>
                <a href='https://www.linkedin.com/in/luke-brevoort-6a545626a/' target="_blank" rel="noreferrer">
                    <img src='/images/linkedin.png' alt='linkedin' className='contact--icon' loading='lazy'/>
                </a>
            </div>
        </div>
    </div>
  )
}
