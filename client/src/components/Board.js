import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import { AuthContext } from '../auth/AuthContext';
import Navbar from './Navbar';
import CreateBoardModal from './CreateBoardModal';
import CardModal from './CardModal';

import '../assets/css/BoardPage.css';

function BoardPage() {
    const { user } = useContext(AuthContext);

    // boardId in the URL
    const { boardId } = useParams();

    // board informartions got from the server with the boardId
    const [board, setBoard] = useState(null);

    // workspaceId of the board
    const [workspaceId, setWorkspaceId] = useState(null);

    // workspace informations got from the server with the workspaceId
    const [workspace, setWorkspace] = useState(null);

    // lists of the board
    const [lists, setLists] = useState([]);

    // new list title and new card title, when adding a new list or a new card
    const [newListTitle, setNewListTitle] = useState('');
    const [newCardTitle, setNewCardTitle] = useState('');

    // addingList and addingCard states to show the form to add a new list or a new card
    const [addingList, setAddingList] = useState(false);
    const [addingCard, setAddingCard] = useState(null);

    // editingTitle state to show the input to edit the board title
    const [editingTitle, setEditingTitle] = useState(false);

    // starred state to know if the board is starred or not
    const [starred, setStarred] = useState(false);

    // sidebarOpen state to know if the sidebar is open or not
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // editingListId and editingListTitle states to show the input to edit the list title
    const [editingListId, setEditingListId] = useState(null);
    const [editingListTitle, setEditingListTitle] = useState('');

    const [selectedCard, setSelectedCard] = useState(null);

    const navigate = useNavigate();
    const location = useLocation();

    const inputRef = React.useRef();

    useEffect(() => {
        async function fetchBoard() {
            try {
                const response = await fetch(`http://localhost:8000/boards/${boardId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${localStorage.getItem('token')}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setBoard(data);
                    setWorkspaceId(data.workspace_id);
                } else {
                    console.error(response);
                }
            } catch (error) {
                console.error(error);
            }
        }

        async function fetchStarredBoards() {
            if (!user || !user.id) return;
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
                    setStarred(data.some(board => board["board_id"] === boardId));
                } else {
                    console.error(response);
                }
            } catch (error) {
                console.error(error);
            }
        }

        fetchBoard();
        fetchStarredBoards();
    }, [boardId, user]);

    useEffect(() => {

        async function fetchBoardsOfWorkspace() {
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
                    console.log('boards: ', data);
                    setWorkspace(prevWorkspace => ({
                        ...prevWorkspace,
                        boards: data
                    }));
                } else {
                    console.error(response);
                }
            } catch (error) {
                console.error(error);
            }
        };

        async function fetchWorkspaceOfBoard() {
            if (!workspaceId) return;
            try {
                const response = await fetch(`http://localhost:8000/workspaces/${workspaceId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${localStorage.getItem('token')}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    data[0].boards = [];
                    setWorkspace(data[0]);
                    await fetchBoardsOfWorkspace();
                } else {
                    console.error(response);
                }
            } catch (error) {
                console.error(error);
            }
        }

        fetchWorkspaceOfBoard();
    }, [workspaceId]);

    useEffect(() => {

        async function fetchCardsOfLists() {
            try {
                const response = await fetch(`http://localhost:8000/boards/${boardId}/cards`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${localStorage.getItem('token')}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setLists(prevLists => prevLists.map(list => ({
                        ...list,
                        cards: data.filter(card => card.list_id === list.id).sort((a, b) => a.position - b.position)
                    })));
                } else {
                    console.error(response);
                }
            } catch (error) {
                console.error(error);
            }
        }

        async function fetchListsOfBoard() {
            try {
                const response = await fetch(`http://localhost:8000/lists?` + new URLSearchParams({ boardId }).toString(), {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${localStorage.getItem('token')}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setLists(data);
                    await fetchCardsOfLists();
                } else {
                    console.error(response);
                }
            } catch (error) {
                console.error(error);
            }
        }

        fetchListsOfBoard();
    }, [boardId]);

    // Edit the starBoard function to send a POST request to the server
    const handleStarBoard = async () => {
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
                setStarred(!starred);
            } else {
                console.error(response);
            }
        } catch (error) {
            console.error(error);
        }
    };


    // Edit the handleAddList function to send a POST request to the server
    const handleAddList = async () => {
        try {
            const response = await fetch('http://localhost:8000/lists', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ title: newListTitle, boardId })
            });

            if (response.ok) {
                const newList = await response.json();
                setLists([...lists, newList]);
                setNewListTitle('');
                setAddingList(false);
            } else {
                console.error(response);
            }
        } catch (error) {
            console.error(error);
        }
    };


    // Edit the handleAddCard function to send a POST request to the server
    const handleAddCard = async (listId) => {
        try {
            const response = await fetch('http://localhost:8000/cards', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ title: newCardTitle, listId, boardId })
            });

            if (response.ok) {
                const newCard = await response.json();
                setLists(lists.map(list => list.id === listId ? { ...list, cards: [...list.cards, newCard] } : list));
                setNewCardTitle('');
            } else {
                console.error(response);
            }
        } catch (error) {
            console.error(error);
        }
    };


    // Edit the handleBoardTitleChange function to send a PUT request to the server
    const handleBoardTitleChange = async (e) => {
        if (e.key === 'Enter') {
            try {
                const response = await fetch(`http://localhost:8000/boards`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({ title: board.title, boardId })
                });

                if (response.ok) {
                    setEditingTitle(false);
                    window.location.reload();
                } else {
                    console.error(response);
                }
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleListTitleChange = async (e, listId) => {
        if (e.key === 'Enter') {
            try {
                const response = await fetch(`http://localhost:8000/lists`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({ title: editingListTitle, listId })
                });

                if (response.ok) {
                    setLists(lists.map(list => list.id === listId ? { ...list, title: editingListTitle } : list));
                    setEditingListId(null);
                    setEditingListTitle('');
                } else {
                    console.error(response);
                }
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleClickOutside = (event) => {
        if (inputRef.current && !inputRef.current.contains(event.target)) {
            setEditingListId(null);
            setEditingListTitle('');
        }
    };

    useEffect(() => {
        if (editingListId) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [editingListId]);

    const onDragEnd = async (result) => {
        const { source, destination } = result;

        if (!destination) {
            return;
        }

        if (source.droppableId === destination.droppableId && source.index === destination.index) {
            return;
        }

        const sourceList = lists.find(list => list.id === source.droppableId);
        const destinationList = lists.find(list => list.id === destination.droppableId);

        const sourceCards = Array.from(sourceList.cards);
        const [movedCard] = sourceCards.splice(source.index, 1);

        if (source.droppableId === destination.droppableId) {
            sourceCards.splice(destination.index, 0, movedCard);
            const updatedList = { ...sourceList, cards: sourceCards.map((card, index) => ({ ...card, position: index, list_id: source.droppableId })) };
            setLists(lists.map(list => list.id === source.droppableId ? updatedList : list));
            await updateCardPositions(updatedList.cards);
        } else {
            const destinationCards = Array.from(destinationList.cards);
            destinationCards.splice(destination.index, 0, movedCard);
            const updatedSourceList = { ...sourceList, cards: sourceCards.map((card, index) => ({ ...card, position: index, list_id: source.droppableId })) };
            const updatedDestinationList = { ...destinationList, cards: destinationCards.map((card, index) => ({ ...card, position: index, list_id: destination.droppableId })) };
            setLists(lists.map(list => {
                if (list.id === source.droppableId) return updatedSourceList;
                if (list.id === destination.droppableId) return updatedDestinationList;
                return list;
            }));
            await updateCardPositions(updatedSourceList.cards);
            await updateCardPositions(updatedDestinationList.cards);
        }
    };

    const updateCardPositions = async (cards) => {
        try {
            await fetch(`http://localhost:8000/cards/positions`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    cards: cards.map(card => ({ id: card.id, position: card.position, list_id: card.list_id }))
                })
            });
        } catch (error) {
            console.error('Error updating card positions:', error);
        }
    };

    const handleCardClick = (card) => {
        setSelectedCard(card);
    };

    const closeModal = () => {
        setSelectedCard(null);
    };


    return (
        <div className='main-page main-page-dark'>
            <Navbar />
            <div className="board-container">
                <div className={`sidebar-container ${sidebarOpen ? '' : 'not-expanded'}`}>
                    <div className={`sidebar-nav ${sidebarOpen ? 'expanded' : 'collapsed'}`}>
                        <div className="sidebar">
                            <div className="workspace-bar-header">
                                <div className="workspace-bar-icon">
                                    {workspace && workspace.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="workspace-bar-infos">
                                    <span className="title">
                                        <p className="workspace-bar-name">{workspace && workspace.name}</p>
                                    </span>
                                    <p className="workspace-bar-plan">Free</p>
                                </div>
                                {sidebarOpen && (
                                    <button className="sidebar-toggle-button" onClick={() => setSidebarOpen(!sidebarOpen)}>
                                        <i className="fa-solid fa-chevron-left"></i>
                                    </button>
                                )}
                            </div>
                            <div className="workspace-buttons-and-views">
                                <div>
                                    <div className="workspace-sidebar-buttons">
                                        <a className="workspace-sidebar-button" href={`/workspace/${workspaceId}`}>
                                            <span className="workspace-sidebar-icon">
                                                <i className="fa-regular fa-pen-to-square"></i>
                                            </span>
                                            <p className="workspace-sidebar-text">Boards</p>
                                        </a>
                                        <a className="workspace-sidebar-button" href={`/workspace/${workspaceId}/members`}>
                                            <span className="workspace-sidebar-icon">
                                                <i class="fa-regular fa-user"></i>
                                            </span>
                                            <p className="workspace-sidebar-text">Members</p>
                                        </a>
                                        <button className="workspace-sidebar-button">
                                            <span className="workspace-sidebar-icon">
                                                <i class="fa-solid fa-gear"></i>
                                            </span>
                                            <p className="workspace-sidebar-text">Workspace settings</p>
                                        </button>
                                    </div>
                                    <div className="workspace-sidebar-views">
                                        <div className="sidebar-views-title">
                                            <h2>Workspace views</h2>
                                        </div>
                                        <ul className="views-list">
                                            <div className="views-container">
                                                <li className="views-list-item" onClick={() => navigate(`/workspace/${workspaceId}/views/table`)}>
                                                    <div className="views-list-icon">
                                                        <i class="fa-solid fa-table"></i>
                                                    </div>
                                                    <p className="views-list-text">Table</p>
                                                </li>
                                                <li className="views-list-item" onClick={() => navigate(`/workspace/${workspaceId}/views/calendar`)}>
                                                    <div className="views-list-icon">
                                                        <i class="fa-regular fa-calendar"></i>
                                                    </div>
                                                    <p className="views-list-text">Calendar</p>
                                                </li>
                                            </div>
                                        </ul>
                                    </div>
                                    <div className='workspace-sidebar-boards'>
                                        <div className='sidebar-boards-title'>
                                            <h2>Your boards</h2>
                                            <button className='sidebar-boards-add-button' onClick={() => document.querySelector('.nav-filled-button').click()}>
                                                <i class="fa-solid fa-plus"></i>
                                            </button>
                                            <CreateBoardModal showCreateButton={false} initialWorkspaceId={workspaceId} />
                                        </div>
                                        <ul className='sidebar-boards-list'>
                                            <div className='sidebar-board-list-container'>
                                            {workspace && workspace.boards && workspace.boards.map(board => (
                                                <li key={board.id} className={`sidebar-boards-list-item ${location.pathname.includes(board.id) ? 'active' : ''}`} onClick={() => navigate(`/board/${board.id}`)}>
                                                    <div className="sidebar-board-icon" style={{ backgroundImage: 'url(https://trello.com/assets/707f35bc691220846678.svg)' }}></div>
                                                    <a className='sidebar-boards-list-text' href={'/board/' + board.id }>{board.title}</a>
                                                </li>
                                            ))}
                                            </div>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {!sidebarOpen && (
                        <button className="sidebar-toggle-button collapsed" onClick={() => setSidebarOpen(!sidebarOpen)}>
                            <i className="fa-solid fa-chevron-right"></i>
                        </button>
                    )}
                </div>
                <div className="board-content" style={{ backgroundImage: 'url(https://trello.com/assets/707f35bc691220846678.svg)' }}>
                    <div className="sub-navbar">
                        <div className='board-sub-navbar'>
                            <span className='board-sub-navbar-left-part'>
                                <div className="board-sub-navbar-title">
                                    {editingTitle ? (
                                        <input
                                            type="text"
                                            value={board.title}
                                            onChange={(e) => setBoard({ ...board, title: e.target.value })}
                                            onKeyDown={handleBoardTitleChange}
                                        />
                                    ) : (
                                        <h1 onClick={() => setEditingTitle(true)}>{board && board.title}</h1>
                                    )}
                                </div>
                                <div>
                                    <button className="board-sub-navbar-star-button" onClick={handleStarBoard}>
                                        <span>
                                            <i className={`fa-star ${starred ? 'fa-solid' : 'fa-regular'}`}></i>
                                        </span>
                                    </button>
                                </div>
                            </span>
                            <span className='board-sub-navbar-right-part'>
                                <button className="board-sub-navbar-settings-button">
                                    <i class="fa-solid fa-ellipsis"></i>
                                </button>
                            </span>
                        </div>
                    </div>
                    <div className="lists-container">
                        <DragDropContext onDragEnd={onDragEnd}>
                            <ol className="lists">
                                {lists.map(list => (
                                    <Droppable key={list.id} droppableId={list.id}>
                                        {(provided) => (
                                        <li key={list.id} className="list" ref={provided.innerRef} {...provided.droppableProps}>
                                            <div className='list-encapsulation'>
                                                <div className="list-header">
                                                    {editingListId === list.id ? (
                                                        <input
                                                            ref={inputRef}
                                                            type="text"
                                                            value={editingListTitle}
                                                            onChange={(e) => setEditingListTitle(e.target.value)}
                                                            onKeyDown={(e) => handleListTitleChange(e, list.id)}
                                                        />
                                                    ) : (
                                                        <h2 onClick={() => {
                                                            setEditingListId(list.id);
                                                            setEditingListTitle(list.title);
                                                        }}>{list.title}</h2>
                                                    )}
                                                    <button className='list-header-more-button'>
                                                        <i class="fa-solid fa-ellipsis"></i>
                                                    </button>
                                                </div>
                                                {/* ol here for cards list */}
                                                <ol className="cards">
                                                    {list && list.cards && list.cards.map((card, index) => (
                                                        <Draggable key={card.id} draggableId={card.id} index={index}>
                                                            {(provided) => (
                                                                <li className="card" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}  onClick={() => handleCardClick(card)}>
                                                                    {card.title}
                                                                </li>
                                                            )}
                                                        </Draggable>
                                                    ))}
                                                    {provided.placeholder}
                                                    {addingCard === list.id && (
                                                        <li className='list-add-card-form'>
                                                            <form className='list-add-card-form-container'>
                                                                <textarea className='list-add-card-form-textarea' value={newCardTitle} onChange={(e) => setNewCardTitle(e.target.value)} placeholder='Enter a title for this card...'></textarea>
                                                                <div className='list-add-card-form-buttons'>
                                                                    <button className='add-card-button' onClick={() => handleAddCard(list.id)}>Add Card</button>
                                                                    <button className='cancel-card-button' onClick={() => setAddingCard(null)}>
                                                                        <i className="fa-solid fa-times"></i>
                                                                    </button>
                                                                </div>
                                                            </form>
                                                        </li>
                                                    )}
                                                </ol>
                                                {addingCard !== list.id && (
                                                    <div className='list-footer'>
                                                        <button className='list-footer-add-card-button' onClick={() => setAddingCard(list.id)}>
                                                            <i className="fa-solid fa-plus"></i>
                                                            <span>Add a card</span>
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </li>
                                        )}
                                    </Droppable>
                                ))}
                                {addingList ? (
                                    <div className='list-adder-form'>
                                        <form className='list-adder-form-container'>
                                            <textarea className='list-adder-form-textarea' value={newListTitle} onChange={(e) => setNewListTitle(e.target.value)} placeholder='Enter list name...'></textarea>
                                            <div className='list-adder-form-buttons'>
                                                <button className='add-list-button' onClick={handleAddList}>Add List</button>
                                                <button className='cancel-list-button' onClick={() => setAddingList(false)}>
                                                    <i class="fa-solid fa-times"></i>
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                ) : (
                                    <div className="list-adder-container">
                                        <button className="list-adder-button" onClick={() => setAddingList(true)}>
                                            <i class="fa-solid fa-plus"></i>
                                            <span>Add a list</span>
                                        </button>
                                    </div>
                                )}
                            </ol>
                        </DragDropContext>
                    </div>
                </div>
            </div>
            {selectedCard && <CardModal card={selectedCard} closeModal={closeModal} />}
        </div>
    );
}

export default BoardPage;
