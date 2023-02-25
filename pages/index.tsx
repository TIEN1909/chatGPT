'use client'
import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import useState from 'react-usestateref'

enum Creator {
  Me = 0,
  Bot = 1
}

interface MessageProps {
  text: string,
  from : Creator,
  key: number
}

interface InputProps {
  onSend:(input:string)=>void;
  disabled: boolean
}

//  On message in the chat

const ChatMessage = ({text, from}: MessageProps) =>{
  return (
    <>
      {
        from == Creator.Me && (
          <div className='bg-white rounded-lg flex gap-4 items-center whitespace-pre-wrap'>
              {/* <Image src='https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg' alt='User' width={40} /> */}
              <p className='text-gray-700'>{text}</p>
          </div>
        )
      }
      {
        from == Creator.Bot && (
          <div className='bg-gray-100 rounded-lg flex gap-4 items-center whitespace-pre-wrap'>
              {/* <Image src='https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg' alt='User' width={40} /> */}
              <p className='text-gray-700'>{text}</p>
          </div>
        )
      }
    </>
  )
}

//  The Chat input field 
const ChatInput = ({onSend, disabled}:InputProps) =>{
  const [input, setInput] = useState('')

  const sendInput = () =>{
    onSend(input)
    setInput('')
  }

  const handleKeyDown = (event: any) =>{
    if(event.keyCode === 13) {
      sendInput()
    }
  }

  return (
    <div className='bg-white border-2 p-2 rounded-lg flex justify-center'>
      <input
        value={input}
        onChange={(ev:any) => setInput(ev.target.value)}
        className='w-full py-2 px-3 text-gray-800 rounded-lg focus:outline-none'
        type='text'
        placeholder='Ask me anything'
        disabled={disabled}
        onKeyDown={(ev) => handleKeyDown(ev)} 
      />

      {
        disabled && (
          <svg
            aria-hidden="true"
            className='mt-1 w-8 mr-2 text-gray-200 animate-spin fill-blue-600'
            viewBox='0 0 100 101'
            fill='none' 
            xmlns='http://www.w3.org/2000/svg'
          >
            hihi
          </svg>
        )
      }
      {
        !disabled && (
          <button
            onClick={()=> sendInput()}
            className='p-2 rounded-md text-gray-500 bottom-1.5 right-1'
          >
            Submit
          </button>
        )
      }
    </div>
  )
}
export default function Home() {
  const [messages, setMessages, messagesRef] = useState<MessageProps[]>([])
  const [loading, setLoading] = useState(false)

  const callApi = async (input:string) =>{
    setLoading(true)

    const myMessage: MessageProps = {
      text: input,
      from: Creator.Me,
      key: new Date().getTime()
    }
    setMessages([...messagesRef.current, myMessage])
    const response = await fetch('/api/generate-answer',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: input
      })
    }).then((response) => response.json())
    setLoading(false)

    if(response.text) {
      const botMessage:MessageProps = {
        text: response.text,
        from : Creator.Bot,
        key: new Date().getTime()
      }
      setMessages([...messagesRef.current, botMessage])
    }else {
      // error
    }
  }

  return (
    <main className='relative mex-w-2xl max-auto'>

      <div className='sticky top-0 w-full pt-10 px-4'>
          <ChatInput onSend={(input) => callApi(input)} disabled={loading} />
      </div>
      <div className='mt-10 px-4'>
        {
          messages.map((msg: MessageProps) => (
            <ChatMessage key={msg.key} text={msg.text} from={msg.from} />
          ))
        }
        {
          messages.length == 0 && <p className='text-center'> I am at your services </p>
        }
      </div>
    </main>
  )
}
