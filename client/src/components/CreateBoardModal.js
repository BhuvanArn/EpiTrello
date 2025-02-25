import React, { useContext, useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AuthContext } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';

import '../assets/css/CreateBoardModal.css';

function CreateDropdown({ showCreateButton = true, initialWorkspaceId = null }) {
    const { user } = useContext(AuthContext);
    const [createBoardOpen, setCreateBoardOpen] = useState(false);
    const [boardTitle, setBoardTitle] = useState('');
    const [visibility, setVisibility] = useState('Private');
    const [workspaces, setWorkspaces] = useState([]);
    const modalRef = useRef(null);
    const navigate = useNavigate();

    const openCreateBoard = () => {
        setCreateBoardOpen(true);
    };

    const closeCreateBoard = () => {
        setCreateBoardOpen(false);
    };

    async function createDefaultWorkspace() {
        try {

            const response = await fetch(`http://localhost:8000/workspaces`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    name: `${user.name}'s workspace`,
                    description: 'Your workspace',
                    ownerId: user.id
                })
            });

            if (!response.ok) {
                console.error(response);
                return null;
            }
            const data = await response.json();

            return data;
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                closeCreateBoard();
            }
        };

        async function getMyWorkspaces() {
            try {
                const id = user.id;

                const response = await fetch(`http://localhost:8000/workspaces?` + new URLSearchParams({ userId: id }).toString(), {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${localStorage.getItem('token')}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setWorkspaces(data);
                } else {
                    console.error(response);
                }
            } catch (error) {
                console.error(error);
            }
        };

        if (createBoardOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.body.classList.add('modal-open');
            getMyWorkspaces();
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.classList.remove('modal-open');
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.classList.remove('modal-open');
        };
    }, [createBoardOpen, user]);

    const handleCreateBoard = async () => {
        if (!boardTitle) return;

        try {
            let workspaceId = "";

            if (initialWorkspaceId) {
                workspaceId = initialWorkspaceId;
            } else {
                if (workspaces.length > 1) {
                    workspaceId = document.querySelector('select').value;
                } else if (workspaces.length === 1) {
                    workspaceId = workspaces[0].id;
                } else {
                    workspaceId = await createDefaultWorkspace();
                    workspaceId = workspaceId.id;
                }
            }

            const response = await fetch(`http://localhost:8000/boards`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    title: boardTitle,
                    visibility: visibility,
                    workspaceId: workspaceId
                })
            });

            if (!response.ok) {
                console.error(response);
                return;
            }

            const data = await response.json();
            console.log("board info", data);
            navigate(`/board/${data.id}`);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="nav-filled-buttons">
            {showCreateButton && (
                <button className="nav-filled-button" onClick={openCreateBoard}>
                    <span>Create</span>
                </button>
            )}
            {createBoardOpen && (
                createPortal(
                <div className="modal-overlay">
                    <div className="create-board-menu" ref={modalRef}>
                        <div className="menu-header">
                            <div>Create board</div>
                            <button className="dropdown-button" onClick={closeCreateBoard}>
                                <i class="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                        <div className='menu-image'>
                            <div className='menu-image-inner'>
                                <img src="https://trello.com/assets/14cda5dc635d1f13bc48.svg" alt="Presentation" />
                            </div>
                        </div>
                        <div className="menu-body">
                            <label>
                                Board Title (required)
                                <input type="text" className="title-input" value={boardTitle} onChange={(e) => setBoardTitle(e.target.value)} />
                            </label>
                            {workspaces.length > 1 && (
                                <label>
                                    Workspace
                                    <select>
                                        {workspaces.map((workspace) => (
                                            <option value={workspace.id}>{workspace.name}</option>
                                        ))}
                                    </select>
                                </label>
                            )}
                            <label>
                                Visibility
                                <select value={visibility} onChange={(e) => setVisibility(e.target.value)} className='visibility-input'>
                                    <option value="Private">Private</option>
                                    <option value="Public">Public</option>
                                </select>
                            </label>
                            <button className="nav-filled-button" onClick={handleCreateBoard} disabled={!boardTitle}>
                                Create
                            </button>
                        </div>
                    </div>
                </div>,
                    document.body
                )
            )}
        </div>
    );
}

export default CreateDropdown;