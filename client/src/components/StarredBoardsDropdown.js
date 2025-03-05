import React, { useState, useEffect, useRef, useContext } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import '../assets/css/StarredBoardsDropdown.css';

import { AuthContext } from '../auth/AuthContext';

function StarredBoardsDropdown({ closeDropdown }) {
    const { user } = useContext(AuthContext);
    const [starredBoards, setStarredBoards] = useState([]);
    const [loading, setLoading] = useState(true);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        async function getStarredBoardsName(id) {
            try {
                const response = await fetch(`http://localhost:8000/boards/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${localStorage.getItem('token')}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    return data.title;
                }
            } catch (error) {
                console.error(error);
            }
        }

        async function fetchStarredBoards() {
            try {
                const response = await fetch(`http://localhost:8000/starboard?` + new URLSearchParams({ userId: user.id }).toString(), {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${localStorage.getItem('token')}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    const titles = await Promise.all(data.map(board => getStarredBoardsName(board.board_id)));
                    const starredBoards = data.map(board => ({ ...board, title: titles[data.indexOf(board)] }));
                    setStarredBoards(starredBoards);
                } else {
                    console.error(response);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        fetchStarredBoards();

        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                closeDropdown();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [closeDropdown, user.id]);

    const handleUnstarBoard = async (boardId) => {
        try {
            const response = await fetch('http://localhost:8000/starboard', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ boardId, userId: user.id })
            });

            if (response.ok) {
                setStarredBoards(starredBoards.filter(board => board.board_id !== boardId));
                window.location.reload();
            } else {
                console.error(response);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return createPortal(
        <div className='starred-dropdown-menu active' ref={dropdownRef}>
            <div className="starred-dropdown-field">
                {loading ? (
                    <p>Loading...</p>
                ) : starredBoards.length > 0 ? (
                    <ul>
                        {starredBoards.map(board => (
                            <li key={board.board_id} className="starred-board-item">
                                <button className="board-link" onClick={() => navigate(`/board/${board.board_id}`)}>
                                    {board.title}
                                </button>
                                <button className="unstar-button" onClick={() => handleUnstarBoard(board.board_id)}>
                                    <i className="fa-solid fa-star" style={{ color: 'yellow' }}></i>
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="no-starred-boards">
                        <img src="https://trello.com/assets/cc47d0a8c646581ccd08.svg" alt="No starred boards" />
                        <p>Star important boards to access them quickly and easily.</p>
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
}

export default StarredBoardsDropdown;
