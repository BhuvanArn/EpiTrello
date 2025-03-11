import React, { useContext, useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AuthContext } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';

import '../assets/css/CreateWorkspaceModal.css';

function CreateDropdown({ closeModal}) {
    const { user } = useContext(AuthContext);
    const [workspaceName, setWorkspaceName] = useState('');
    const [workspaceDescription, setWorkspaceDescription] = useState('');
    const modalRef = useRef(null);
    const navigate = useNavigate();


    const handleCloseModal = () => {
        closeModal();
    };

    async function createWorkspace() {
        try {
            console.log(user.id);
            const response = await fetch('http://localhost:8000/workspaces', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    name: workspaceName,
                    description: workspaceDescription,
                    ownerId: user.id
                })
            });

            if (!response.ok) {
                console.error(response);
                return;
            }

            const data = await response.json();

            console.log(data);
            handleCloseModal();
            navigate(`/workspace/${data.id}`);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                closeModal();
            }
        };

        if (modalRef.current) {
            document.addEventListener('mousedown', handleClickOutside);
            document.body.classList.add('modal-open');
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.classList.remove('modal-open');
        };
    }, [modalRef, closeModal]);

    return (
        createPortal(
        <div className="modal-overlay">
            <div className="create-workspace-menu" ref={modalRef}>
                <div className="menu-header">
                    <div>Create Workspace</div>
                    <button className="dropdown-button" onClick={handleCloseModal}>
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
                <div className='menu-image-workspace'>
                        <img src="https://trello.com/assets/d1f066971350650d3346.svg" alt="Presentation" />
                </div>
                <div className="menu-body">
                    <label>
                        Workspace name
                        <input type="text" className="title-input" value={workspaceName} onChange={(e) => setWorkspaceName(e.target.value)} />
                    </label>
                    <label>
                        Description
                        <textarea className="description-input" value={workspaceDescription} onChange={(e) => setWorkspaceDescription(e.target.value)} />
                    </label>
                    <button className="nav-filled-button" onClick={createWorkspace} disabled={!workspaceName}>
                        Create
                    </button>
                </div>
            </div>
        </div>,
            document.body
        )
    );
}

export default CreateDropdown;