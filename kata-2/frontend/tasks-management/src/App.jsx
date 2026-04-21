// import { useCallback, useEffect, useState } from 'react';
// import api from './services/api';
// import { PlusIcon, TrashIcon, CheckCircleIcon, CircleStackIcon } from '@heroicons/react/24/outline';

// function App() {
//   const [tasks, setTasks] = useState([]);
//   const [newTask, setNewTask] = useState('');
//   const [filter, setFilter] = useState('all');

//   const fetchTasks = useCallback(async () => {
//     try {
//       const response = await api.get('/tasks');
//       setTasks(response.data);
//     } catch (error) { console.error(error); }
//   }, []);

//   useEffect(() => {
//     const timeoutId = setTimeout(() => {
//       fetchTasks();
//     }, 0);
//     return () => clearTimeout(timeoutId);
//   }, [fetchTasks]);

//   const handleCreate = async (e) => {
//     e.preventDefault();
//     if (!newTask.trim()) return;
//     await api.post('/tasks', { title: newTask, completed: false });
//     setNewTask('');
//     fetchTasks();
//   };

//   const handleToggle = async (id, status) => {
//     await api.patch(`/tasks/${id}`, { completed: !status });
//     fetchTasks();
//   };

//   const handleDelete = async (id) => {
//     await api.delete(`/tasks/${id}`);
//     fetchTasks();
//   };

//   const filteredTasks = tasks.filter(t => {
//     if (filter === 'pending') return !t.completed;
//     if (filter === 'completed') return t.completed;
//     return true;
//   });

//   return (
//     <div className="min-h-screen py-12 px-4 bg-slate-50 font-sans">
//       <div className="max-w-xl mx-auto">
//         <header className="mb-10 text-center">
//           <div className="inline-flex items-center justify-center p-3 bg-indigo-600 rounded-2xl mb-4 shadow-lg shadow-indigo-200">
//             <CircleStackIcon className="w-8 h-8 text-white" />
//           </div>
//           <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">TaskMana</h1>
//           <p className="text-slate-500 mt-2 font-medium">Task Manager</p>
//         </header>

//         <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-2 mb-8 focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
//           <form onSubmit={handleCreate} className="flex items-center">
//             <input 
//               type="text" 
//               className="flex-1 bg-transparent border-none focus:ring-0 px-4 py-3 text-slate-700 placeholder-slate-400 font-medium"
//               placeholder="O que precisa ser feito?"
//               value={newTask}
//               onChange={(e) => setNewTask(e.target.value)}
//             />
//             <button className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-xl transition-all shadow-md active:scale-95">
//               <PlusIcon className="w-6 h-6" />
//             </button>
//           </form>
//         </div>

//         <div className="flex justify-center gap-3 mb-8">
//           {['all', 'pending', 'completed'].map((f) => (
//             <button
//               key={f}
//               onClick={() => setFilter(f)}
//               className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
//                 filter === f ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-100'
//               }`}
//             >
//               {f === 'all' ? 'Todas' : f === 'pending' ? 'Pendentes' : 'Concluídas'}
//             </button>
//           ))}
//         </div>

//         <div className="space-y-4">
//           {filteredTasks.map(task => (
//             <div key={task.id} className="group bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between hover:border-indigo-200 hover:shadow-xl transition-all">
//               <div className="flex items-center gap-4">
//                 <button 
//                   onClick={() => handleToggle(task.id, task.completed)}
//                   className={`transition-all duration-300 ${task.completed ? 'text-emerald-500' : 'text-slate-300 hover:text-indigo-400'}`}
//                 >
//                   <CheckCircleIcon className="w-7 h-7" />
//                 </button>
//                 <div>
//                   <h3 className={`text-base font-semibold ${task.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>
//                     {task.title}
//                   </h3>
//                   <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${task.completed ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
//                     {task.completed ? 'Finalizada' : 'Pendente'}
//                   </span>
//                 </div>
//               </div>
//               <button onClick={() => handleDelete(task.id)} className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-red-500 transition-all">
//                 <TrashIcon className="w-5 h-5" />
//               </button>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;



