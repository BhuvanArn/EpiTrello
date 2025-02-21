import React, { useState, useRef, useEffect, useContext } from 'react';
import { createPortal } from 'react-dom';
import MDEditor from '@uiw/react-md-editor';

import { AuthContext } from '../auth/AuthContext';

import '../assets/css/CardModal.css';

function CardModal({ card, closeModal }) {
    const { user } = useContext(AuthContext);
    const [editingTitle, setEditingTitle] = useState(false);
    const [newTitle, setNewTitle] = useState(card.title);

    const [editingDescription, setEditingDescription] = useState(false);
    const [newDescription, setNewDescription] = useState(card.description || '');

    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    const inputRef = useRef(null);

    // ref to handle modal clicking
    const modalRef = useRef(null);

    const handleTitleClick = () => {
        setEditingTitle(true);
    };

    const handleTitleChange = (e) => {
        setNewTitle(e.target.value);
    };

    const handleTitleKeyDown = async (e) => {
        if (e.key === 'Enter') {
            try {
                const response = await fetch(`http://localhost:8000/cards/`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({ title: newTitle, cardId: card.id })
                });

                if (response.ok) {
                    window.location.reload();
                } else {
                    console.error(response);
                }
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleSaveDescription = async () => {
        try {
            const response = await fetch(`http://localhost:8000/cards/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ description: newDescription, cardId: card.id })
            });

            if (response.ok) {
                setEditingDescription(false);
                card.description = newDescription; // Update the card description
            } else {
                console.error(response);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleAddComment = async () => {
        try {
            const response = await fetch(`http://localhost:8000/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ text: newComment, cardId: card.id, creatorId: user.id })
            });

            if (response.ok) {
                const comment = await response.json();
                setComments([...comments, comment]);
                setNewComment('');
            } else {
                console.error(response);
            }
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

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [closeModal]);

    useEffect(() => {
        async function fetchComments() {
            try {
                const response = await fetch(`http://localhost:8000/cards/${card.id}/comments`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${localStorage.getItem('token')}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setComments(data);
                } else {
                    console.error(response);
                }
            } catch (error) {
                console.error(error);
            }
        }

        fetchComments();
    }, [card.id]);

    return createPortal(
        <div className="modal-overlay">
            <div className="card-modal" ref={modalRef}>
                <div className="card-modal-header">
                    <div className="card-modal-title">
                        <i class="fa-regular fa-hard-drive"></i>
                        {editingTitle ? (
                            <input
                                ref={inputRef}
                                type="text"
                                value={newTitle}
                                onChange={handleTitleChange}
                                onKeyDown={handleTitleKeyDown}
                                onBlur={() => setEditingTitle(false)}
                                autoFocus
                            />
                        ) : (
                            <h2 onClick={handleTitleClick}>{card.title}</h2>
                        )}
                    </div>
                    <button className="card-modal-close-button" onClick={closeModal}>
                        <i className="fa-solid fa-times"></i>
                    </button>
                </div>
                <div className="card-modal-description">
                    <i className="fa-solid fa-list-check"></i>
                    <h3>Description</h3>
                    {editingDescription ? (
                        <div className="description-editor">
                            <MDEditor
                                value={newDescription}
                                onChange={setNewDescription}
                                textareaProps={{
                                    placeholder: `Please enter the card's description...`,
                                  }}
                                className="description-editor-textarea"
                            />
                            <div className="description-editor-buttons">
                                <button className="save-button" onClick={handleSaveDescription}>Save</button>
                                <button className="cancel-button" onClick={() => setEditingDescription(false)}>
                                    <i className="fa-solid fa-times"></i>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button className="add-description-button" onClick={() => setEditingDescription(true)}>
                            {card.description ? <MDEditor.Markdown source={card.description} /> : 'Add a description...'}
                        </button>
                    )}
                </div>
                <div className='card-modal-activity'>
                    <i className="fa-solid fa-comments"></i>
                    <h3>Activity</h3>
                    <div className="activity-grid">
                        <div className="activity-item">
                            <img src={user.picture} alt="User" className="activity-user-picture" />
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Write a comment..."
                                className="activity-comment-input"
                            />
                            <button className="save-button" onClick={handleAddComment}>Comment</button>
                        </div>
                        {comments.map((comment) => (
                            <div key={comment.id} className="activity-item">
                                <img src={null} alt="User" className="activity-user-picture" />
                                <div className="activity-comment">
                                    <p>{comment.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}

export default CardModal;
