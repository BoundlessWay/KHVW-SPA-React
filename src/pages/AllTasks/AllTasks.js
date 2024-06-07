import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShareAlt, faEye, faEllipsisH, faRedo, faLifeRing, faBell, faSearch, faArrowUp, faTrash } from '@fortawesome/free-solid-svg-icons';
import '../../assets/styles/MyList.css';
import { v4 as uuidv4 } from 'uuid';
import DetailTask from '../../components/DetailTask/DetailTask';

const AllTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [newTask, setNewTask] = useState('');

    useEffect(() => {
        const allTasks = [];
        const listTypes = ['personal', 'work', 'grocerylist'];

        listTypes.forEach((type) => {
            const storedTasks = JSON.parse(localStorage.getItem(type)) || [];
            storedTasks.forEach(task => allTasks.push({ ...task, type: type }));
        });

        setTasks(allTasks);
        setSelectedTask(allTasks.length > 0 ? allTasks[allTasks.length - 1] : null);
    }, []);

    const saveTasksToLocalStorage = (tasks, listType) => {
        const updatedTasks = tasks.filter(task => task.type === listType);
        localStorage.setItem(listType, JSON.stringify(updatedTasks));
    };

    const addTask = (taskContent) => {
        if (taskContent.trim()) {
            const newTask = { id: uuidv4(), content: taskContent.trim(), type: 'personal', note: "" }; // Default to 'personal' or change as needed
            const updatedTasks = [...tasks, newTask];
            setTasks(updatedTasks);
            setSelectedTask(newTask);
            setNewTask('');
            saveTasksToLocalStorage(updatedTasks, 'personal'); // Save to 'personal' or change as needed
            window.dispatchEvent(new Event('storage'));
        }
    };

    const deleteTask = (taskId, taskListType) => {
        const updatedTasks = tasks.filter(task => task.id !== taskId);
        setTasks(updatedTasks);
        if (selectedTask && selectedTask.id === taskId) {
            setSelectedTask(updatedTasks.length > 0 ? updatedTasks[updatedTasks.length - 1] : null);
        }
        saveTasksToLocalStorage(updatedTasks, taskListType);
        window.dispatchEvent(new Event('storage'));
    };

    return (
        <div className="mylist">
            <div className="toolbar">
                <div className="toolbar-left">
                    <span>All Tasks</span>
                    <span className="divider"></span>
                    <span><FontAwesomeIcon icon={faShareAlt} /> Share</span>
                    <span className="divider"></span>
                    <span><FontAwesomeIcon icon={faEye} /> View</span>
                    <span className="divider"></span>
                    <span><FontAwesomeIcon icon={faEllipsisH} /></span>
                </div>
                <div className="toolbar-right">
                    <span><FontAwesomeIcon icon={faRedo} /></span>
                    <span><FontAwesomeIcon icon={faLifeRing} /></span>
                    <span><FontAwesomeIcon icon={faBell} /></span>
                    <span><FontAwesomeIcon icon={faSearch} /></span>
                </div>
            </div>
            <div className="mylist-content">
                <div className="addTask">
                    <div className="task-list">
                        {tasks.slice().reverse().map((task, index) => (  // Reverse the tasks array before mapping
                            <div
                                key={task.id}
                                className={`task-item ${selectedTask && selectedTask.id === task.id ? 'selected' : ''}`}
                                onClick={() => setSelectedTask(task)}
                            >
                                {task.content}
                                <FontAwesomeIcon
                                    icon={faTrash}
                                    className="delete-icon"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteTask(task.id, task.type);
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="add-task-form">
                        <input
                            type="text"
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                            placeholder="Add a task"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    addTask(e.target.value);
                                }
                            }}
                        />
                        <button onClick={() => addTask(newTask)}>
                            <FontAwesomeIcon icon={faArrowUp} />
                        </button>
                    </div>
                </div>
                {selectedTask && selectedTask.type && <DetailTask taskId={selectedTask.id} listType={selectedTask.type} />}
            </div>
        </div>
    );
};

export default AllTasks;
