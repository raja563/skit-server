import React from 'react'

const Notes = () => {
  return (
    <div>
      <h3 className='text-secondary'>C Language Notes</h3>
      <ol className='border'>
        <li className='m-1'> <a href="/documents/introduction to programming.pdf" download="MyFile"><img  width={12} src="/img/pdf_logo.png" alt="" /> introduction to programming</a> </li>
      </ol>
    </div>
  )
}

export default Notes
