import React, { useState, useMemo } from 'react';
import {
  X,
  Search,
  MessageSquare,
  Plus,
  Trash2,
  Edit2,
  Check,
  Calendar,
  Clock,
  Sparkles,
  AlertTriangle,
  ChevronRight,
  Pin,
  ExternalLink,
  Archive,
} from 'lucide-react';
import { ConversationThread } from '../types.ts';
import { soundFx } from '../utils/audio.ts';

interface HistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  conversations: ConversationThread[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  onDeleteConversation: (id: string) => void;
  onRenameConversation: (id: string, newTitle: string) => void;
  onClearAllHistory: () => void;
}

export const HistorySidebar: React.FC<HistorySidebarProps> = ({
  isOpen,
  onClose,
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewChat,
  onDeleteConversation,
  onRenameConversation,
  onClearAllHistory,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Filter conversations by search term across title and message contents
  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    const lower = searchQuery.toLowerCase();

    return conversations.filter((c) => {
      const matchTitle = c.title.toLowerCase().includes(lower);
      const matchMessages = c.messages.some((m) =>
        m.text.toLowerCase().includes(lower)
      );
      return matchTitle || matchMessages;
    });
  }, [conversations, searchQuery]);

  // Group conversations by date: Today, Yesterday, Previous 7 Days, Older
  const groupedConversations = useMemo(() => {
    const today: ConversationThread[] = [];
    const yesterday: ConversationThread[] = [];
    const last7Days: ConversationThread[] = [];
    const older: ConversationThread[] = [];

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const startOfYesterday = startOfToday - 86400000;
    const startOf7Days = startOfToday - 7 * 86400000;

    filteredConversations.forEach((conv) => {
      const convTime = new Date(conv.updatedAt || conv.createdAt).getTime();
      if (convTime >= startOfToday) {
        today.push(conv);
      } else if (convTime >= startOfYesterday) {
        yesterday.push(conv);
      } else if (convTime >= startOf7Days) {
        last7Days.push(conv);
      } else {
        older.push(conv);
      }
    });

    return { today, yesterday, last7Days, older };
  }, [filteredConversations]);

  const handleStartRename = (e: React.MouseEvent, conv: ConversationThread) => {
    e.stopPropagation();
    soundFx.playClick();
    setEditingId(conv.id);
    setEditingTitle(conv.title);
  };

  const handleSaveRename = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (editingTitle.trim()) {
      soundFx.playClick();
      onRenameConversation(id, editingTitle.trim());
    }
    setEditingId(null);
  };

  const handleCancelRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(null);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    soundFx.playClick();
    onDeleteConversation(id);
  };

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return new Intl.DateTimeFormat('en-IN', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } catch {
      return '';
    }
  };

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          onClick={() => {
            soundFx.playPanel();
            onClose();
          }}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xs transition-opacity lg:hidden"
        />
      )}

      {/* Futuristic Drawer / Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-80 sm:w-96 bg-[#070C16] border-r border-cyan-500/30 shadow-2xl shadow-cyan-950/60 flex flex-col transition-transform duration-300 ease-in-out cyber-grid ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header */}
        <div className="p-4 border-b border-cyan-500/20 bg-[#0B1324]/90 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shadow-sm shadow-cyan-500/20">
              <Archive className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-wider text-white flex items-center gap-2">
                SEARCH ARCHIVES
                <span className="text-[10px] font-mono px-1.5 py-0.2 bg-cyan-950 text-cyan-400 rounded border border-cyan-500/30">
                  {conversations.length}
                </span>
              </h2>
              <p className="text-[10px] font-mono text-cyan-300/60">SESSION LOG VAULT</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                soundFx.playPanel();
                onClose();
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Close sidebar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Action button: New Chat */}
        <div className="p-3 border-b border-slate-800/80 bg-[#09101F]">
          <button
            onClick={() => {
              soundFx.playSend();
              onNewChat();
              if (window.innerWidth < 1024) onClose();
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold text-xs tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-900/30 transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            START NEW CHAT
          </button>
        </div>

        {/* Search Input Bar */}
        <div className="p-3 border-b border-slate-800/80 bg-[#070D1A]">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-cyan-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chat history & keywords..."
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-[#0D1629] border border-cyan-500/30 focus:border-cyan-400 text-xs text-white placeholder-slate-400 focus:outline-none transition-all shadow-inner font-sans"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 p-1 text-slate-400 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {filteredConversations.length === 0 ? (
            <div className="text-center py-12 px-4 space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-slate-900/80 border border-slate-800 mx-auto flex items-center justify-center text-slate-500">
                <Search className="w-6 h-6" />
              </div>
              <p className="text-xs font-semibold text-slate-400">
                {searchQuery ? 'No matching conversations' : 'No history saved yet'}
              </p>
              <p className="text-[11px] text-slate-500">
                {searchQuery
                  ? 'Try searching with different keywords or languages.'
                  : 'Start chatting with HINDUSTAN AI to automatically record threads.'}
              </p>
            </div>
          ) : (
            <>
              {/* Render Group: Today */}
              {groupedConversations.today.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono text-cyan-400/80 uppercase tracking-wider px-2 font-semibold">
                    Today
                  </span>
                  {groupedConversations.today.map((conv) => (
                    <ConversationItem
                      key={conv.id}
                      conv={conv}
                      isActive={conv.id === activeConversationId}
                      isEditing={editingId === conv.id}
                      editingTitle={editingTitle}
                      setEditingTitle={setEditingTitle}
                      onSelect={() => {
                        soundFx.playClick();
                        onSelectConversation(conv.id);
                        if (window.innerWidth < 1024) onClose();
                      }}
                      onStartRename={(e) => handleStartRename(e, conv)}
                      onSaveRename={(e) => handleSaveRename(e, conv.id)}
                      onCancelRename={handleCancelRename}
                      onDelete={(e) => handleDelete(e, conv.id)}
                      formatTime={formatTime}
                    />
                  ))}
                </div>
              )}

              {/* Render Group: Yesterday */}
              {groupedConversations.yesterday.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider px-2 font-semibold">
                    Yesterday
                  </span>
                  {groupedConversations.yesterday.map((conv) => (
                    <ConversationItem
                      key={conv.id}
                      conv={conv}
                      isActive={conv.id === activeConversationId}
                      isEditing={editingId === conv.id}
                      editingTitle={editingTitle}
                      setEditingTitle={setEditingTitle}
                      onSelect={() => {
                        soundFx.playClick();
                        onSelectConversation(conv.id);
                        if (window.innerWidth < 1024) onClose();
                      }}
                      onStartRename={(e) => handleStartRename(e, conv)}
                      onSaveRename={(e) => handleSaveRename(e, conv.id)}
                      onCancelRename={handleCancelRename}
                      onDelete={(e) => handleDelete(e, conv.id)}
                      formatTime={formatTime}
                    />
                  ))}
                </div>
              )}

              {/* Render Group: Last 7 Days */}
              {groupedConversations.last7Days.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider px-2 font-semibold">
                    Previous 7 Days
                  </span>
                  {groupedConversations.last7Days.map((conv) => (
                    <ConversationItem
                      key={conv.id}
                      conv={conv}
                      isActive={conv.id === activeConversationId}
                      isEditing={editingId === conv.id}
                      editingTitle={editingTitle}
                      setEditingTitle={setEditingTitle}
                      onSelect={() => {
                        soundFx.playClick();
                        onSelectConversation(conv.id);
                        if (window.innerWidth < 1024) onClose();
                      }}
                      onStartRename={(e) => handleStartRename(e, conv)}
                      onSaveRename={(e) => handleSaveRename(e, conv.id)}
                      onCancelRename={handleCancelRename}
                      onDelete={(e) => handleDelete(e, conv.id)}
                      formatTime={formatTime}
                    />
                  ))}
                </div>
              )}

              {/* Render Group: Older */}
              {groupedConversations.older.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider px-2 font-semibold">
                    Older
                  </span>
                  {groupedConversations.older.map((conv) => (
                    <ConversationItem
                      key={conv.id}
                      conv={conv}
                      isActive={conv.id === activeConversationId}
                      isEditing={editingId === conv.id}
                      editingTitle={editingTitle}
                      setEditingTitle={setEditingTitle}
                      onSelect={() => {
                        soundFx.playClick();
                        onSelectConversation(conv.id);
                        if (window.innerWidth < 1024) onClose();
                      }}
                      onStartRename={(e) => handleStartRename(e, conv)}
                      onSaveRename={(e) => handleSaveRename(e, conv.id)}
                      onCancelRename={handleCancelRename}
                      onDelete={(e) => handleDelete(e, conv.id)}
                      formatTime={formatTime}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer: Clear All History Action */}
        <div className="p-3 border-t border-cyan-500/20 bg-[#091122]/90 flex items-center justify-between">
          <div className="text-[11px] font-mono text-slate-400">
            STORAGE: <span className="text-cyan-400">PERSISTENT</span>
          </div>

          {conversations.length > 0 && (
            <button
              onClick={() => {
                soundFx.playClick();
                setShowClearConfirm(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 border border-transparent hover:border-rose-500/30 transition-colors cursor-pointer"
              title="Clear all conversations"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear All History
            </button>
          )}
        </div>

        {/* Clear All Confirmation Dialog */}
        {showClearConfirm && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="w-full max-w-xs bg-[#0F172A] border border-rose-500/50 rounded-2xl p-4 shadow-2xl text-slate-100 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-center text-white">Clear All History?</h3>
              <p className="text-xs text-center text-slate-400 leading-relaxed">
                This will permanently delete all {conversations.length} saved conversations from this device.
              </p>
              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="px-3 py-1.5 rounded-lg text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    soundFx.playClick();
                    onClearAllHistory();
                    setShowClearConfirm(false);
                  }}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white transition-colors shadow-md shadow-rose-900/40"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

// Item Component for each conversation card
interface ItemProps {
  conv: ConversationThread;
  isActive: boolean;
  isEditing: boolean;
  editingTitle: string;
  setEditingTitle: (t: string) => void;
  onSelect: () => void;
  onStartRename: (e: React.MouseEvent) => void;
  onSaveRename: (e: React.MouseEvent) => void;
  onCancelRename: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
  formatTime: (t: string) => string;
}

const ConversationItem: React.FC<ItemProps> = ({
  conv,
  isActive,
  isEditing,
  editingTitle,
  setEditingTitle,
  onSelect,
  onStartRename,
  onSaveRename,
  onCancelRename,
  onDelete,
  formatTime,
}) => {
  return (
    <div
      onClick={onSelect}
      className={`group relative p-2.5 rounded-xl transition-all cursor-pointer border ${
        isActive
          ? 'bg-[#101D36] border-cyan-400/70 shadow-md shadow-cyan-950/50'
          : 'bg-[#0B1324]/60 hover:bg-[#0E182D] border-slate-800/80 hover:border-cyan-500/30'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <MessageSquare
            className={`w-3.5 h-3.5 shrink-0 ${
              isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-cyan-400'
            }`}
          />

          {isEditing ? (
            <input
              type="text"
              autoFocus
              value={editingTitle}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => setEditingTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onSaveRename(e as any);
                if (e.key === 'Escape') onCancelRename(e as any);
              }}
              className="w-full px-2 py-0.5 rounded bg-[#070C16] border border-cyan-400 text-xs text-white focus:outline-none font-medium"
            />
          ) : (
            <span
              className={`text-xs font-medium truncate ${
                isActive ? 'text-white font-semibold' : 'text-slate-300 group-hover:text-white'
              }`}
            >
              {conv.title || 'Untitled Conversation'}
            </span>
          )}
        </div>

        {/* Inline Actions: Rename, Save, Delete */}
        <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
          {isEditing ? (
            <>
              <button
                onClick={onSaveRename}
                className="p-1 rounded text-cyan-400 hover:bg-cyan-950"
                title="Save title"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onCancelRename}
                className="p-1 rounded text-slate-400 hover:bg-slate-800"
                title="Cancel rename"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onStartRename}
                className="p-1 rounded text-slate-400 hover:text-cyan-300 hover:bg-slate-800/80 transition-colors"
                title="Rename chat"
              >
                <Edit2 className="w-3 h-3" />
              </button>
              <button
                onClick={onDelete}
                className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 transition-colors"
                title="Delete chat"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Timestamp and message count */}
      <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mt-1.5 pl-5.5">
        <span>{formatTime(conv.updatedAt || conv.createdAt)}</span>
        <span className="px-1.5 py-0.2 rounded bg-slate-800/60 text-slate-400">
          {conv.messages.length} msg{conv.messages.length !== 1 ? 's' : ''}
        </span>
      </div>
    </div>
  );
};