import { useCallback, useEffect, useMemo, useState } from 'react';
import api from './services/api';
import { 
  PlusIcon, 
  TrashIcon, 
  CheckCircleIcon, 
  CircleStackIcon,
  PencilSquareIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [filter, setFilter] = useState('all');

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editStatus, setEditStatus] = useState('pending');
  const [editError, setEditError] = useState('');
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  const fetchTasks = useCallback(async () => {
    try {
      const response = await api.get('/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Erro ao buscar tasks:', error);
    }
  }, []);

  const closeEditModal = useCallback((force = false) => {
    if (isSavingEdit && !force) return;
    setIsEditOpen(false);
    setEditingTaskId(null);
    setEditTitle('');
    setEditDescription('');
    setEditStatus('pending');
    setEditError('');
  }, [isSavingEdit]);

  const openEditModal = useCallback((task) => {
    setEditError('');
    setEditingTaskId(task.id);
    setEditTitle(task.title ?? '');
    setEditDescription(task.description ?? '');
    setEditStatus(task.status ?? 'pending');
    setIsEditOpen(true);
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchTasks();
    }, 0);
    return () => clearTimeout(timeoutId);
  }, [fetchTasks]);

  useEffect(() => {
    if (!isEditOpen) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeEditModal();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isEditOpen, closeEditModal]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    try {
      await api.post('/tasks', { 
        title, 
        description,
      });
      setTitle('');
      setDescription('');
      fetchTasks();
    } catch (error) {
      console.error("Erro ao criar task:", error);
    }
  };

  const handleToggle = async (id, currentStatus) => {
    try {
      const nextStatus = currentStatus === 'completed' ? 'pending' : 'completed';
      await api.patch(`/tasks/${id}`, { status: nextStatus });
      fetchTasks();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (error) {
      console.error('Erro ao deletar task:', error);
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingTaskId) return;
    if (!editTitle.trim()) {
      setEditError('O título é obrigatório.');
      return;
    }

    setIsSavingEdit(true);
    setEditError('');
    try {
      await api.patch(`/tasks/${editingTaskId}`, {
        title: editTitle.trim(),
        description: editDescription,
        status: editStatus,
      });
      closeEditModal(true);
      fetchTasks();
    } catch (error) {
      console.error('Erro ao editar task:', error);
      setEditError('Não foi possível salvar as alterações.');
    } finally {
      setIsSavingEdit(false);
    }
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const isCompleted = t.status === 'completed';
      if (filter === 'pending') return !isCompleted;
      if (filter === 'completed') return isCompleted;
      return true;
    });
  }, [tasks, filter]);

  return (
    <div className="min-h-screen py-12 px-4 bg-slate-50 font-sans text-slate-900">
      <div className="max-w-xl mx-auto">
        
        {/* Header */}
        <header className="mb-10 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-600 rounded-2xl mb-4 shadow-lg shadow-indigo-200">
            <CircleStackIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">TaskFlow</h1>
          <p className="text-slate-500 mt-2 font-medium">Modern Task Management</p>
        </header>

        {/* Input Card (Formulário com Descrição) */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 mb-8 transition-all focus-within:border-indigo-300">
          <form onSubmit={handleCreate} className="space-y-3">
            <input 
              type="text" 
              className="w-full bg-transparent border-none focus:ring-0 px-2 py-1 text-lg font-bold placeholder-slate-400"
              placeholder="Título da tarefa..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea 
              className="w-full bg-transparent border-none focus:ring-0 px-2 py-1 text-sm text-slate-600 placeholder-slate-400 resize-none"
              placeholder="Adicione uma descrição detalhada..."
              rows="2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className="flex justify-end pt-2 border-t border-slate-50">
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-md active:scale-95 flex items-center gap-2">
                <PlusIcon className="w-4 h-4" /> Criar Task
              </button>
            </div>
          </form>
        </div>

        {/* Filtros */}
        <div className="flex justify-center gap-3 mb-8">
          {['all', 'pending', 'completed'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                filter === f 
                ? 'bg-slate-900 text-white shadow-lg' 
                : 'bg-white text-slate-400 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {f === 'all' ? 'Todas' : f === 'pending' ? 'Pendentes' : 'Concluídas'}
            </button>
          ))}
        </div>

        {/* Listagem */}
        <div className="space-y-4">
          {filteredTasks.map(task => (
            (() => {
              const isCompleted = task.status === 'completed';
              return (
            <div 
              key={task.id} 
              className="group bg-white border border-slate-200 rounded-2xl p-5 flex items-start justify-between hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5 transition-all"
            >
              <div className="flex gap-4">
                <button 
                  onClick={() => handleToggle(task.id, task.status)}
                  className={`mt-1 transition-all duration-300 ${
                    isCompleted ? 'text-emerald-500' : 'text-slate-200 hover:text-indigo-400'
                  }`}
                >
                  <CheckCircleIcon className="w-7 h-7" />
                </button>
                <div className="space-y-1">
                  <h3 className={`text-base font-bold transition-all ${
                    isCompleted ? 'line-through text-slate-400' : 'text-slate-800'
                  }`}>
                    {task.title}
                  </h3>
                  
                  {/* Exibição da Descrição */}
                  {task.description && (
                    <p className={`text-sm leading-relaxed ${
                      isCompleted ? 'text-slate-300' : 'text-slate-500'
                    }`}>
                      {task.description}
                    </p>
                  )}

                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-tighter ${
                      isCompleted ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {isCompleted ? 'Finalizada' : 'Em Aberto'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all">
                <button
                  onClick={() => openEditModal(task)}
                  className="p-2 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                  aria-label="Editar task"
                  type="button"
                >
                  <PencilSquareIcon className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => handleDelete(task.id)}
                  className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  aria-label="Excluir task"
                  type="button"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
              );
            })()
          ))}
        </div>
      </div>

      {/* Modal de Edição */}
      {isEditOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          role="dialog"
          aria-modal="true"
          aria-label="Editar task"
        >
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={closeEditModal}
          />

          <div className="relative w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-2xl">
            <div className="flex items-start justify-between gap-4 p-5 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-extrabold tracking-tight text-slate-900">Editar task</h2>
                <p className="text-xs text-slate-500 mt-1">Atualize as informações e salve as alterações.</p>
              </div>
              <button
                type="button"
                onClick={closeEditModal}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
                aria-label="Fechar modal"
                disabled={isSavingEdit}
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-5 space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500">Título</label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-300"
                  placeholder="Título da tarefa"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500">Descrição</label>
                <textarea
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-300"
                  placeholder="Adicione uma descrição"
                  rows={4}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500">Status</label>
                <select
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-300"
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                >
                  <option value="pending">Pendente</option>
                  <option value="in_progress">Em andamento</option>
                  <option value="completed">Concluída</option>
                </select>
              </div>

              {editError && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {editError}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-4 py-2 rounded-xl text-sm font-black text-slate-600 hover:bg-slate-100 transition-all"
                  disabled={isSavingEdit}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-black transition-all shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                  disabled={isSavingEdit}
                >
                  {isSavingEdit ? 'Salvando...' : 'Salvar alterações'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;