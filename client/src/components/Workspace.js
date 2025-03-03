import React, { useState } from 'react';
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import '../assets/css/WorkspacePage.css';

import Navbar from './Navbar';
import CreateBoardModal from './CreateBoardModal';

function WorkspacePage() {
    const { workspaceId } = useParams();
    const [workspace, setWorkspace] = useState(null);
    const [boards, setBoards] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch the workspace data using the workspaceId
        async function fetchWorkspace() {
            try {
                const response = await fetch(`http://localhost:8000/workspaces?` + new URLSearchParams({ id: workspaceId }).toString(), {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${localStorage.getItem('token')}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setWorkspace(data[0]);
                } else {
                    console.error(response);
                }
            } catch (error) {
                console.error(error);
            }
        }

        async function fetchBoards() {
            try {
                const response = await fetch(`http://localhost:8000/boards?` + new URLSearchParams({ workspaceId }).toString(), {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${localStorage.getItem('token')}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setBoards(data);
                    console.log(data);
                } else {
                    console.error(response);
                }
            } catch (error) {
                console.error(error);
            }
        };



        fetchWorkspace();
        fetchBoards();
    }, [workspaceId]);

    return (
        <div className='main-page main-page-dark'>
            <Navbar />
            <div className="workspace-container">
                <div>
                    <div className="workspace-header">
                        <div>
                            <div className="workspace-title">
                                <div>
                                    <button className="workspace-icon-button">
                                        <div className="workspace-icon">
                                            {workspace && workspace.name.charAt(0).toUpperCase()}
                                        </div>
                                    </button>
                                </div>
                                <div className="workspace-name">
                                    <h2>{workspace && workspace.name}</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr className="workspace-separator"/>
                    <div className="workspace-content">
                        <main className="workspace-boards">
                            <h2 className="workspace-boards-title">Boards</h2>
                            <section className="workspace-boards-list">
                                <ul className="workspace-boards-list-ul">
                                    <li>
                                        <CreateBoardModal showCreateButton={false} initialWorkspaceId={workspaceId} />
                                        <button className="workspace-board-creation-button" onClick={() => document.querySelector('.nav-filled-button').click()}>
                                            <div className="creation-text">
                                                <span>Create new board</span>
                                            </div>
                                        </button>
                                    </li>
                                    {boards.map((board) => {
                                    return <li>
                                            <button className="workspace-board-button" key={board.id} onClick={() => navigate(`/board/${board.id}`)}>
                                                <div className="workspace-board">
                                                    <div className="workspace-board-name">
                                                        <span>{board.title}</span>
                                                    </div>
                                                </div>
                                            </button>
                                        </li>
                                    })}
                                </ul>

                            </section>
                        </main>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WorkspacePage;
