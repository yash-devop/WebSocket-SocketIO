  import { useEffect, useMemo, useState } from 'react';
  import logo from './logo.svg';
  import io from 'socket.io-client'
import MyRow from './components/MyRow';
import ParticipantRow from './components/ParticipantRow';

  // Reference : https://socket.io/docs/v3/client-initialization/


  export function App() {
    const [message , setMessage] = useState("")
    const [roomName , setRoomName] = useState("")
    const [socketID , setSocketID]  = useState("")
    const [allMessages , setAllMessages] = useState([])
    const [status , setStatus] = useState([])
    const [yourRoom , setYourRoom] = useState("")
    const [userName , setUserName] = useState("")
    // const socket = io();  // if both backend and frontend deployed on same domain.
    /*
      note: we can also use : http://localhost:8000  or ws://localhost:8000
    */

    // 1.
    
    // const socket = io("http://localhost:8000")  // pass the url of the server.
    
    const socket = useMemo(()=>{
      return io("http://localhost:8000" , {
        withCredentials : true
      })
    },[])
    const handleMessageSubmit=(e)=>{
      e.preventDefault();
      socket.emit("message" , {
          id: socketID,
          message,
          room : roomName,
          user : userName
      })
    }
 

    const handleRoom=(e)=>{
      e.preventDefault()
      const roomObject = {
         id : socketID,
         room: roomName,
         user: userName
      }
      socket.emit("join-room" , roomObject)
    }


    // data fetching from socket.io
    useEffect(() => {
      
      socket.on("connect",()=>{
        setSocketID(socket.id)
        console.log('Connected' , socket.id);
      })
      socket.on("message", (data)=>{
        console.log('Received msg : ', data);
        // setAllMessages([...allMessages , data])
        setAllMessages((prevMsg)=>{
          return [...prevMsg , data]
        })
      })

      socket.on("room-name", ( data)=>{
        console.log('roomNAMEEEE' ,data);
        setYourRoom(data)       
      })
      socket.on("joined-status" , (data)=>{
        setStatus((prevStatus)=>{
           return [...prevStatus , data]
        })
      })


      return ()=>{
        socket.disconnect();

      }
    }, []);
    
    return (
      <>
          <h1>Welcome to our SocketIO Demonstration !</h1>
          <p>Your ID is : {socketID}</p>

          <form onSubmit={handleRoom} className='mb-4'>
            <label className='font-medium text-xl' htmlFor="room">Enter room name: </label>
            <input id="room" value={roomName} onChange={(e)=>setRoomName(e.target.value)} placeholder='Enter room name' name='room' type='text' className='p-3 text-lg font-light border'/>
            <button type='submit'>Join Room</button>
            <br />
            <label className='font-medium text-xl' htmlFor="room">Enter user name: </label>
            <input id="room" value={userName} onChange={(e)=>setUserName(e.target.value)} placeholder='Username' name='room' type='text' className='p-3 text-lg font-light border'/>
            
            <button className='bg-red-400 p-3 text-white'>Leave Room</button>
          </form>


          {
            status.map((roomStatus)=>{
                return (
                  <>
                    <p>{roomStatus}</p>
                  </>
                )
              })
            }

            <hr />
            <h1 className='font-bold text-2xl'>ROOM NAME : {yourRoom}</h1>
            <div className='max-w-[600px] w-full '>
                {
                  allMessages?.map((message)=>{
                      if(message?.id === socketID){
                        return <MyRow message={message} />
                      }
                      else{

                         return <ParticipantRow message={message} />
                      }
                  }

                  )
                }
            </div>
          <form onSubmit={handleMessageSubmit} className='mt-6'>
            <label className='font-medium text-xl' htmlFor="">Enter your message : </label>
            <input value={message} onChange={(e)=>setMessage(e.target.value)} placeholder='Enter message' id='message' name='message' type='text' className='p-3 text-lg font-light border'/>
            <button type='submit'>Send</button>
          </form>
      </>
    );
  }
  export default App;
