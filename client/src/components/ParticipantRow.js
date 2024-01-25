import React from 'react'

const ParticipantRow = ({message}) => {
  return (
    <>
        <div className='flex w-full justify-start items-center text-red-400'>
            <p className='underline pb-3'>
                {message?.user}
            </p>
            <p>
                {message?.message}
            </p>
        </div>
    </>
  )
}

export default ParticipantRow