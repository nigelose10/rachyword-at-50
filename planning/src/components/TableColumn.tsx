import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { Guest, GuestCard } from './GuestCard';
import { Users, GripHorizontal } from 'lucide-react';

interface TableColumnProps {
  id: string;
  title: string;
  guests: Guest[];
  capacity?: number;
}

export const TableColumn: React.FC<TableColumnProps> = ({ id, title, guests, capacity = 10 }) => {
  const isFull = guests.length >= capacity;

  return (
    <div className="flex flex-col bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden min-w-[280px] max-w-[280px] max-h-[70vh]">
      {/* Header */}
      <div className="p-4 border-b border-white/10 bg-white/5 flex items-center justify-between sticky top-0 z-10 cursor-grab active:cursor-grabbing">
        <div className="flex items-center gap-2">
          <GripHorizontal size={16} className="text-white/40" />
          <h3 className="font-bodoni text-lg text-white font-medium tracking-wide">
            {title}
          </h3>
        </div>
        <div className={`flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-full ${isFull ? 'bg-red-500/20 text-red-300' : 'bg-white/10 text-white/70'}`}>
          <Users size={12} />
          <span>{guests.length} / {capacity}</span>
        </div>
      </div>

      {/* Droppable Area */}
      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 overflow-y-auto p-3 transition-colors duration-200 min-h-[150px] ${
              snapshot.isDraggingOver ? 'bg-white/5' : ''
            }`}
          >
            {guests.map((guest, index) => (
              <GuestCard key={guest["Submission ID"]} guest={guest} index={index} />
            ))}
            {provided.placeholder}
            
            {guests.length === 0 && !snapshot.isDraggingOver && (
              <div className="h-full flex flex-col items-center justify-center opacity-30 text-center p-4">
                <span className="text-sm font-light italic">Empty Table</span>
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
};
