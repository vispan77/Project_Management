
import React from 'react'
import { Link } from 'react-router-dom'

function Home() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center px-4">
            <div>
                <h1 className="text-5xl font-extrabold text-gray-900 mb-6">
                    Manage Your Projects <span className="text-green-600">Effortlessly</span>
                </h1>
                <p className="text-xl text-gray-600 mb-10 max-w-2xl">
                    The ultimate tool for teams to organize, track, and complete tasks on time.
                    Streamline your workflow and boost productivity today.
                </p>

                <Link to="/projects">
                    <button className='bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-md font-semibold transition-colors'>
                        View Projects
                    </button>
                </Link>
            </div>
        </div>
    )
}

export default Home
