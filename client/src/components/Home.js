import React, { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import '../assets/css/Home.css';

import CreateWorkspaceModal from './CreateWorkspaceModal';

import image_svg from '../img/home-img.svg';

function HomeContainer(infos) {
    const [_infos, ] = useState(infos);
    const [workspaces, setWorkspaces] = useState([]);
    const [workspaceModalOpen, setWorkspaceModalOpen] = useState(false);
    const navigate = useNavigate();
    const { t } = useTranslation();

    const openWorkspaceModal = () => {
        setWorkspaceModalOpen(true);
    };

    const closeWorkspaceModal = () => {
        setWorkspaceModalOpen(false);
    };

    useEffect(() => {

        async function getMyWorkspaces() {
            try {
                const id = _infos.infos.id;

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

        getMyWorkspaces();
    }, [_infos]);

    return (
        <div className="home-container">
            <div className="home-sticky-container">
                <nav className='home-left-sidebar'>
                    <div>
                        <ul className='sidebar-features'>
                            <li className='sidebar-buttons'>
                                <a href={'/' + _infos.infos.id + '/boards'}>
                                    <span className='sidebar-icon'>
                                        <i className="fa-regular fa-pen-to-square"></i>
                                    </span>
                                    <span className='sidebar-text'>{t('boards')}</span>
                                </a>
                            </li>
                            <li className='sidebar-buttons'>
                                <a href='/home'>
                                    <span className='sidebar-icon'>
                                        <i className="fa-solid fa-clapperboard"></i>
                                    </span>
                                    <span className='sidebar-text'>{t('templates')}</span>
                                </a>
                            </li>
                            <li className='sidebar-buttons'>
                                <a href='/home'>
                                    <span className='sidebar-icon'>
                                        <i className="fa-solid fa-heart-pulse"></i>
                                    </span>
                                    <span className='sidebar-text'>{t('home')}</span>
                                </a>
                            </li>
                        </ul>
                        <p className='sidebar-title'>
                            {t('workspaces')}
                        </p>
                        <ul className='sidebar-workspaces'>
                            <li className='sidebar-buttons' key={0}>
                                {workspaces.length > 0 ? workspaces.map(workspace => (
                                    <button onClick={() => navigate('/workspace/' + workspace.id)}>
                                        <span className='sidebar-icon'>
                                            <i className="fa-solid fa-building"></i>
                                        </span>
                                        <span className='sidebar-text'>{workspace.name}</span>
                                    </button>
                                )) :
                                    <button onClick={openWorkspaceModal}>
                                        <span className='sidebar-icon'>
                                            <i className="fa-solid fa-plus"></i>
                                        </span>
                                        <span className='sidebar-text'>{t('create_workspace')}</span>
                                    </button>
                                }
                            </li>
                        </ul>
                    </div>
                </nav>
                <div className='home-main-content-container'>
                    <div className='home-main-content'>
                        <img src={image_svg} alt='Home' className='svg-header' />
                        <div className='home-main-content-body'>
                            <span className='home-main-content-title'>
                                {t('stay_on_track')}
                            </span>
                            <span className='home-main-content-subtitle'>
                                {t('invite_people')}
                            </span>
                        </div>

                    </div>
                </div>
            </div>
            {workspaceModalOpen && (
                <CreateWorkspaceModal closeModal={closeWorkspaceModal} />
            )}
        </div>
    );
}

export default HomeContainer;
