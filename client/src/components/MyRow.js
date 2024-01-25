import React from 'react'

const MyRow = ({message}) => {
  return (
    <>
        <div className='flex w-full justify-end items-center text-green-400'>
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

export default MyRow