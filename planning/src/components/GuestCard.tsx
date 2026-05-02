import React from 'react';
import { Draggable } from '@hello-pangea/dnd';

export interface Guest {
  "Submission ID": string;
  "First Name": string;
  Surname: string;
  "Guest Category": string;
}

interface GuestCardProps {
  guest: Guest;
  index: number;
}

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Family':
      return 'bg-amber-900/40 text-amber-300 border-amber-700/50';
    case 'Bankers':
      return 'bg-blue-900/40 text-blue-300 border-blue-700/50';
    case 'COF':
      return 'bg-purple-900/40 text-purple-300 border-purple-700/50';
    case 'Christ Embassy/LOVEWORLD':
      return 'bg-teal-900/40 text-teal-300 border-teal-700/50';
    case 'Energy Industry Friends':
      return 'bg-emerald-900/40 text-emerald-300 border-emerald-700/50';
    case 'Fellow Directors':
      return 'bg-indigo-900/40 text-indigo-300 border-indigo-700/50';
    case 'Gold Coast':
      return 'bg-orange-900/40 text-orange-300 border-orange-700/50';
    case 'Consultants':
      return 'bg-slate-700/40 text-slate-300 border-slate-600/50';
    default:
      return 'bg-white/5 text-white/70 border-white/10';
  }
};

export const GuestCard: React.FC<GuestCardProps> = ({ guest, index }) => {
  return (
    <Draggable draggableId={guest["Submission ID"]} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`p-3 mb-2 rounded-xl backdrop-blur-md border ${getCategoryColor(guest["Guest Category"])} ${
            snapshot.isDragging ? 'shadow-2xl shadow-black/50 scale-105 z-50' : 'shadow-sm'
          } transition-all duration-200 flex flex-col gap-1`}
          style={{ ...provided.draggableProps.style }}
        >
          <div className="flex justify-between items-start">
            <span className="font-bodoni font-semibold tracking-wide text-sm truncate">
              {guest["First Name"]} {guest.Surname}
            </span>
          </div>
          <span className="text-[10px] uppercase tracking-wider opacity-80 font-medium truncate">
            {guest["Guest Category"]}
          </span>
        </div>
      )}
    </Draggable>
  );
};
